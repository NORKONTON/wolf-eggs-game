// Wolf Catches Eggs - Backend Server with PostgreSQL
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Game configuration
const LEVELS = {
  1: { name: 'Normal', price: 1, income_per_hour: 100, incomePerHour: 100, color: '#8B4513' },
  2: { name: 'Medium', price: 2, income_per_hour: 250, incomePerHour: 250, color: '#C0C0C0' },
  3: { name: 'Expert', price: 5, income_per_hour: 700, incomePerHour: 700, color: '#FFD700' },
  4: { name: 'Pro', price: 10, income_per_hour: 1600, incomePerHour: 1600, color: '#4169E1' },
  5: { name: 'Legend', price: 20, income_per_hour: 3600, incomePerHour: 3600, color: '#800080' }
};

// Generate referral code
function generateReferralCode(userId) {
  return `REF${userId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Get user data
app.get('/api/user/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const result = await pool.query(
      `SELECT u.*, lc.name as level_name, lc.income_per_hour, lc.color
       FROM users u
       LEFT JOIN levels_config lc ON u.current_level = lc.level
       WHERE u.telegram_id = $1`,
      [telegramId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get referral count
    const referralsResult = await pool.query(
      'SELECT COUNT(*) FROM referrals WHERE user_id = $1',
      [result.rows[0].id]
    );
    
    const user = {
      ...result.rows[0],
      referral_count: parseInt(referralsResult.rows[0].count),
      level_info: LEVELS[result.rows[0].current_level]
    };
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register new user (via Telegram)
app.post('/api/register', async (req, res) => {
  try {
    const { telegramId, username, referrerCode } = req.body;
    
    if (!telegramId) {
      return res.status(400).json({ error: 'Telegram ID is required' });
    }
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE telegram_id = $1',
      [telegramId]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Find referrer if code provided
    let referrerId = null;
    if (referrerCode) {
      const referrerResult = await pool.query(
        'SELECT id FROM users WHERE referral_code = $1',
        [referrerCode]
      );
      if (referrerResult.rows.length > 0) {
        referrerId = referrerResult.rows[0].id;
      }
    }
    
    // Generate referral code
    const referralCode = generateReferralCode(telegramId);
    
    // Insert new user
    const result = await pool.query(
      `INSERT INTO users 
       (telegram_id, username, referrer_id, referral_code, current_level, balance, total_deposited)
       VALUES ($1, $2, $3, $4, 1, 0, 0)
       RETURNING *`,
      [telegramId, username || `User${telegramId}`, referrerId, referralCode]
    );
    
    const newUser = result.rows[0];
    
    // Add level info
    newUser.level_info = LEVELS[newUser.current_level];
    
    res.json({
      success: true,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update wallet address
app.post('/api/wallet', async (req, res) => {
  try {
    const { telegramId, walletAddress } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET wallet_address = $1 WHERE telegram_id = $2 RETURNING *',
      [walletAddress, telegramId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      walletAddress: result.rows[0].wallet_address 
    });
  } catch (error) {
    console.error('Wallet update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process deposit (simulated)
app.post('/api/deposit', async (req, res) => {
  try {
    const { telegramId, amount, txHash, level } = req.body;
    
    // Get user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    if (!user.wallet_address) {
      return res.status(400).json({ error: 'Wallet not connected' });
    }
    
    // Verify amount matches level price
    const targetLevel = level || user.current_level + 1;
    if (amount < LEVELS[targetLevel].price) {
      return res.status(400).json({ error: 'Insufficient deposit amount' });
    }
    
    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update user level and balance
      const bonusTokens = LEVELS[targetLevel].income_per_hour * 24;
      const currentBalance = isNaN(parseFloat(user.balance)) ? 0 : parseFloat(user.balance);
      const newBalance = currentBalance + bonusTokens;
      console.log(`Deposit: user ${user.id}, currentBalance=${currentBalance}, bonusTokens=${bonusTokens}, newBalance=${newBalance}`);
      await client.query(
        `UPDATE users 
         SET current_level = $1, 
             total_deposited = total_deposited + $2,
             balance = $3
         WHERE id = $4`,
        [targetLevel, amount, newBalance, user.id]
      );
      
      // Log transaction
      const txResult = await client.query(
        `INSERT INTO transactions 
         (user_id, type, amount, ton_amount, tx_hash, level)
         VALUES ($1, 'deposit', $2, $3, $4, $5)
         RETURNING *`,
        [user.id, amount, amount, txHash, targetLevel]
      );
      
      // Process referral bonuses (3 levels)
      if (user.referrer_id) {
        const bonusRates = [0.25, 0.15, 0.05];
        let currentReferrerId = user.referrer_id;
        
        for (let levelIndex = 0; levelIndex < 3; levelIndex++) {
          if (!currentReferrerId) break;
          
          const bonusAmount = amount * bonusRates[levelIndex];
          
          // Update referrer balance
          await client.query(
            'UPDATE users SET balance = COALESCE(NULLIF(balance, \'NaN\'::DECIMAL), 0) + $1 WHERE id = $2',
            [bonusAmount, currentReferrerId]
          );
          
          // Log referral
          await client.query(
            `INSERT INTO referrals 
             (user_id, referral_id, level, deposit_amount, commission_amount)
             VALUES ($1, $2, $3, $4, $5)`,
            [currentReferrerId, user.id, levelIndex + 1, amount, bonusAmount]
          );
          
          // Log referral transaction
          await client.query(
            `INSERT INTO transactions 
             (user_id, type, amount, ton_amount, tx_hash)
             VALUES ($1, 'referral_bonus', $2, $3, $4)`,
            [currentReferrerId, bonusAmount, bonusAmount, `ref_${txHash}`]
          );
          
          // Get next referrer in chain
          const referrerResult = await client.query(
            'SELECT referrer_id FROM users WHERE id = $1',
            [currentReferrerId]
          );
          currentReferrerId = referrerResult.rows[0]?.referrer_id || null;
        }
      }
      
      await client.query('COMMIT');
      
      // Get updated user
      const updatedUserResult = await pool.query(
        `SELECT u.*, lc.name as level_name, lc.income_per_hour, lc.color
         FROM users u
         LEFT JOIN levels_config lc ON u.current_level = lc.level
         WHERE u.id = $1`,
        [user.id]
      );
      
      res.json({
        success: true,
        user: {
          ...updatedUserResult.rows[0],
          level_info: LEVELS[updatedUserResult.rows[0].current_level]
        },
        transaction: txResult.rows[0]
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get game stats
app.get('/api/stats', async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const depositedResult = await pool.query('SELECT COALESCE(SUM(total_deposited), 0) FROM users');
    const balanceResult = await pool.query('SELECT COALESCE(SUM(balance), 0) FROM users');
    
    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalDeposited: parseFloat(depositedResult.rows[0].coalesce),
      totalBalance: parseFloat(balanceResult.rows[0].coalesce),
      onlineUsers: Math.floor(parseInt(usersResult.rows[0].count) * 0.3) // Mock
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch egg (gameplay)
app.post('/api/catch', async (req, res) => {
  try {
    const { telegramId, eggsCaught } = req.body;
    
    const eggsValue = eggsCaught || 1;
    const tokensEarned = eggsValue; // 1 token per egg
    
    const result = await pool.query(
      `UPDATE users 
       SET balance = COALESCE(NULLIF(balance, 'NaN'::DECIMAL), 0) + $1
       WHERE telegram_id = $2
       RETURNING *`,
      [tokensEarned, telegramId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log transaction
    await pool.query(
      `INSERT INTO transactions 
       (user_id, type, amount)
       VALUES ($1, 'egg_catch', $2)`,
      [result.rows[0].id, tokensEarned]
    );
    
    res.json({
      success: true,
      tokensEarned,
      newBalance: result.rows[0].balance
    });
  } catch (error) {
    console.error('Catch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user transactions
app.get('/api/transactions/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { limit = 20 } = req.query;
    
    const result = await pool.query(
      `SELECT t.* 
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       WHERE u.telegram_id = $1
       ORDER BY t.created_at DESC
       LIMIT $2`,
      [telegramId, limit]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get referral network
app.get('/api/referrals/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    
    const result = await pool.query(
      `SELECT r.*, u.username as referral_username
       FROM referrals r
       JOIN users u ON r.referral_id = u.id
       WHERE r.user_id = (SELECT id FROM users WHERE telegram_id = $1)
       ORDER BY r.created_at DESC`,
      [telegramId]
    );
    
    const summaryResult = await pool.query(
      `SELECT 
         COUNT(*) as total_referrals,
         COALESCE(SUM(commission_amount), 0) as total_earnings
       FROM referrals 
       WHERE user_id = (SELECT id FROM users WHERE telegram_id = $1)`,
      [telegramId]
    );
    
    res.json({
      referrals: result.rows,
      summary: summaryResult.rows[0]
    });
  } catch (error) {
    console.error('Referrals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Telegram webhook (for bot commands)
app.post('/api/webhook', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'No message data' });
  }
  
  const chatId = message.chat.id;
  const text = message.text || '';
  
  // Handle /start command with referral parameter
  if (text.startsWith('/start')) {
    const parts = text.split(' ');
    const refCode = parts.length > 1 ? parts[1] : null;
    
    console.log(`User ${chatId} started with ref code: ${refCode}`);
  }
  
  res.json({ received: true });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🐺 Wolf Catches Eggs backend running on port ${PORT}`);
  console.log(`📊 PostgreSQL database: ${process.env.DATABASE_URL}`);
});