import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUNO_BASE_URL = os.getenv("SUNO_BASE_URL")
SUNO_API_KEY = os.getenv("SUNO_API_KEY")

# OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY)


