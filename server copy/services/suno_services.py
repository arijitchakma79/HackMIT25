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
    ids_param = ",".join(clip_ids)
    r = requests.get(f"{BASE_URL}/clips?ids={ids_param}", headers=HEADERS)
    if not r.ok:
        raise Exception(f"Error {r.status_code}: {r.text}")
    return r.json()

def poll_until_complete(clip_id, interval=5, max_attempts=30):
    for attempt in range(max_attempts):
        clips = get_clips([clip_id])
        if not clips:
            raise Exception("Clip not found")
        clip = clips[0]
        status = clip["status"]

        if status in ["streaming", "complete"]:
            return clip
        if status == "error":
            raise Exception(f"Generation failed: {clip['metadata'].get('error_message')}")
        time.sleep(interval)
    raise TimeoutError("Clip did not complete in time")