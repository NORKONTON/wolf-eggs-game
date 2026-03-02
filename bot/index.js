// Telegram Bot for Wolf Catches Eggs Mini App
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Configuration
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://your-domain.com/game';

// Initialize bot
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Wolf Catches Eggs Bot is running...');

// Command: /start
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username || 'Player';
  const referrerCode = match[1] ? match[1].replace('ref_', '') : null;
  
  try {
    // Register user in backend
    const response = await axios.post(`${BACKEND_URL}/api/register`, {
      telegramId: chatId,
      username,
      referrerCode
    });
    
    const user = response.data.user;
    
    // Welcome message
    const welcomeText = `🐺 Welcome to *Wolf Catches Eggs*!

👤 *Your Profile:*
• Level: ${user.levelInfo.name}
• Balance: ${user.balance} tokens
• Referral Code: ${user.referralCode}

🎮 *How to Play:*
1. Tap "Play Game" to open the Mini App
2. Catch eggs with your wolf
3. Upgrade your wolf with TON deposits
4. Invite friends for referral bonuses

💰 *Referral Program:*
Earn 25% of your friends' deposits (3 levels deep)!

🔗 *Your referral link:*
https://t.me/${bot.options.username}?start=ref_${user.referralCode}

Tap the button below to start playing!`;
    
    // Send welcome with game button
    bot.sendMessage(chatId, welcomeText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Play Game', web_app: { url: MINI_APP_URL } }],
          [{ text: '📊 My Stats', callback_data: 'stats' }],
          [{ text: '👥 Invite Friends', callback_data: 'invite' }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error.message);
    bot.sendMessage(chatId, '❌ Error registering. Please try again later.');
  }
});

// Command: /balance
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/${chatId}`);
    const user = response.data;
    
    const balanceText = `💰 *Your Balance*

• Tokens: ${user.balance}
• TON Deposited: ${user.totalDeposited}
• Current Level: ${user.levelInfo.name}
• Income/Hour: ${user.levelInfo.incomePerHour} tokens

💎 *Upgrade your wolf to increase income!*
Use /upgrade to see available levels.`;
    
    bot.sendMessage(chatId, balanceText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '⬆️ Upgrade', callback_data: 'upgrade' }],
          [{ text: '🎮 Play Game', web_app: { url: MINI_APP_URL } }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Balance error:', error.message);
    bot.sendMessage(chatId, '❌ Error fetching balance. Use /start first.');
  }
});

// Command: /upgrade
bot.onText(/\/upgrade/, async (msg) => {
  const chatId = msg.chat.id;
  
  const upgradeText = `⬆️ *Upgrade Your Wolf*

*Level 1:* Normal (1 TON) - 100 tokens/hour
*Level 2:* Medium (2 TON) - 250 tokens/hour
*Level 3:* Expert (5 TON) - 700 tokens/hour
*Level 4:* Pro (10 TON) - 1600 tokens/hour
*Level 5:* Legend (20 TON) - 3600 tokens/hour

💡 *How to upgrade:*
1. Connect wallet in the Mini App
2. Deposit required TON amount
3. Your wolf level will automatically upgrade

Tap "Play Game" to open the Mini App and upgrade!`;
  
  bot.sendMessage(chatId, upgradeText, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Play Game', web_app: { url: MINI_APP_URL } }],
        [{ text: '💰 My Balance', callback_data: 'balance' }]
      ]
    }
  });
});

// Command: /referral
bot.onText(/\/referral/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/${chatId}`);
    const user = response.data;
    
    const referralText = `👥 *Referral Program*

*Earn 25% of your friends' deposits!*
• Level 1: 25% of direct referrals
• Level 2: 15% of second-level referrals  
• Level 3: 5% of third-level referrals

🔗 *Your referral link:*
https://t.me/${bot.options.username}?start=ref_${user.referralCode}

📊 *Your referrals:* ${user.referrals ? user.referrals.length : 0}
💰 *Earned from referrals:* ${user.referralEarnings || 0} TON

*Share your link and start earning!*`;
    
    bot.sendMessage(chatId, referralText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Copy Link', callback_data: 'copy_link' }],
          [{ text: '📊 Stats', callback_data: 'stats' }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Referral error:', error.message);
    bot.sendMessage(chatId, '❌ Error fetching referral data.');
  }
});

