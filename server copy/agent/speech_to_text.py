import sounddevice as sd
import numpy as np
import tempfile
import scipy.io.wavfile as wav
from openai import OpenAI
import os
import queue
from dotenv import load_dotenv

# Load .env variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found. Check your .env file!")

client = OpenAI(api_key=api_key)

samplerate = 16000
chunk_duration = 5  # seconds
block_size = 1024   # frames per block
q = queue.Queue()

def callback(indata, frames, time, status):
    if status:
        print(status)
    q.put(indata.copy())

with sd.InputStream(samplerate=samplerate, channels=1, callback=callback, blocksize=block_size):
    print("Listening... Press Ctrl+C to stop.")

    try:
        while True:
            frames = []
            # Collect enough blocks to fill chunk_duration
            num_blocks = int(samplerate * chunk_duration / block_size)
            for _ in range(num_blocks):
                frames.append(q.get())

            audio = np.concatenate(frames, axis=0)

            # Save to temp wav file
            temp_file = tempfile.mktemp(suffix=".wav")
            wav.write(temp_file, samplerate, audio)

            # Send to Whisper API
            with open(temp_file, "rb") as f:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=f
                )

            print("You said:", transcript.text)

    except KeyboardInterrupt:
        print("\nStopped.")
