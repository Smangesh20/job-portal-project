# Deploy AskYaCham Frontend on Vercel + Namecheap DNS

This guide deploys the **frontend** to Vercel and points `www.askyacham.com` to it via Namecheap.
The backend API should be deployed separately (for example on Render/Railway/Fly.io), and the
frontend should be configured to use that API URL.

---

## Prerequisites

- GitHub repo with this code pushed
- Vercel account
- Backend API URL (example: `https://api.askyacham.com`)
- MongoDB Atlas configured for the backend
- Domain `askyacham.com` on Namecheap with DNS access

---

## Step 1: Deploy the backend (required)

Deploy the API server first so you have a stable URL to point the frontend to.
If you use Render, `render.yaml` is already included in this repo.

Make sure the backend has:
- `MONGODB_URI` set
- `JWT_SECRET` set
- A stable public URL (example: `https://api.askyacham.com`)

---

## Step 2: One-click deploy the frontend to Vercel

Use the **Deploy with Vercel** button in `README.md` or import the repo manually:

1. Vercel Project Settings:
   - **Root Directory:** `frontend`
2. Environment Variables:
   - `REACT_APP_API_BASE_URL` = your backend URL (example: `https://api.askyacham.com`)
3. Deploy.

The `frontend/vercel.json` file enables SPA routing so React routes work on refresh.

---

## Step 3: Add domain in Vercel

In the Vercel dashboard:
1. Project Settings → **Domains**
2. Add **www.askyacham.com**
3. (Optional) Add **askyacham.com** as well for the apex

Vercel will show the exact DNS record(s) you must add. Use those values exactly.

---

## Step 4: Configure Namecheap DNS

Namecheap → Domain List → **Manage** → **Advanced DNS**:

- Add or update **CNAME** for `www` using the target Vercel provides.
- If you added the apex in Vercel, add the **A** or **ALIAS** record it provides.
- Do not remove mail-related records (MX/SPF/DKIM/DMARC).

Save and wait for DNS propagation.

---

## Step 5: Verify

- `https://www.askyacham.com` loads the frontend
- `https://api.askyacham.com/health` returns `{"status":"ok", ...}` (example API URL)
- Login, signup, jobs, and learning flows work end-to-end

