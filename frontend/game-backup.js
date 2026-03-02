// Wolf Catches Eggs - Game Logic
document.addEventListener('DOMContentLoaded', function() {
    // Telegram Web App initialization
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.BackButton.hide();
    
    // Game state
    const gameState = {
        level: 1,
        balance: 0,
        eggsCaught: 0,
        incomePerHour: 100,
        walletConnected: false,
        walletAddress: null,
        referralCode: null,
        totalReferrals: 0,
        referralEarnings: 0
    };

    // DOM elements
    const levelEl = document.getElementById('level');
    const balanceEl = document.getElementById('balance');
    const eggsCaughtEl = document.getElementById('eggsCaught');
    const incomePerHourEl = document.getElementById('incomePerHour');
    const totalReferralsEl = document.getElementById('totalReferrals');
    const referralEarningsEl = document.getElementById('referralEarnings');
    const walletAddressEl = document.getElementById('walletAddress');
    const referralLinkEl = document.getElementById('referralLink');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const depositBtn = document.getElementById('depositBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const catchBtn = document.getElementById('catchBtn');
    const upgradeBtns = document.querySelectorAll('.upgrade-btn');
    const depositAmountEl = document.getElementById('depositAmount');

    // Canvas game
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game objects
    const wolf = {
        x: canvas.width / 2 - 40,
        y: canvas.height - 60,
        width: 80,
        height: 60,
        speed: 8,
        color: '#FF9A3C'
    };
    
    const eggs = [];
    const eggRadius = 15;
    let eggSpeed = 3;
    let lastEggTime = 0;
    const eggInterval = 1000; // ms

    // Initialize UI
    updateUI();

    // Generate random egg
    function createEgg() {
        return {
            x: Math.random() * (canvas.width - eggRadius * 2) + eggRadius,
            y: 0,
            radius: eggRadius,
            color: '#FFD166',
            speed: eggSpeed + Math.random() * 2
        };
    }

    // Draw wolf
    function drawWolf() {
        ctx.fillStyle = wolf.color;
        ctx.beginPath();
        ctx.roundRect(wolf.x, wolf.y, wolf.width, wolf.height, 10);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(wolf.x + 20, wolf.y + 20, 10, 0, Math.PI * 2);
        ctx.arc(wolf.x + wolf.width - 20, wolf.y + 20, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(wolf.x + 20, wolf.y + 20, 5, 0, Math.PI * 2);
        ctx.arc(wolf.x + wolf.width - 20, wolf.y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw eggs
    function drawEggs() {
        eggs.forEach(egg => {
            ctx.fillStyle = egg.color;
            ctx.beginPath();
            ctx.arc(egg.x, egg.y, egg.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(egg.x - egg.radius/3, egg.y - egg.radius/3, egg.radius/3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Update game state
    function updateGame(timestamp) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create new egg periodically
        if (timestamp - lastEggTime > eggInterval) {
            eggs.push(createEgg());
            lastEggTime = timestamp;
        }
        
        // Update egg positions
        for (let i = eggs.length - 1; i >= 0; i--) {
            eggs[i].y += eggs[i].speed;
            
            // Remove eggs that fell off screen
            if (eggs[i].y > canvas.height + eggRadius) {
                eggs.splice(i, 1);
            }
        }
        
        // Draw everything
        drawWolf();
        drawEggs();
        
        requestAnimationFrame(updateGame);
    }

    // Check collision between wolf and egg
    function checkCollision(egg) {
        return egg.x > wolf.x && 
               egg.x < wolf.x + wolf.width && 
               egg.y > wolf.y && 
               egg.y < wolf.y + wolf.height;
    }

    // Catch egg manually
    function catchEgg() {
        for (let i = eggs.length - 1; i >= 0; i--) {
            if (checkCollision(eggs[i])) {
                // Egg caught!
                eggs.splice(i, 1);
                gameState.eggsCaught++;
                gameState.balance += 1; // 1 token per egg
                updateUI();
                
                // Visual feedback
                canvas.style.boxShadow = '0 0 30px #2ECC71';
                setTimeout(() => {
                    canvas.style.boxShadow = '0 0 20px rgba(255, 154, 60, 0.3)';
                }, 200);
                return;
            }
        }
    }

    // Update UI with current game state
    function updateUI() {
        const levelNames = ['Normal', 'Medium', 'Expert', 'Pro', 'Legend'];
        const levelColors = ['#8B4513', '#C0C0C0', '#FFD700', '#4169E1', '#800080'];
        
        levelEl.textContent = `${gameState.level} (${levelNames[gameState.level-1]})`;
        levelEl.style.color = levelColors[gameState.level-1];
        balanceEl.textContent = `${gameState.balance} tokens`;
        eggsCaughtEl.textContent = gameState.eggsCaught;
        incomePerHourEl.textContent = `${gameState.incomePerHour} tokens/hour`;
        totalReferralsEl.textContent = gameState.totalReferrals;
        referralEarningsEl.textContent = `${gameState.referralEarnings} TON`;
        
        // Update referral link
        const refCode = gameState.referralCode || 'YOURCODE';
        referralLinkEl.value = `https://t.me/WolfEggsBot?start=ref_${refCode}`;
        
        // Update wallet display
        if (gameState.walletConnected && gameState.walletAddress) {
            walletAddressEl.textContent = `${gameState.walletAddress.substring(0, 10)}...${gameState.walletAddress.substring(gameState.walletAddress.length - 8)}`;
            walletAddressEl.style.color = '#2ECC71';
            connectWalletBtn.textContent = 'Wallet Connected';
            connectWalletBtn.style.background = '#2ECC71';
        } else {
            walletAddressEl.textContent = 'Not connected';
            walletAddressEl.style.color = '#E74C3C';
            connectWalletBtn.textContent = 'Connect Wallet';
            connectWalletBtn.style.background = '#F39C12';
        }
        
        // Update upgrade buttons
        upgradeBtns.forEach(btn => {
            const btnLevel = parseInt(btn.dataset.level);
            if (btnLevel <= gameState.level) {
                btn.textContent = 'Upgraded';
                btn.style.background = '#95A5A6';
                btn.disabled = true;
            } else {
                btn.textContent = 'Upgrade';
                btn.style.background = '#9B59B6';
                btn.disabled = false;
            }
        });
    }

    // Event listeners
    leftBtn.addEventListener('click', () => {
        wolf.x = Math.max(0, wolf.x - wolf.speed);
    });

    rightBtn.addEventListener('click', () => {
        wolf.x = Math.min(canvas.width - wolf.width, wolf.x + wolf.speed);
    });

    catchBtn.addEventListener('click', catchEgg);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            wolf.x = Math.max(0, wolf.x - wolf.speed);
        } else if (e.key === 'ArrowRight') {
            wolf.x = Math.min(canvas.width - wolf.width, wolf.x + wolf.speed);
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            catchEgg();
        }
    });

    // Connect wallet button
    connectWalletBtn.addEventListener('click', () => {
        // Simulate wallet connection (replace with real TON Connect)
        if (!gameState.walletConnected) {
            gameState.walletConnected = true;
            gameState.walletAddress = 'EQCD39VS5YCbZQ7jLSQ...'; // Mock address
            alert('Wallet connected successfully! (Simulated)');
        } else {
            gameState.walletConnected = false;
            gameState.walletAddress = null;
            alert('Wallet disconnected.');
        }
        updateUI();
    });

    // Copy referral link
    copyLinkBtn.addEventListener('click', () => {
        referralLinkEl.select();
        document.execCommand('copy');
        copyLinkBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyLinkBtn.textContent = 'Copy Link';
        }, 2000);
    });

    // Upgrade level
    upgradeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLevel = parseInt(btn.dataset.level);
            const levelPrices = [0, 1, 2, 5, 10, 20];
            const levelIncomes = [0, 100, 250, 700, 1600, 3600];
            
            if (!gameState.walletConnected) {
                alert('Please connect your TON wallet first!');
                return;
            }
            
            const price = levelPrices[targetLevel];
            if (confirm(`Upgrade to level ${targetLevel} for ${price} TON?`)) {
                // Simulate upgrade (replace with real deposit)
                gameState.level = targetLevel;
                gameState.incomePerHour = levelIncomes[targetLevel];
                alert(`Successfully upgraded to level ${targetLevel}!`);
                updateUI();
            }
        });
    });

    // Deposit TON
    depositBtn.addEventListener('click', () => {
        const amount = parseFloat(depositAmountEl.value);
        if (!gameState.walletConnected) {
            alert('Please connect your TON wallet first!');
            return;
        }
        
        if (isNaN(amount) || amount < 1) {
            alert('Please enter a valid amount (minimum 1 TON)');
            return;
        }
        
        if (confirm(`Deposit ${amount} TON to upgrade your wolf?`)) {
            // Simulate deposit (replace with real TON transaction)
            alert(`Deposit of ${amount} TON simulated. In real app, you would be redirected to TON wallet.`);
            depositAmountEl.value = '';
        }
    });

    // Initialize referral code from Telegram
    if (tg.initDataUnsafe.start_param) {
        const startParam = tg.initDataUnsafe.start_param;
        if (startParam.startsWith('ref_')) {
            gameState.referralCode = startParam.substring(4);
            alert(`Referral code detected: ${gameState.referralCode}. Welcome!`);
        }
    }

    // Start game loop
    requestAnimationFrame(updateGame);

    // Simulate passive income every minute
    setInterval(() => {
        if (gameState.walletConnected) {
            // Add passive income based on level
            const incomePerMinute = gameState.incomePerHour / 60;
            gameState.balance += Math.floor(incomePerMinute);
            updateUI();
        }
    }, 60000); // Every minute

    // Simulate referral earnings (mock)
    setInterval(() => {
        if (gameState.totalReferrals > 0) {
            const earnings = gameState.totalReferrals * 0.1; // Mock earnings
            gameState.referralEarnings += earnings;
            updateUI();
        }
    }, 30000);
});