import os
import runpy
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
STREAMLIT_APP_DIR = ROOT_DIR / "learning" / "erp-responsible-ai"
RESPONSIBLE_APP_FILE = STREAMLIT_APP_DIR / "responsible_erp_app.py"

if not RESPONSIBLE_APP_FILE.exists():
    raise FileNotFoundError(
        f"Responsible ERP app file not found: {RESPONSIBLE_APP_FILE}"
    )

previous_cwd = Path.cwd()
os.chdir(STREAMLIT_APP_DIR)
try:
    runpy.run_path(str(RESPONSIBLE_APP_FILE), run_name="__main__")
finally:
    os.chdir(previous_cwd)

