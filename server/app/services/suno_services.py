import requests, time
from app.config import SUNO_BASE_URL, SUNO_API_KEY

HEADERS = {
    "Authorization": f"Bearer {SUNO_API_KEY}",
    "Content-Type": "application/json"
}

def generate_song(payload: dict):
    r = requests.post(f"{SUNO_BASE_URL}/generate", headers=HEADERS, json=payload)
    r.raise_for_status()
    return r.json()

def get_clips(clip_ids):
    ids_param = ",".join(clip_ids)
    r = requests.get(f"{SUNO_BASE_URL}/clips?ids={ids_param}", headers=HEADERS)
    r.raise_for_status()
    return r.json()

def poll_until_complete(clip_id, interval=5, max_attempts=30):
    for _ in range(max_attempts):
        clips = get_clips([clip_id])
        clip = clips[0]
        if clip["status"] in ["streaming", "complete"]:
            return clip
        if clip["status"] == "error":
            raise Exception(f"Generation failed: {clip['metadata'].get('error_message')}")
        time.sleep(interval)
    raise TimeoutError("Clip did not complete in time")
