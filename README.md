# CT LIFE

**survive the timeline. build your bags. earn your reputation.**

CT Life is a multiplayer browser-based life simulation game set in the world of Crypto Twitter. Players begin with a randomly assigned origin and build their own unique CT story through content creation, trading, building, networking, and navigating the chaos of the timeline.

## 🎮 Game Features

### Core Systems (Phase 1 - IMPLEMENTED)
- ✅ **Random Origin Lottery** - 7 unique origins with different starting conditions
- ✅ **Character Creation** - Custom personas with traits and aspirations
- ✅ **Authentication** - Supabase-powered user accounts
- ✅ **Database Schema** - Complete game state persistence
- ✅ **Origin Share Cards** - Viral sharing mechanics (ready for implementation)

### Origins (All 7 Implemented)
1. **Fresh Wallet** (22%) - The grind-from-zero origin
2. **Reply Guy** (18%) - Master of mentions
3. **Airdrop Survivor** (17%) - Multi-chain farmer
4. **Talented Creator** (15%) - Natural reach
5. **Builder** (13%) - Ship products, not tweets
6. **OG Survivor** (10%) - Seen it all before
7. **Trust Fund KOL** (5%) - Start strong, high stakes

### Traits (16 Total)
Players choose 2 traits that modify gameplay:
- Shitposter, Thread Merchant, Degen, Diamond Hands, Paper Hands
- Networker, Builder Brain, Alpha Hunter, Space Cadet
- Terminally Online, Touch Grass Enjoyer, Main Character
- Contrarian, Community Focused, Hustler, Chill

### Aspirations (8 Goals)
- KOL at the Top (100k followers)
- Onchain Millionaire (₵1M)
- Alpha Legend (95 reputation + 10 alpha calls)
- Superconnector (20 strong + 5 inner circle)
- Protocol Founder (₵10M business)
- Meme Lord (50 viral posts)
- Airdrop Final Boss (20 airdrops)
- Builder of CT (3 products + coding 10)

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js / React Three Fiber (planned)
- **Animations:** Framer Motion
- **Deployment:** Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Supabase account (free tier works)

### Setup

1. **Clone the repository**
```bash
cd ct-life
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

- Create a new Supabase project at https://supabase.com
- Go to Project Settings > API
- Copy your Project URL and anon/public key

4. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. **Run database migrations**

In Supabase SQL Editor, run the schema from `supabase/schema.sql`

6. **Seed initial data (optional)**

The origins, traits, and aspirations are defined in:
- `lib/origins.ts`
- `lib/traits-aspirations.ts`

You can optionally insert this data into your database or keep it client-side.

7. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Authentication
- [x] Character creation
- [x] Origin lottery
- [x] Traits & aspirations
- [x] Database schema
- [x] Basic UI

### Phase 2: Core Loop (In Progress)
- [ ] CT City isometric map
- [ ] Content creation system
- [ ] Virality engine
- [ ] Follower/reputation mechanics
- [ ] Skills & leveling
- [ ] Daily quests

### Phase 3: Economy
- [ ] Fictional token trading
- [ ] Work gigs system
- [ ] Business ownership
- [ ] Transaction ledger
- [ ] Market regimes
- [ ] Weekly expenses

### Phase 4: Social
- [ ] Real-time multiplayer presence
- [ ] Direct messages
- [ ] Relationships system
- [ ] Spaces arena
- [ ] Council elections
- [ ] Leaderboards

### Phase 5: Polish
- [ ] Share card generation
- [ ] Mobile optimization
- [ ] PWA features
- [ ] Sound effects
- [ ] Admin panel
- [ ] Analytics

## 🎨 Design Philosophy

CT Life revolves around three forms of power:

1. **💰 MONEY** - CT Credits for opportunities
2. **👁️ ATTENTION** - Followers and influence
3. **⭐ REPUTATION** - Trust and credibility

These do NOT automatically correlate. Players must constantly choose what to sacrifice.

## 🔒 Important Notes

- **CT Credits (₵)** are fictional currency with NO real-world value
- Cannot be withdrawn, exchanged, or purchased for speculation
- No real cryptocurrency integration in base game
- This is a GAME, not an investment

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build
```

Connect your GitHub repo to Vercel and set environment variables in dashboard.

### Database Setup in Production

Run the same SQL schema in your production Supabase instance.

## 📝 Contributing

This is currently a solo project building from the original spec. 

If you want to contribute:
1. Focus on implementing features from the roadmap
2. Keep the satirical CT tone
3. Maintain server-authoritative economy
4. No real crypto integration

## 📄 License

Proprietary - All rights reserved

## 🙏 Credits

Game design and spec: Original
Implementation: Built from scratch following the master spec
Inspired by: The absurdity and culture of Crypto Twitter

---

**What did the timeline give you?**

Start your journey: [Deploy your own CT Life instance]
