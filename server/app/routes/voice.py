from fastapi import APIRouter, UploadFile
import tempfile, os
from app.config import openai_client

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile):
    # Save audio temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name

    # Send to Whisper
    with open(tmp_path, "rb") as f:
        transcript = openai_client.audio.transcriptions.create(
            model="whisper-1",
            file=f
        )

    return {"transcript": transcript.text}
