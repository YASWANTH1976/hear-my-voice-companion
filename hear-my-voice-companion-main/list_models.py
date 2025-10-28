from dotenv import load_dotenv
from pathlib import Path
import os
import google.generativeai as genai

# Explicitly load the .env in the repo root
dotenv_path = Path(r"C:/Users/aftab/OneDrive/Desktop/hear-my-voice-companion-main/.env")
load_dotenv(dotenv_path)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise SystemExit("GEMINI_API_KEY not found in .env; please check the file and path")

genai.configure(api_key=api_key)

print("Listing available models (this may be long)...")
try:
    models = genai.list_models()
    for m in models:
        name = getattr(m, "name", None) or getattr(m, "model", None) or repr(m)
        print("MODEL:", name)
        # print a short repr without flooding
        try:
            # try to show some capabilities if available
            attrs = []
            if hasattr(m, 'description'):
                attrs.append(f"description={m.description}")
            if hasattr(m, 'id'):
                attrs.append(f"id={m.id}")
            if hasattr(m, 'name'):
                attrs.append(f"name={m.name}")
            if attrs:
                print("  ", ", ".join(attrs))
        except Exception:
            pass
except Exception as e:
    print("Error listing models:", e)
