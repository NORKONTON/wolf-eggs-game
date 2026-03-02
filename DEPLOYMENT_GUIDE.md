# 🚀 Deployment Guide for Wolf Pack Game

## 📋 Overview
This guide explains how to deploy the Wolf Pack Game to Render.com using GitHub Actions.

## 🎯 What We've Set Up

### 1. **GitHub Actions Workflows**
- `simple-render-deploy.yml` - Triggers Render Blueprint deployment
- Automatically runs when you push to `main` branch
- Sends Telegram notifications on success/failure

### 2. **Render.com Configuration**
- `render.yaml` - Blueprint for Render.com services
- Defines:
  - Web service: `wolf-pack-game` (Node.js backend)
  - Worker service: `wolf-pack-worker` (background tasks)
  - Environment variables
  - Auto-deploy settings

### 3. **Application Structure**
```
wolf-eggs-game/
├── backend/           # Main server code
│   ├── server.js     # Express server
│   ├── worker.js     # Background worker
│   └── package.json  # Dependencies
├── bot/              # Telegram bot code
├── frontend/         # Game frontend
├── render.yaml       # Render.com configuration
└── .github/workflows/# GitHub Actions
```

## 🚀 How to Deploy

### Step 1: Add Render.com API Key to GitHub Secrets

1. **Get your Render.com API Key:**
   - Go to https://dashboard.render.com
   - Account Settings → API Keys
   - Create new API key named "GitHub Actions"
   - **IMPORTANT:** Copy the key immediately (it's shown only once!)

2. **Add to GitHub Secrets:**
   - Go to https://github.com/NORKONTON/wolf-eggs-game
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RENDER_API_KEY`
   - Value: Your Render.com API key (starts with `rnd_`)
   - Click "Add secret"

### Step 2: Push Code to GitHub

```bash
# Commit and push your changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Monitor Deployment

1. **GitHub Actions:**
   - Go to https://github.com/NORKONTON/wolf-eggs-game/actions
   - Watch the "Simple Render Deploy" workflow

2. **Render.com Dashboard:**
   - Go to https://dashboard.render.com
   - Check "wolf-pack-game" service status

3. **Telegram Notifications:**
   - You'll receive notifications in Telegram
   - Success: Game URL and status
   - Failure: Error details and troubleshooting steps

## 🔧 Manual Deployment (Alternative)

If GitHub Actions doesn't work, deploy manually:

### Option A: Deploy via Render.com Web UI
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect to GitHub repository
4. Select "NORKONTON/wolf-eggs-game"
5. Configure:
   - Name: `wolf-pack-game`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables
7. Click "Create Web Service"

### Option B: Deploy via Render CLI
```bash
# Install Render CLI
npm install -g @renderinc/cli

# Login to Render
render login

# Deploy from current directory
render blueprints create
```

## 🌐 After Deployment

### 1. **Get Your Game URL**
- Check Render.com dashboard
- Service URL will be: `https://wolf-pack-game.onrender.com`

### 2. **Update Telegram Bot**
1. Go to https://t.me/BotFather
2. Send `/mybots`
3. Select @wolfpackgame_bot
4. Edit Bot → Edit Web App
5. Set URL: `https://wolf-pack-game.onrender.com`
6. Save changes

### 3. **Test the Game**
1. Open Telegram
2. Go to @wolfpackgame_bot
3. Click "Play Game" button
4. Game should load in Telegram Web App

## 🐛 Troubleshooting

### Common Issues:

#### 1. **API Key Not Working**
- Ensure key starts with `rnd_`
- Check if key has proper permissions
- Create new key if needed

#### 2. **Deployment Fails**
- Check GitHub Actions logs
- Verify `render.yaml` syntax
- Ensure `package.json` has correct scripts

#### 3. **Game Not Loading**
- Check Render.com service logs
- Verify environment variables
- Test API endpoints manually

#### 4. **Telegram Bot Issues**
- Verify bot token is correct
- Check Web App URL configuration
- Ensure CORS is enabled

## 📞 Support

### Quick Checks:
```bash
# Test API endpoint
curl https://wolf-pack-game.onrender.com/health

# Check service status
curl https://wolf-pack-game.onrender.com/api/status
```

### Contact:
- **GitHub Issues:** https://github.com/NORKONTON/wolf-eggs-game/issues
- **Telegram:** @wolfpackgame_bot
- **Render Support:** https://render.com/docs/support

## 🎉 Success Checklist

- [ ] Render.com API key added to GitHub Secrets
- [ ] Code pushed to GitHub `main` branch
- [ ] GitHub Actions workflow completed successfully
- [ ] Render.com service is "Live"
- [ ] Game URL is accessible
- [ ] Telegram bot updated with game URL
- [ ] Game loads in Telegram Web App
- [ ] Players can connect TON wallet
- [ ] Game mechanics work correctly

---

**Happy deploying!** 🚀

*Last updated: 2026-03-02*