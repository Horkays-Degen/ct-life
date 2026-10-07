# CT LIFE - Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up (free)
2. Click "New Project"
3. Choose a name (e.g., "ct-life")
4. Set a strong database password
5. Select a region close to you
6. Wait ~2 minutes for project to provision

### Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Set Up Database

1. In Supabase, click **SQL Editor** in left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql` from this repo
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. Wait for "Success" message

### Step 4: Configure Environment

1. Create `.env.local` in the root of this project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

### Step 5: Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Step 6: Create Your Character

1. Click "ENTER THE TIMELINE"
2. Create an account with email/password
3. Fill in your character details
4. Experience the Origin Lottery! 🎲
5. Choose your traits and aspiration
6. Enter CT City

## ✅ Verify Setup

- [ ] Supabase project created
- [ ] Database schema run successfully
- [ ] `.env.local` file created with correct keys
- [ ] `npm install` completed
- [ ] Dev server running at localhost:3000
- [ ] Can create account and character

## 🐛 Troubleshooting

### "supabaseUrl is required"
- Check that `.env.local` exists
- Verify keys are correct (no spaces, no quotes)
- Restart dev server after creating `.env.local`

### "relation does not exist"
- Database schema not run
- Go to SQL Editor in Supabase
- Run the `supabase/schema.sql` file

### "Email already registered"
- Email is already in use
- Try a different email or use "Sign In" instead

### "Character not found" after login
- Database insertion failed
- Check Supabase logs in Dashboard > Logs
- Try creating character again

## 🎮 What's Next?

After setup, you can:

1. **Test the Origin Lottery** - Create multiple accounts to see different origins
2. **Explore the code** - Check `lib/origins.ts` for origin definitions
3. **Customize** - Modify origins, traits, or starting values
4. **Deploy** - Push to Vercel/Netlify when ready

## 📊 Seed Demo Data (Optional)

Want to test with pre-existing characters? Run this in SQL Editor:

```sql
-- Insert a test character (replace YOUR_USER_ID with your actual UUID from auth.users)
INSERT INTO characters (user_id, display_name, handle, bio, origin_id)
VALUES ('YOUR_USER_ID', 'Test Player', 'testplayer', 'Testing CT Life', 'fresh_wallet');

-- Get the character_id from the above insert, then:
INSERT INTO character_stats (character_id, ct_credits, followers)
VALUES ('CHARACTER_ID_HERE', 10000, 500);
```

## 🚢 Deploy to Production

See main README.md for Vercel deployment instructions.

---

**Need help?** Check the full README.md or open an issue.

**Ready to play?** Start the dev server and enter the timeline! 🌆
