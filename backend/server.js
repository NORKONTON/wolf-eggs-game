const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('🐺 Wolf Pack Game is running!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', game: 'Wolf Pack Game' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});