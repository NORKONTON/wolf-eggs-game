// Wolf Pack Game - Backend Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (replace with database later)
const gameState = {
  players: {},
  leaderboard: [],
  totalGames: 0,
  totalEarnings: 0
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    game: 'Wolf Pack Game',
    version: '1.0.0'
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    players: Object.keys(gameState.players).length,
    totalGames: gameState.totalGames,
    totalEarnings: gameState.totalEarnings,
    uptime: process.uptime()
  });
});

// TON Connect endpoint
app.get('/api/ton/connect', (req, res) => {
  res.json({
    success: true,
    wallet: process.env.TON_WALLET_ADDRESS || 'UQDW-GZlpaNOupnMe2xTiJfNDKH_aYShyz_18z_BYon9zKpe',
    network: 'testnet',
    message: 'TON Connect ready'
  });
});

// Game start endpoint
app.post('/api/game/start', (req, res) => {
  const { playerId, walletAddress } = req.body;
  
  if (!playerId) {
    return res.status(400).json({ error: 'Player ID required' });
  }
  
  // Create new game session
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  gameState.players[playerId] = {
    sessionId,
    walletAddress,
    score: 0,
    startTime: new Date().toISOString(),
    active: true
  };
  
  res.json({
    success: true,
    sessionId,
    message: 'Game started! Catch those eggs! 🥚🐺'
  });
});

// Game end endpoint
app.post('/api/game/end', (req, res) => {
  const { playerId, sessionId, score } = req.body;
  
  if (!playerId || !sessionId) {
    return res.status(400).json({ error: 'Player ID and Session ID required' });
  }
  
  const player = gameState.players[playerId];
  
  if (!player || player.sessionId !== sessionId) {
    return res.status(404).json({ error: 'Game session not found' });
  }
  
  // Update player score
  player.score = score || player.score;
  player.endTime = new Date().toISOString();
  player.active = false;
  
  // Update leaderboard
  gameState.leaderboard.push({
    playerId,
    score: player.score,
    timestamp: player.endTime,
    walletAddress: player.walletAddress
  });
  
  // Sort leaderboard by score (descending)
  gameState.leaderboard.sort((a, b) => b.score - a.score);
  gameState.leaderboard = gameState.leaderboard.slice(0, 100); // Keep top 100
  
  // Update totals
  gameState.totalGames += 1;
  gameState.totalEarnings += player.score * 0.01; // Simulated earnings
  
  res.json({
    success: true,
    score: player.score,
    position: gameState.leaderboard.findIndex(p => p.playerId === playerId) + 1,
    totalPlayers: gameState.leaderboard.length,
    earnings: player.score * 0.01
  });
});

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  res.json({
    leaderboard: gameState.leaderboard.slice(0, 10),
    totalPlayers: gameState.leaderboard.length,
    updated: new Date().toISOString()
  });
});

// Telegram bot webhook (simplified)
app.post('/api/telegram/webhook', (req, res) => {
  const { message } = req.body;
  
  if (message && message.text === '/start') {
    res.json({
      method: 'sendMessage',
      chat_id: message.chat.id,
      text: 'Welcome to Wolf Pack Game! 🐺🥚\n\nClick "Play Game" to start catching eggs and earn TON!',
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🎮 Play Game',
            web_app: { url: process.env.GAME_URL || 'https://wolf-pack-game.up.railway.app' }
          }
        ]]
      }
    });
  } else {
    res.json({ ok: true });
  }
});

// Main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wolf Pack Game</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #333; }
        .status { background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 500px; }
      </style>
    </head>
    <body>
      <h1>🐺 Wolf Pack Game 🥚</h1>
      <div class="status">
        <p><strong>Status:</strong> 🟢 Online</p>
        <p><strong>Players:</strong> ${Object.keys(gameState.players).length}</p>
        <p><strong>Total Games:</strong> ${gameState.totalGames}</p>
        <p><strong>API:</strong> <a href="/health">/health</a></p>
        <p><strong>Game:</strong> Available via Telegram Bot</p>
      </div>
      <p>Play via Telegram: <a href="https://t.me/wolfpackgame_bot">@wolfpackgame_bot</a></p>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Wolf Pack Game server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Telegram Bot: https://t.me/wolfpackgame_bot`);
  console.log(`💰 TON Wallet: ${process.env.TON_WALLET_ADDRESS || 'Not set'}`);
});