from flask import Blueprint, request, jsonify
from services.suno_services import (
    generate_song,
    get_clips,
    poll_until_complete
)

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


