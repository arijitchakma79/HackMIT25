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
        res = generate_song(
            topic=data.get("topic"),
            tags=data.get("tags"),
            prompt=data.get("prompt"),
            make_instrumental=data.get("make_instrumental", False),
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
        
        # DJ system prompt
        system_prompt = """You are DJ Synthra, a cool and charismatic AI DJ assistant. Your personality is:
        - Enthusiastic about music and helping people discover new sounds
        - Uses DJ slang and music terminology naturally
        - Responds conversationally but keeps it concise
        - Always ends responses with a clear music generation prompt in brackets like [PROMPT: upbeat electronic dance music with heavy bass]
        
        Your job is to:
        1. Chat with users about their music preferences
        2. Understand what kind of music they want
        3. Provide a specific, detailed prompt for music generation
        
        Keep responses under 100 words and always include the [PROMPT: ...] at the end."""
        
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
        
        # Extract the music prompt from the response
        prompt_match = re.search(r'\[PROMPT:\s*(.*?)\]', dj_response, re.IGNORECASE)
        music_prompt = prompt_match.group(1) if prompt_match else user_message
        
        # Clean up the DJ response by removing the prompt part
        clean_dj_response = re.sub(r'\[PROMPT:.*?\]', '', dj_response, flags=re.IGNORECASE).strip()
        
        return jsonify({
            "dj_response": clean_dj_response,
            "music_prompt": music_prompt,
            "success": True
        })
        
    except Exception as e:
        print(f"Error in dj_chat route: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "dj_response": "Yo, I'm having some technical difficulties right now. Let me try that again in a sec!",
            "music_prompt": data.get("message", "upbeat music"),
            "success": False
        }), 500


