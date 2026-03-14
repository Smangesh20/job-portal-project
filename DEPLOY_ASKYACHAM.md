# Deploy AskYaCham to https://www.askyacham.com

This guide walks you through deploying the app so it is live at **https://www.askyacham.com**.

---

## Prerequisites

- **GitHub** (or GitLab) repo with this code pushed
- **Render** account (free tier works): [render.com](https://render.com)
- **MongoDB Atlas** (free tier): [mongodb.com/atlas](https://www.mongodb.com/atlas)
- **Domain** `askyacham.com` (e.g. on Namecheap) with access to DNS

---

## Step 1: MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access** → Add Database User (save username and password).
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0) for Render.
4. **Database** → Connect → **Connect your application** → copy the connection string.
5. Replace `<password>` in the string with your user password.  
   Example: `mongodb+srv://user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/jobPortal?retryWrites=true&w=majority`  
   Save this as your **MONGODB_URI**.

---

## Step 2: Deploy on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
2. Connect your GitHub (or GitLab) and select the **job-portal** repo.
3. Configure:
   - **Name:** `askyacham`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your production branch)
   - **Root Directory:** leave blank (repo root)
   - **Runtime:** **Docker**
   - **Dockerfile Path:** `./Dockerfile` (or `Dockerfile`)
   - **Instance Type:** Free (or paid for always-on)

4. **Environment Variables** (Add or use “Sync from render.yaml” if you use Blueprint):
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = *generate a long random string (e.g. 32+ chars)*
   - `MONGODB_URI` = *your Atlas connection string from Step 1*
   - Optional (from `.env.example`):  
     `ENHANCED_ERROR_HANDLING`, `STRUCTURED_LOGGING`, `INPUT_VALIDATION`, `CORRELATION_TRACKING` = `true`

5. Click **Create Web Service**.  
   Render will build the Docker image (frontend + backend) and start the app.  
   Your app will be at: **https://askyacham.onrender.com** (or the name you gave).

6. Check **Logs** and open **https://your-service-name.onrender.com/health** — you should see `{"status":"ok",...}`.

---

## Step 3: Add custom domain www.askyacham.com

1. In Render: open your **askyacham** web service → **Settings** → **Custom Domains**.
2. Click **Add Custom Domain**.
3. Enter: **www.askyacham.com** → Add.
4. Render will show a **CNAME** target, e.g.:
   ```text
   www.askyacham.com  →  askyacham-xxxx.onrender.com
   ```
   (Or an A record / ALIAS — use what Render shows.)

5. In your domain registrar (e.g. Namecheap):
   - Go to **Domain List** → **Manage** for **askyacham.com** → **Advanced DNS**.
   - Add or edit:
     - **Type:** CNAME  
       **Host:** `www`  
       **Value:** `askyacham-xxxx.onrender.com` (exact value from Render)  
       **TTL:** 300 or Automatic
   - Remove any conflicting CNAME or URL Redirect for `www` that points elsewhere.
   - Save.

6. (Optional) Root domain **askyacham.com**:  
   In Render, add **askyacham.com** as well. Render will give an A record or ALIAS. Add that in DNS.  
   Or use a redirect from **askyacham.com** → **https://www.askyacham.com** in your registrar if supported.

7. Wait for DNS (5–30 minutes, sometimes up to 48 hours).  
   Render will issue SSL for your custom domain automatically.

---

## Step 4: Verify

1. **DNS**
   ```powershell
   nslookup www.askyacham.com
   ```
   Should resolve to Render’s host.

2. **Browser**
   - Open **https://www.askyacham.com** — app should load.
   - Open **https://www.askyacham.com/health** — should return `{"status":"ok",...}`.
   - Test login, signup, and main flows.

3. **SSL**  
   Render provides HTTPS; the padlock should show in the browser.

---

## Step 5: Redeploys

- **Auto:** If “Auto-Deploy” is on, every push to the connected branch triggers a new deploy.
- **Manual:** **Manual Deploy** → **Deploy latest commit** in the Render dashboard.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Build fails on frontend `npm ci` | Ensure `frontend/.npmrc` exists with `legacy-peer-deps=true` and is committed. |
| 503 / Service Unavailable | Free tier spins down after inactivity; first load can take ~30–60 s. Consider upgrading for always-on. |
| API calls fail / CORS | App is single-origin (same domain); no CORS issue. If you later split frontend to Vercel, set `REACT_APP_API_BASE_URL` to your API URL. |
| Domain not loading | Wait for DNS; confirm CNAME host `www` points exactly to Render’s target; clear browser cache. |
| MongoDB connection error | Check `MONGODB_URI`, password encoding, and that Atlas allows 0.0.0.0/0 (or Render’s IPs). |

---

## Summary

- **App URL:** https://www.askyacham.com  
- **Backend + frontend:** One Docker service on Render.  
- **Database:** MongoDB Atlas.  
- **Secrets:** Set `JWT_SECRET` and `MONGODB_URI` in Render; add custom domain in Render and point `www` via CNAME in your DNS.

After DNS has propagated, **https://www.askyacham.com** will serve your deployed AskYaCham app.
