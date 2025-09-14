from fastapi import APIRouter
from pydantic import BaseModel
from app.services.suno_services import generate_song, poll_until_complete

router = APIRouter()

class SongRequest(BaseModel):
    topic: str | None = None
    tags: str | None = None           
    negative_tags: str | None = None
    prompt: str | None = None
    make_instrumental: bool = False
    cover_clip_id: str | None = None

@router.post("/generate")
def generate_song_route(request: SongRequest):
    payload = request.dict(exclude_none=True)

    # Suno expects JSON body as-is
    song = generate_song(payload)

    # `generate_song` now returns a dict, not a list
    clip_id = song["id"]

    # Poll until status = streaming or complete
    clip = poll_until_complete(clip_id)
    return {
        "clip_id": clip_id,
        "status": clip["status"],
        "audio_url": clip.get("audio_url"),
        "image_url": clip.get("image_url"),
        "metadata": clip.get("metadata", {})
    }
