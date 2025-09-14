from flask import Blueprint, request, jsonify
from services.suno_services import (
    generate_song,
    get_clips,
    poll_until_complete
)
import openai
import os
import re

suna = Blueprint("suna", __name__)
@suna.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    try:
        print(f"Received request data: {data}")
        
        # Get the user's input
        user_input = data.get("prompt", "")
        topic = data.get("topic")
        tags = data.get("tags")
        
        # Process the user input to extract musical style vs lyrical content
        musical_style = ""
        lyrical_content = ""
        make_instrumental = True  # Default to instrumental
        
        # Check if user specifically wants lyrics
        lyric_keywords = ["sing about", "lyrics about", "song about", "vocals", "singing", "words"]
        wants_lyrics = any(keyword in user_input.lower() for keyword in lyric_keywords)
        
        if wants_lyrics:
            make_instrumental = False
            lyrical_content = user_input
        else:
            # Treat input as musical style/vibe
            musical_style = user_input
            make_instrumental = True
        
        # If tags are provided, use them; otherwise use the processed style
        final_tags = tags if tags else musical_style
        final_prompt = lyrical_content if lyrical_content else None
        
        print(f"Processed - Tags: {final_tags}, Prompt: {final_prompt}, Instrumental: {make_instrumental}")
        
        res = generate_song(
            topic=topic,
            tags=final_tags,
            prompt=final_prompt,
            make_instrumental=make_instrumental,
            cover_clip_id=data.get("cover_clip_id")
        )
        print(f"Generated song response: {res}")
        clip_id = res["id"]
        clip = poll_until_complete(clip_id)
        return jsonify({
            "clip_id": clip_id,
            "status": clip["status"],
            "audio_url": clip.get("audio_url")
        })
    except Exception as e:
        print(f"Error in generate route: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@suna.route("/dj-chat", methods=["POST"])
def dj_chat():
    """
    Conversational AI DJ endpoint that takes user input and returns DJ responses
    along with extracted music prompts for Suno API
    """
    data = request.get_json()
    try:
        user_message = data.get("message", "")
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Set OpenAI API key
        openai.api_key = os.getenv('OPENAI_API_KEY')
        
        if not openai.api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        
        # DJ system prompt - Updated to focus on musical style and instrumentation
        system_prompt = """You are DJ Synthra, a cool and charismatic AI DJ assistant. Your personality is:
        - Enthusiastic about music and helping people discover new sounds
        - Uses DJ slang and music terminology naturally
        - Responds conversationally but keeps it concise
        - Focuses on MUSICAL STYLE, not lyrics
        
        Your job is to:
        1. Chat with users about their music preferences
        2. Understand what kind of MUSICAL STYLE and VIBE they want
        3. Provide specific musical tags and style descriptors for INSTRUMENTAL music generation
        4. Always end responses with musical style tags in brackets like [STYLE: upbeat electronic dance music, heavy bass, synthesizers, 128 bpm]
        
        IMPORTANT: Focus on musical elements like:
        - Genre (electronic, rock, jazz, hip-hop, etc.)
        - Tempo and energy (upbeat, chill, aggressive, mellow)
        - Instruments (synthesizers, guitar, drums, piano)
        - Production style (ambient, heavy bass, distorted, clean)
        - Mood (energetic, dark, uplifting, mysterious)
        
        DO NOT include lyrical content or vocal descriptions unless specifically requested.
        Keep responses under 100 words and always include the [STYLE: ...] at the end."""
        
        # Call OpenAI API using older style
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.8
        )
        
        dj_response = response.choices[0].message.content
        
        # Extract the musical style tags from the response
        style_match = re.search(r'\[STYLE:\s*(.*?)\]', dj_response, re.IGNORECASE)
        musical_style = style_match.group(1) if style_match else user_message
        
        # Clean up the DJ response by removing the style part
        clean_dj_response = re.sub(r'\[STYLE:.*?\]', '', dj_response, flags=re.IGNORECASE).strip()
        
        return jsonify({
            "dj_response": clean_dj_response,
            "musical_style": musical_style,
            "music_prompt": musical_style,  # For backward compatibility
            "success": True
        })
        
    except Exception as e:
        print(f"Error in dj_chat route: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "dj_response": "Yo, I'm having some technical difficulties right now. Let me try that again in a sec!",
            "music_prompt": data.get("message", "upbeat instrumental music"),
            "musical_style": data.get("message", "upbeat instrumental music"),
            "success": False
        }), 500

@suna.route("/generate-from-style", methods=["POST"])
def generate_from_style():
    """
    Generate music specifically from style descriptions (not lyrics)
    This route ensures the input is treated as musical style, not lyrics
    """
    data = request.get_json()
    try:
        print(f"Received style-based request: {data}")
        
        style_description = data.get("style", data.get("prompt", ""))
        
        # Always treat as instrumental style
        res = generate_song(
            topic=None,
            tags=style_description,  # Use tags field for style
            prompt=None,  # No lyrics
            make_instrumental=True,  # Always instrumental
            cover_clip_id=data.get("cover_clip_id")
        )
        
        print(f"Generated song response: {res}")
        clip_id = res["id"]
        clip = poll_until_complete(clip_id)
        return jsonify({
            "clip_id": clip_id,
            "status": clip["status"],
            "audio_url": clip.get("audio_url")
        })
    except Exception as e:
        print(f"Error in generate_from_style route: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


