# Wolf Pack - Telegram Play-to-Earn Game

🐺 Catch eggs, earn tokens, join the pack!

Wolf Pack is a Telegram Mini App game where players control a wolf catching eggs to earn WPK tokens on TON blockchain.

## Features

- 🎮 **HTML5 Canvas Game** - Wolf catching eggs with smooth controls
- 💰 **Play-to-Earn Economy** - Convert game points to WPK tokens
- 👥 **Multi-level Referral System** - Earn 25%/15%/5% from referrals
- 🔗 **TON Blockchain Integration** - Deposit/withdraw TON, future WPK token
- 🤖 **Telegram Bot** - @wolfpackgame_bot with Mini App integration
- 📊 **PostgreSQL Database** - User accounts, balances, transactions
- 🌐 **RESTful API** - Complete backend for game operations

## Architecture

```
wolf-eggs-game/
├── frontend/          # HTML5 Canvas game + TON Connect
├── backend/           # Node.js Express API
├── bot/               # Telegram bot (node-telegram-bot-api)
├── database/          # PostgreSQL schema & migrations
└── contracts/         # TON smart contracts (Tact)
```

## Quick Start (Development)

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional)
- Telegram Bot Token from @BotFather

### 2. Database Setup

```bash
# Using Docker
docker run -d \
  --name wolf-db \
  -e POSTGRES_PASSWORD=wolfpack \
  -e POSTGRES_DB=wolfpack \
  -p 5432:5432 \
  postgres:15

# Or install PostgreSQL locally
```

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm start
# Server runs on http://localhost:3001
```

### 4. Frontend Game

```bash
# Open frontend/index.html in browser
# Or serve with any static server
python3 -m http.server 3002
# Game available at http://localhost:3002
```

### 5. Telegram Bot

```bash
cd bot
cp .env.example .env
# Add your bot token to .env
npm install
npm start
```

## Deployment

### Option 1: Render (Free Tier)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Push this repository to GitHub
2. Sign up on [Render.com](https://render.com)
3. Create New Web Service → Import from GitHub
4. Select repository and deploy
5. Add PostgreSQL database from Render dashboard
6. Set environment variables

### Option 2: Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new)

### Option 3: Self-hosted (VPS)

```bash
# Clone repository
git clone https://github.com/yourusername/wolf-pack-game.git
cd wolf-pack-game

# Use PM2 for process management
npm install -g pm2
pm2 start backend/server.js --name wolf-backend
pm2 start bot/index.js --name wolf-bot
pm2 save
pm2 startup
```

## Environment Variables

See `backend/.env.example` for all required variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `TELEGRAM_BOT_TOKEN` - From @BotFather
- `JWT_SECRET` - For authentication
- `TON_API_KEY` - TON Center API key (optional)

## API Documentation

### Endpoints

- `GET /api/health` - Health check
- `POST /api/register` - Register user with Telegram ID
- `GET /api/user/:telegramId` - Get user data
- `POST /api/deposit` - Record TON deposit
- `POST /api/update-score` - Update game score
- `GET /api/referrals/:telegramId` - Get referral tree
- `POST /api/upgrade-level` - Upgrade user level
- `GET /api/leaderboard` - Top players

### Database Schema

See `database/001_initial.sql` for table definitions:
- `users` - Player accounts
- `deposits` - TON deposit records
- `referrals` - Referral relationships
- `levels` - Game levels configuration
- `game_scores` - Player scores
- `audit_logs` - Activity logging

## Tokenomics (WPK)

- **Total Supply:** 1,000,000,000 WPK
- **Distribution:**
  - 40% Game rewards
  - 30% Project treasury
  - 15% Marketing & airdrops
  - 10% Team & agent
  - 5% DEX liquidity
- **TGE:** After 150,000 players

## Roadmap

1. **Months 1-2:** Game launch, referral system, internal tokens
2. **Months 3-4:** 50K players, token contract preparation
3. **Months 5-6:** 150K players, testnet deployment
4. **Month 7:** TGE, DEX liquidity on STON.fi
5. **Months 8+:** In-game exchange, token burns, NFT, tournaments

## Telegram Integration

1. **Bot:** @wolfpackgame_bot
2. **Channel:** @WolfPackWeb3
3. **Mini App:** Game runs inside Telegram Web App
4. **Commands:** /start, /balance, /deposit, /referrals, /upgrade

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file

## Contact

- Telegram: @WolfPackWeb3
- Bot: @wolfpackgame_bot
- Developer: Merlin AI Assistant
- Founder: Oleg

## Support

Join our Telegram channel: [@WolfPackWeb3](https://t.me/WolfPackWeb3)