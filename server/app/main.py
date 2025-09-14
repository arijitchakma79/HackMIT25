from fastapi import FastAPI
from app.routes import voice, suno

app = FastAPI(title="Voice Agent")

# Register routers
app.include_router(voice.router, prefix="/voice", tags=["voice"])
app.include_router(suno.router, prefix="/suno", tags=["suno"])