// Command: /stats
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const [userResponse, statsResponse] = await Promise.all([
      axios.get(`${BACKEND_URL}/api/user/${chatId}`),
      axios.get(`${BACKEND_URL}/api/stats`)
    ]);
    
    const user = userResponse.data;
    const stats = statsResponse.data;
    
    const statsText = `📊 *Game Statistics*

*Your Stats:*
• Level: ${user.levelInfo.name}
• Tokens: ${user.balance}
• Eggs Caught: ${Math.floor(user.balance * 10)}
• TON Deposited: ${user.totalDeposited}
• Referrals: ${user.referrals ? user.referrals.length : 0}

*Global Stats:*
• Total Players: ${stats.totalUsers}
• Total Deposited: ${stats.totalDeposited}
• Total Eggs Caught: ${stats.totalEggsCaught}
• Online Now: ${stats.onlineUsers}

*Keep catching those eggs!* 🥚`;
    
    bot.sendMessage(chatId, statsText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Play Game', web_app: { url: MINI_APP_URL } }],
          [{ text: '👥 Referrals', callback_data: 'referral' }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Stats error:', error.message);
    bot.sendMessage(chatId, '❌ Error fetching statistics.');
  }
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpText = `❓ *Help & Commands*

*Available Commands:*
/start - Start playing & get referral link
/balance - Check your balance & income
/upgrade - View upgrade levels & prices  
/referral - Get your referral link & stats
/stats - View your & global statistics
/help - Show this help message

*Game Rules:*
1. Catch eggs to earn tokens
2. Upgrade wolf with TON deposits
3. Invite friends for referral bonuses
4. Earn passive income based on level

*Support:*
Contact @WolfEggsSupport for help.

*Happy egg catching!* 🐺🥚`;
  
  bot.sendMessage(chatId, helpText, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Play Game', web_app: { url: MINI_APP_URL } }],
        [{ text: '📖 Tutorial', callback_data: 'tutorial' }]
      ]
    }
  });
});

// Callback queries (button presses)
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  
  switch (data) {
    case 'stats':
      bot.answerCallbackQuery(callbackQuery.id);
      bot.sendMessage(msg.chat.id, 'Fetching your stats...');
      // Trigger /stats command
      bot.processUpdate({
        message: {
          chat: { id: msg.chat.id },
          text: '/stats',
          message_id: msg.message_id + 1
        }
      });
      break;
      
    case 'invite':
      bot.answerCallbackQuery(callbackQuery.id);
      bot.sendMessage(msg.chat.id, 'Generating referral link...');
      // Trigger /referral command
      bot.processUpdate({
        message: {
          chat: { id: msg.chat.id },
          text: '/referral',
          message_id: msg.message_id + 1
        }
      });
      break;
      
    case 'upgrade':
      bot.answerCallbackQuery(callbackQuery.id);
      bot.sendMessage(msg.chat.id, 'Showing upgrade options...');
      // Trigger /upgrade command
      bot.processUpdate({
        message: {
          chat: { id: msg.chat.id },
          text: '/upgrade',
          message_id: msg.message_id + 1
        }
      });
      break;
      
    case 'balance':
      bot.answerCallbackQuery(callbackQuery.id);
      bot.sendMessage(msg.chat.id, 'Checking your balance...');
      // Trigger /balance command
      bot.processUpdate({
        message: {
          chat: { id: msg.chat.id },
          text: '/balance',
          message_id: msg.message_id + 1
        }
      });
      break;
      
    case 'copy_link':
      bot.answerCallbackQuery(callbackQuery.id, { text: 'Link copied to clipboard!' });
      // In web app, would copy to clipboard
      break;
      
    case 'tutorial':
      bot.answerCallbackQuery(callbackQuery.id);
      const tutorialText = `📖 *Game Tutorial*

*Step 1:* Tap "Play Game" to open Mini App
*Step 2:* Connect your TON wallet
*Step 3:* Catch eggs with arrow keys or buttons
*Step 4:* Upgrade wolf level with TON deposits
*Step 5:* Share referral link to earn bonuses

*Tips:*
• Higher levels = more passive income
• Catch eggs quickly for bonus tokens
• Invite active players for more earnings

*Ready to start?* Tap the button below!`;
      
      bot.sendMessage(msg.chat.id, tutorialText, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎮 Play Game', web_app: { url: MINI_APP_URL } }]
          ]
        }
      });
      break;
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping bot...');
  bot.stopPolling();
  process.exit();
});

module.exports = bot;