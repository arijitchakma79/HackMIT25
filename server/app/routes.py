from flask import Blueprint, request, jsonify

api_bp = Blueprint("api", __name__)

@api_bp.route("/generate-music", methods=["POST"])
def generate_music():
    data = request.get_json()
    prompt = data.get("prompt", "")
    tags = data.get("tags")
    make_instrumental = data.get("makeInstrumental", False)

    result = SunoService.generate_song(prompt, tags, make_instrumental)
    return jsonify(result)

@api_bp.route("/check-status", methods=["POST"])
def check_status():
    data = request.get_json()
    clip_ids = data.get("clipIds", [])
    result = SunoService.check_status(clip_ids)
    return jsonify(result)
