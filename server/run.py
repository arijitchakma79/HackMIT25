import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("SUNO_BASE_URL")
API_KEY = os.getenv("SUNO_API_KEY")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def generate_song(topic=None, tags=None, prompt=None, make_instrumental=False, cover_clip_id=None):
    """
    Call the /generate endpoint to create a new song.
    You can provide:
      - topic (simple mode) OR
      - prompt (custom lyrics mode)
    """
    payload = {}
    if topic:
        payload["topic"] = topic
    if prompt:
        payload["prompt"] = prompt
    if tags:
        payload["tags"] = tags
    if make_instrumental:
        payload["make_instrumental"] = True
    if cover_clip_id:
        payload["cover_clip_id"] = cover_clip_id

    r = requests.post(f"{BASE_URL}/generate", headers=HEADERS, json=payload)
    if not r.ok:
        raise Exception(f"Error {r.status_code}: {r.text}")
    return r.json()


def get_clips(clip_ids):
    """
    Call the /clips endpoint to check clip status and get audio_url.
    clip_ids: list of UUID strings
    """
    ids_param = ",".join(clip_ids)
    r = requests.get(f"{BASE_URL}/clips?ids={ids_param}", headers=HEADERS)
    if not r.ok:
        raise Exception(f"Error {r.status_code}: {r.text}")
    return r.json()


def poll_until_complete(clip_id, interval=5, max_attempts=30):
    """
    Polls /clips until the clip is 'complete' or fails.
    Returns the clip object.
    """
    for attempt in range(max_attempts):
        clips = get_clips([clip_id])
        if not clips:
            raise Exception("Clip not found")
        clip = clips[0]
        status = clip["status"]
        print(f"Attempt {attempt+1}: status={status}")

        if status in ["streaming", "complete"]:
            # Audio is available during streaming
            return clip

        if status == "error":
            raise Exception(f"Generation failed: {clip['metadata'].get('error_message')}")

        time.sleep(interval)

    raise TimeoutError("Clip did not complete in time")


if __name__ == "__main__":
    # Step 1: Generate
    res = generate_song(
        topic="An upbeat pop song about coding at HackMIT",
        tags="pop, electronic, upbeat"
    )
    print("Generate response:", res)

    clip_id = res["id"]

    # Step 2: Poll until streaming/complete
    clip = poll_until_complete(clip_id)
    print("Final clip:", clip)

    print("Audio URL:", clip.get("audio_url"))

