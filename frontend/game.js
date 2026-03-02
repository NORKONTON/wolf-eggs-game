// Wolf Catches Eggs - Game Logic with TON Connect
document.addEventListener('DOMContentLoaded', async function() {
    // Telegram Web App initialization
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.BackButton.hide();
    
    // TON Connect initialization
    let tonConnect = null;
    let wallet = null;
    const manifestUrl = 'https://raw.githubusercontent.com/wolf-pack-game/wolf-pack-landing/main/tonconnect-manifest.json';
    
    try {
        tonConnect = new TonConnectSDK.TonConnect({ manifestUrl });
        
        // Check if wallet is already connected
        const connectedWallets = await tonConnect.getWallets();
        if (connectedWallets.length > 0) {
            wallet = connectedWallets[0];
            console.log('Wallet already connected:', wallet);
        }
    } catch (error) {
        console.error('TON Connect initialization failed:', error);
        alert('TON Connect initialization failed. Please refresh the page.');
    }

    // Game state
    const gameState = {
        level: 1,
        balance: 0,
        eggsCaught: 0,
        incomePerHour: 100,
        walletConnected: wallet !== null,
        walletAddress: wallet ? wallet.account.address : null,
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

    // Update UI function
    function updateUI() {
        levelEl.textContent = `${gameState.level} (${getLevelName(gameState.level)})`;
        balanceEl.textContent = `${gameState.balance} tokens`;
        eggsCaughtEl.textContent = gameState.eggsCaught;
        incomePerHourEl.textContent = `${gameState.incomePerHour} tokens`;
        
        if (totalReferralsEl) totalReferralsEl.textContent = gameState.totalReferrals;
        if (referralEarningsEl) referralEarningsEl.textContent = `${gameState.referralEarnings.toFixed(2)} TON`;
        
        if (walletAddressEl) {
            if (gameState.walletConnected && gameState.walletAddress) {
                const shortAddress = `${gameState.walletAddress.slice(0, 6)}...${gameState.walletAddress.slice(-4)}`;
                walletAddressEl.textContent = shortAddress;
                connectWalletBtn.textContent = 'Disconnect Wallet';
                connectWalletBtn.style.background = '#E74C3C';
            } else {
                walletAddressEl.textContent = 'Not connected';
                connectWalletBtn.textContent = 'Connect TON Wallet';
                connectWalletBtn.style.background = '#3498DB';
            }
        }
        
        if (referralLinkEl) {
            const baseLink = 'https://t.me/wolfpackgame_bot?start=ref_';
            const refCode = gameState.referralCode || 'YOUR_CODE';
            referralLinkEl.value = baseLink + refCode;
        }
        
        // Update upgrade buttons
        updateUpgradeButtons();
    }

    // Get level name
    function getLevelName(level) {
        const names = ['', 'Normal', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
        return names[level] || 'Unknown';
    }

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
        });
    }

    // Check collision between wolf and egg
    function checkCollision(egg) {
        const wolfCenterX = wolf.x + wolf.width / 2;
        const wolfCenterY = wolf.y + wolf.height / 2;
        const distance = Math.sqrt(
            Math.pow(egg.x - wolfCenterX, 2) + Math.pow(egg.y - wolfCenterY, 2)
        );
        return distance < (wolf.width / 2 + egg.radius);
    }

    // Catch egg function
    function catchEgg() {
        let caught = false;
        for (let i = eggs.length - 1; i >= 0; i--) {
            if (checkCollision(eggs[i])) {
                // Egg caught!
                gameState.eggsCaught++;
                gameState.balance += 10; // 10 tokens per egg
                eggs.splice(i, 1);
                caught = true;
                break;
            }
        }
        
        if (caught) {
            updateUI();
            // Visual feedback
            canvas.style.border = '3px solid #2ECC71';
            setTimeout(() => {
                canvas.style.border = '3px solid #34495E';
            }, 200);
        }
    }

    // Update game state
    function updateGame(timestamp) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create new eggs
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
        
        // Continue game loop
        requestAnimationFrame(updateGame);
    }

    // Update upgrade buttons state
    function updateUpgradeButtons() {
        upgradeBtns.forEach(btn => {
            const targetLevel = parseInt(btn.dataset.level);
            if (targetLevel <= gameState.level) {
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

    // Connect wallet button with real TON Connect
    connectWalletBtn.addEventListener('click', async () => {
        if (!tonConnect) {
            alert('TON Connect not initialized. Please refresh the page.');
            return;
        }
        
        if (!gameState.walletConnected) {
            try {
                // Connect wallet
                const walletsList = await tonConnect.getWallets();
                if (walletsList.length === 0) {
                    alert('No TON wallets found. Please install Tonkeeper, Tonhub, or MyTonWallet.');
                    return;
                }
                
                // For simplicity, connect to first available wallet
                wallet = walletsList[0];
                await tonConnect.connect(wallet);
                
                gameState.walletConnected = true;
                gameState.walletAddress = wallet.account.address;
                alert(`Wallet connected successfully: ${wallet.name}`);
            } catch (error) {
                console.error('Wallet connection failed:', error);
                alert('Wallet connection failed: ' + error.message);
            }
        } else {
            try {
                // Disconnect wallet
                await tonConnect.disconnect();
                wallet = null;
                gameState.walletConnected = false;
                gameState.walletAddress = null;
                alert('Wallet disconnected.');
            } catch (error) {
                console.error('Wallet disconnection failed:', error);
                alert('Wallet disconnection failed: ' + error.message);
            }
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

    // Upgrade level with real TON deposit
    upgradeBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetLevel = parseInt(btn.dataset.level);
            const levelPrices = [0, 1, 2, 5, 10, 20];
            const levelIncomes = [0, 100, 250, 700, 1600, 3600];
            
            if (!gameState.walletConnected || !wallet) {
                alert('Please connect your TON wallet first!');
                return;
            }
            
            const price = levelPrices[targetLevel];
            if (confirm(`Upgrade to level ${targetLevel} for ${price} TON?`)) {
                try {
                    // Create transaction
                    const transaction = {
                        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
                        messages: [
                            {
                                address: 'UQD2yAUNNDC6wNqM0UcNKwvJeT-gPmDZWKQxItsCp9xae-G9', // Deposit wallet address
                                amount: price * 1000000000, // TON in nanoTON
                                payload: JSON.stringify({
                                    type: 'upgrade',
                                    level: targetLevel,
                                    userId: tg.initDataUnsafe.user?.id || 'unknown'
                                })
                            }
                        ]
                    };
                    
                    // Send transaction
                    const result = await tonConnect.sendTransaction(transaction);
                    console.log('Transaction sent:', result);
                    
                    // Update game state after successful transaction
                    gameState.level = targetLevel;
                    gameState.incomePerHour = levelIncomes[targetLevel];
                    alert(`Successfully upgraded to level ${targetLevel}! Transaction: ${result}`);
                    updateUI();
                    
                    // Send confirmation to backend
                    await fetch('/api/upgrade-level', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: tg.initDataUnsafe.user?.id,
                            level: targetLevel,
                            txHash: result,
                            amount: price
                        })
                    });
                    
                } catch (error) {
                    console.error('Transaction failed:', error);
                    alert('Transaction failed: ' + error.message);
                }
            }
        });
    });

    // Deposit TON (general deposit)
    depositBtn.addEventListener('click', async () => {
        const amount = parseFloat(depositAmountEl.value);
        if (!gameState.walletConnected || !wallet) {
            alert('Please connect your TON wallet first!');
            return;
        }
        
        if (isNaN(amount) || amount < 1) {
            alert('Please enter a valid amount (minimum 1 TON)');
            return;
        }
        
        if (confirm(`Deposit ${amount} TON to upgrade your wolf?`)) {
            try {
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 300,
                    messages: [
                        {
                            address: 'UQD2yAUNNDC6wNqM0UcNKwvJeT-gPmDZWKQxItsCp9xae-G9', // Deposit wallet address
                            amount: amount * 1000000000,
                            payload: JSON.stringify({
                                type: 'deposit',
                                userId: tg.initDataUnsafe.user?.id || 'unknown'
                            })
                        }
                    ]
                };
                
                const result = await tonConnect.sendTransaction(transaction);
                console.log('Deposit transaction sent:', result);
                
                alert(`Deposit of ${amount} TON sent! Transaction: ${result}`);
                depositAmountEl.value = '';
                
                // Send confirmation to backend
                await fetch('/api/deposit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: tg.initDataUnsafe.user?.id,
                        amount: amount,
                        txHash: result
                    })
                });
                
            } catch (error) {
                console.error('Deposit failed:', error);
                alert('Deposit failed: ' + error.message);
            }
        }
    });

    // Initialize referral code from Telegram
    if (tg.initDataUnsafe.start_param) {
        const startParam = tg.initDataUnsafe.start_param;
        if (startParam.startsWith('ref_')) {
            gameState.referralCode = startParam.substring(4);
            console.log(`Referral code detected: ${gameState.referralCode}`);
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