const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Basic routes
app.get('/', (req, res) => {
  res.send('🐺 Wolf Pack Game is running!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', game: 'Wolf Pack Game', version: '1.0.0' });
});

// Game API endpoints
app.get('/api/game', (req, res) => {
  res.json({
    name: 'Wolf Pack Game',
    status: 'active',
    players: 0,
    totalWolves: 1000,
    tonBalance: '0 TON'
  });
});

app.get('/api/ton', (req, res) => {
  res.json({
    network: 'TON Mainnet',
    wallet: 'UQDW-GZlpaNOupnMe2xTiJfNDKH_aYShyz_18z_BYon9zKpe',
    balance: '11.51844 TON',
    connected: false
  });
});

app.get('/api/telegram', (req, res) => {
  res.json({
    bot: '@wolfpackgame_bot',
    channel: '@WolfPackWeb3',
    miniApp: 'https://wolf-eggs-game-production.up.railway.app',
    users: 88
  });
});

app.post('/api/user/connect', (req, res) => {
  const { telegramId, walletAddress } = req.body;
  res.json({
    success: true,
    message: 'User connected successfully',
    userId: telegramId || 'anonymous',
    wallet: walletAddress || 'not_connected'
  });
});

// Telegram Mini App endpoint - serve the full game
app.get('/telegram-app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'telegram-game.html'));
});

// Also serve at root for easy access
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'telegram-game.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Wolf Pack Game server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Telegram Bot: https://t.me/wolfpackgame_bot`);
  console.log(`💰 TON Wallet: UQDW-GZlpaNOupnMe2xTiJfNDKH_aYShyz_18z_BYon9zKpe`);
});