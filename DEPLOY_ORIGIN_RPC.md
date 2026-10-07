# URGENT: Deploy Server-Side Origin Lottery

## Critical Security Fix

The Origin Lottery currently allows client manipulation. This MUST be deployed before launch.

## Step 1: Run the RPC Function in Supabase

1. Go to your Supabase dashboard
2. Open **SQL Editor**
3. Create **New Query**
4. Copy and paste the entire contents of `supabase/origin_lottery_rpc.sql`
5. Click **Run**

You should see: `Success. No rows returned`

## Step 2: Verify the Function Exists

In the SQL Editor, run:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'roll_origin_and_create_character';
```

You should see one result with the function name.

## Step 3: Test with Your Local Dev Server

The updated code now calls this RPC when creating a character.

Test by:
1. Creating a new test account
2. Going through character creation
3. The origin will now be assigned server-side

## What Changed

**Before (INSECURE):**
- Client randomly selected origin
- Client submitted `origin_id` to database
- User could manipulate browser to always get Trust Fund KOL

**After (SECURE):**
- Server performs weighted random selection
- Client shows animation for UX
- Server creates entire character atomically
- Client receives result and displays it
- No way to manipulate the lottery

## Rollback Plan

If there are issues, you can temporarily revert by:
1. Changing the function to always return 'fresh_wallet'
2. This gives everyone the same origin but keeps the game playable

## Notes

- The probabilities are hardcoded in the SQL function
- This prevents any client manipulation
- The animation still runs client-side for UX
- Character creation is now atomic (all-or-nothing)

Deploy this BEFORE pushing to production!
