import os
import runpy
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
STREAMLIT_APP_DIR = ROOT_DIR / "learning" / "erp-responsible-ai"
VOICE_APP_FILE = STREAMLIT_APP_DIR / "voice_erp_coach.py"

if not VOICE_APP_FILE.exists():
    raise FileNotFoundError(f"Voice app file not found: {VOICE_APP_FILE}")

previous_cwd = Path.cwd()
os.chdir(STREAMLIT_APP_DIR)
try:
    runpy.run_path(str(VOICE_APP_FILE), run_name="__main__")
finally:
    os.chdir(previous_cwd)

