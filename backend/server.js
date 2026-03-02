const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Telegram Mini App endpoint
app.get('/telegram-app', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>🐺 Wolf Pack Game</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
      .game-title { color: #ff6b00; font-size: 24px; margin-bottom: 20px; }
      .status { background: #f0f0f0; padding: 15px; border-radius: 10px; margin: 10px; }
    </style>
  </head>
  <body>
    <div class="game-title">🐺 Wolf Pack Game</div>
    <div class="status">🎮 Game is running on Railway</div>
    <div class="status">💰 TON Wallet: Ready for connection</div>
    <div class="status">📱 Telegram Mini App: Active</div>
    <div id="ton-connect"></div>
    <script>
      // Telegram Web App initialization
      const tg = window.Telegram.WebApp;
      tg.expand();
      tg.ready();
      
      // TON Connect would go here
      console.log('Telegram Mini App loaded');
    </script>
  </body>
  </html>
  `;
  res.send(html);
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