# AMK Car Valuation Portal

A full-stack web application for car inspection and valuation report management.

## Features

### User Features
- Email/password authentication (register & login)
- Create and fill car valuation forms with auto-save
- Save draft progress and resume later
- Submit final reports
- Download PDF reports
- View all personal submission history

### Admin Features
- Admin dashboard with statistics (total, submitted, reviewed, draft)
- View all user submissions in a searchable, filterable table
- Edit any submission via the form
- Mark submissions as reviewed
- Download PDF reports for any submission

---

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Pure HTML/CSS/JS | Free |
| Hosting | GitHub Pages | Free |
| Database | Supabase (PostgreSQL) | Free tier |
| Auth | Supabase Auth | Free tier |
| PDF | html2pdf.js (CDN) | Free |

---

## Setup Instructions

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose any region, note your password)
3. Wait for the project to initialize (~2 minutes)
4. Go to **SQL Editor** in the sidebar
5. Copy the entire contents of `setup.sql` and run it
6. Go to **Settings → API** and copy:
   - `Project URL` (looks like `https://xyzabc.supabase.co`)
   - `anon public` key (starts with `eyJ...`)

### Step 2: Configure the App

1. Open `js/supabase.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJ...your-anon-key...';
   ```

### Step 3: Enable Email Auth

1. In Supabase → **Authentication → Providers**
2. Ensure **Email** provider is enabled
3. For development, you can disable email confirmation:
   - Go to **Authentication → Settings**
   - Turn off "Enable email confirmations"

### Step 4: Create Your Admin Account

1. Deploy the app (or open `index.html` locally)
2. Register with your email and password
3. Go to Supabase → **Table Editor → profiles**
4. Find your row and change `role` from `user` to `admin`
   
   OR run in the SQL Editor:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### Step 5: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files to the `main` branch
3. Go to **Settings → Pages**
4. Set source to `Deploy from a branch` → `main` → `/ (root)`
5. Your app will be live at `https://yourusername.github.io/repo-name/`

---

## File Structure

```
/
├── index.html          ← Login & Register page
├── dashboard.html      ← User dashboard (submissions list)
├── form.html           ← Car valuation form
├── admin.html          ← Admin panel
├── setup.sql           ← Supabase database setup script
├── css/
│   └── style.css       ← All shared styles
└── js/
    ├── supabase.js     ← ⚠️ Configure your keys here
    ├── auth.js         ← Login/register/logout/guards
    ├── form.js         ← Form data helpers (utility)
    ├── report.js       ← PDF generation logic
    ├── dashboard.js    ← (merged into dashboard.html)
    └── admin.js        ← (merged into admin.html)
```

---

## Database Schema

### `profiles` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Links to auth.users |
| email | TEXT | User email |
| full_name | TEXT | User display name |
| role | TEXT | `user` or `admin` |
| created_at | TIMESTAMPTZ | Auto-set |

### `submissions` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to profiles |
| status | TEXT | `draft`, `submitted`, or `reviewed` |
| form_data | JSONB | All form field values |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated on change |

---

## Adding the Header/Footer Images

The PDF report references `AMK Header.png` and `AKM Footer.png`.
Place these image files in the root directory of the project alongside `index.html`.

---

## Supabase Free Tier Limits

- 500MB database storage
- 50,000 monthly active users  
- 2GB bandwidth per month
- More than enough for this use case

---

## Local Development

No build step required. Just open `index.html` in a browser.

For best results use a local server (to avoid CORS issues with images):
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Then visit `http://localhost:8000`
