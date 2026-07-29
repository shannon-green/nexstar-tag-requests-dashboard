# Nexstar Tag Request Manager

A fullthrottle.ai-branded tool with two pages:

- **`/` (public link)** — partners submit new tag requests directly, no login, no handoff through a person.
- **`/dashboard` (password-protected)** — your team sees every submission, filters by status, and updates status as requests move through install.

Data is stored in a Vercel KV (Upstash Redis) database, so it persists across sessions and is shared between everyone who uses the tool — not just saved in one browser.

## Deploy it — step by step

### 1. Push the code to GitHub
1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `nexstar-tag-requests`). Keep it **Private**.
2. On the new repo's page, click **"uploading an existing file"**.
3. Drag in every file and folder from this project, keeping the folder structure (`api/`, `templates/`, `static/`, plus `vercel.json` and `requirements.txt` at the top level).
4. Click **Commit changes**.

### 2. Import it into Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and choose **Import** next to your new repo.
2. Leave the framework preset as-is (Vercel auto-detects Python) and click **Deploy**. The first deploy will work, but the app won't be usable yet — you still need the two things below.

### 3. Set up a fresh KV database for this project
Since your existing KV is on the free tier and already tied to another project, set up a new one scoped only to this app:
1. In your new Vercel project, go to the **Storage** tab.
2. Click **Create Database → KV** (this is Upstash-backed).
3. Follow the prompts to upgrade/purchase as needed, then **Connect** it to this project.
4. Vercel will automatically add the connection env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) to your project — you don't need to type these in yourself.

### 4. Set the two remaining environment variables
Go to **Project Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `APP_PASSWORD` | Whatever password your team should use to sign into `/dashboard` |
| `FLASK_SECRET_KEY` | Any long random string — see below for how to generate one |

To generate a `FLASK_SECRET_KEY`, you can just use a password generator for a random 40+ character string — it just needs to be long and random, not memorable.

Add both variables to **all three environments** (Production, Preview, Development) when prompted.

### 5. Redeploy
After saving the environment variables, go to the **Deployments** tab, open the three-dot menu on the latest deployment, and click **Redeploy**. This step is required — the app won't pick up new env vars until you redeploy.

### 6. Test it
- Visit your new Vercel URL — you should see the partner submission form.
- Submit a test request.
- Go to `/dashboard`, enter your `APP_PASSWORD`, and confirm the test request shows up.
- Update its status and confirm it saves.

### 7. Share the link
Send partners the **root URL** (not `/dashboard`) — that's the public submission form. Your team uses `/dashboard` to review and manage everything that comes in.

## Notes
- Status options are: **New Request → In Progress → Installed**, plus **Canceled** for requests that don't go through.
- The dashboard's status counters double as filters — click one to see just that status.
- If a submission fails with a storage error, double check the KV database is connected and you redeployed after adding env vars.
