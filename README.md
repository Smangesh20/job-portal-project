# Job Portal

Job Portal is a MERN Stack based web app which helps in streamlining the flow of job application process. It allows users to select there roles (applicant/recruiter), and create an account. In this web app, login session are persistent and REST APIs are securely protected by JWT token verification. After logging in, a recruiter can create/delete/update jobs, shortlist/accept/reject applications, view resume and edit profile. And, an applicant can view jobs, perform fuzzy search with various filters, apply for jobs with an SOP, view applications, upload profile picture, upload resume and edit profile. Hence, it is an all in one solution for a job application system.

## One-Click Deployment (Vercel + Namecheap)

Deploy the **frontend** to Vercel with a single click, then connect `www.askyacham.com` in Namecheap.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsawantmangesh89-arch%2Fjob-portal&root-directory=frontend&project-name=askyacham)

After deployment, follow the domain setup steps in `DEPLOY_VERCEL_NAMECHEAP.md`.

## One-Click Deployment (Streamlit Community Cloud)

Use Streamlit one-click deploy links for the integrated ERP learning apps.

### Option 1: Voice ERP Coach

[![Deploy to Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/deploy?owner=b30wulffz&repo=job-portal&branch=main&mainModule=streamlit_voice_app.py)

### Option 2: Responsible ERP App

[![Deploy to Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/deploy?owner=b30wulffz&repo=job-portal&branch=main&mainModule=streamlit_responsible_app.py)

### Auto-generate one-click URL from your current branch

Windows PowerShell:

```powershell
./scripts/deploy-streamlit.ps1 -App voice
./scripts/deploy-streamlit.ps1 -App responsible
```

Linux/macOS:

```bash
./scripts/deploy-streamlit.sh voice
./scripts/deploy-streamlit.sh responsible
```

### Streamlit deploy notes

- These launchers run apps from:
  - `learning/erp-responsible-ai/voice_erp_coach.py`
  - `learning/erp-responsible-ai/responsible_erp_app.py`
- Root `requirements.txt` points to `learning/erp-responsible-ai/requirements.txt`.
- Repository must be accessible from Streamlit Community Cloud (public or permitted access).

Demo: [Click Here](https://www.youtube.com/watch?v=lIrN-LbbBnw&ab_channel=ShlokPandey)

Directory structure of the web app is as follows:

```
- backend/
    - public/
        - profile/
        - resume/
- frontend/
- README.md
```

## Instructions for initializing web app:

- Install Node JS, MongoDB in the machine.
- Start MongoDB server: `sudo service mongod start`
- Move inside backend directory: `cd backend`
- Install dependencies in backend directory: `npm install`
- Start express server: `npm start`
- Backend server will start on port 4444.
- Now go inside frontend directory: `cd ..\frontend`
- Install dependencies in frontend directory: `npm install`
- Start web app's frontend server: `npm start`
- Frontend server will start on port 3000.
- Now open `http://localhost:3000/` and proceed creating jobs and applications by signing up in required categories.

## Dependencies:

- Frontend
  - @material-ui/core
  - @material-ui/icons
  - @material-ui/lab
  - axios
  - material-ui-chip-input
  - react-phone-input-2
- Backend
  - bcrypt
  - body-parser
  - connect-flash
  - connect-mongo
  - cors
  - crypto
  - express
  - express-session
  - jsonwebtoken
  - mongoose
  - mongoose-type-email
  - multer
  - passport
  - passport-jwt
  - passport-local
  - uuid

# Machine Specifications

Details of the machine on which the webapp was tested:

- Operating System: Elementary OS 5.1 (Hera)
- Terminal: Bash
- Processor: Intel Core i7-8750H CPU @ 2.20 GHz 2.21 GHz
- RAM: 16 GB
