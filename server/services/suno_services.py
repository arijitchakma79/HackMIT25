import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://studio-api.prod.suno.com/api/v2/external/hackmit"
API_KEY = os.getenv("SUNO_API_KEY")

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
}

class SunoService:
    @staticmethod
    def generate_song(prompt: str, tags: str = None, make_instrumental: bool = False):
        payload = {
            "prompt": prompt,
            "tags": tags,
            "makeInstrumental": make_instrumental,
        }
        try:
            response = requests.post(f"{BASE_URL}/generate-music", json=payload, headers=HEADERS)
            print("Generate status:", response.status_code)
            print("Generate response:", response.text)
            data = response.json()
            if not response.ok:
                raise Exception(data.get("error", "Failed to generate song"))
            return data
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def check_status(clip_ids: list[str]):
        try:
            response = requests.post(f"{BASE_URL}/check-status", json={"clipIds": clip_ids}, headers=HEADERS)
            print("Status:", response.status_code)
            print("Response:", response.text)
            data = response.json()
            if not response.ok:
                raise Exception(data.get("error", "Failed to check status"))
            return data
        except Exception as e:
            return {"success": False, "error": str(e)}
