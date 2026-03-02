-- Wolf Catches Eggs - Initial Database Schema
-- PostgreSQL 14+

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    wallet_address VARCHAR(48),
    current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
    balance DECIMAL(20, 8) DEFAULT 0,
    total_deposited DECIMAL(20, 8) DEFAULT 0,
    referrer_id INTEGER REFERENCES users(id),
    referral_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for users table
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referrer_id ON users(referrer_id);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

-- Referrals table (multi-level referral tracking)
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    referral_id INTEGER NOT NULL REFERENCES users(id),
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
    deposit_amount DECIMAL(20, 8) NOT NULL,
    commission_amount DECIMAL(20, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, referral_id, level)
);

-- Indexes for referrals table
CREATE INDEX idx_referrals_user_id ON referrals(user_id);
CREATE INDEX idx_referrals_referral_id ON referrals(referral_id);
CREATE INDEX idx_referrals_level ON referrals(level);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'referral_bonus', 'level_upgrade', 'egg_catch')),
    amount DECIMAL(20, 8) NOT NULL,
    ton_amount DECIMAL(20, 8),
    tx_hash VARCHAR(100),
    level INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for transactions table
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Game sessions table (for tracking play time)
CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    start_time TIMESTAMP DEFAULT NOW(),
    end_time TIMESTAMP,
    eggs_caught INTEGER DEFAULT 0,
    tokens_earned DECIMAL(20, 8) DEFAULT 0
);

-- Indexes for game_sessions table
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_start_time ON game_sessions(start_time);

-- Levels configuration table
CREATE TABLE levels_config (
    level INTEGER PRIMARY KEY CHECK (level BETWEEN 1 AND 5),
    name VARCHAR(50) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    income_per_hour DECIMAL(20, 8) NOT NULL,
    color VARCHAR(20) NOT NULL,
    description TEXT
);

-- Insert default levels configuration
INSERT INTO levels_config (level, name, price, income_per_hour, color, description) VALUES
(1, 'Normal', 1.0, 100.0, '#8B4513', 'Basic wolf, starts your journey'),
(2, 'Medium', 2.0, 250.0, '#C0C0C0', 'Improved catching speed'),
(3, 'Expert', 5.0, 700.0, '#FFD700', 'Professional egg catcher'),
(4, 'Pro', 10.0, 1600.0, '#4169E1', 'Elite level with bonuses'),
(5, 'Legend', 20.0, 3600.0, '#800080', 'Legendary status, maximum income');

-- TON transactions tracking (on-chain)
CREATE TABLE ton_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tx_hash VARCHAR(100) UNIQUE NOT NULL,
    from_address VARCHAR(48) NOT NULL,
    to_address VARCHAR(48) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    block_number INTEGER,
    confirmations INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP
);

-- Indexes for ton_transactions table
CREATE INDEX idx_ton_transactions_user_id ON ton_transactions(user_id);
CREATE INDEX idx_ton_transactions_tx_hash ON ton_transactions(tx_hash);
CREATE INDEX idx_ton_transactions_status ON ton_transactions(status);

-- Audit log for administrative actions
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.telegram_id,
    u.username,
    u.current_level,
    lc.name as level_name,
    u.balance,
    u.total_deposited,
    COUNT(DISTINCT r.referral_id) as total_referrals,
    COALESCE(SUM(r.commission_amount), 0) as total_referral_earnings,
    COALESCE(SUM(CASE WHEN t.type = 'egg_catch' THEN t.amount ELSE 0 END), 0) as total_eggs_caught_value,
    u.created_at
FROM users u
LEFT JOIN referrals r ON u.id = r.user_id
LEFT JOIN transactions t ON u.id = t.user_id
LEFT JOIN levels_config lc ON u.current_level = lc.level
GROUP BY u.id, u.telegram_id, u.username, u.current_level, lc.name, u.balance, u.total_deposited, u.created_at;

-- View for referral network
CREATE VIEW referral_network AS
WITH RECURSIVE referral_tree AS (
    SELECT 
        u.id,
        u.telegram_id,
        u.username,
        u.referrer_id,
        1 as depth,
        ARRAY[u.id] as path
    FROM users u
    WHERE u.referrer_id IS NULL
    
    UNION ALL
    
    SELECT 
        u.id,
        u.telegram_id,
        u.username,
        u.referrer_id,
        rt.depth + 1,
        rt.path || u.id
    FROM users u
    JOIN referral_tree rt ON u.referrer_id = rt.id
    WHERE depth < 3  -- Limit to 3 levels
)
SELECT * FROM referral_tree;

-- Insert sample data for testing (optional)
-- INSERT INTO users (telegram_id, username, referral_code) VALUES 
-- (123456789, 'test_user', 'REF123ABC'),
-- (987654321, 'another_user', 'REF456DEF');

-- COMMIT;
COMMENT ON TABLE users IS 'Stores user accounts and balances';
COMMENT ON TABLE referrals IS 'Tracks multi-level referral relationships and commissions';
COMMENT ON TABLE transactions IS 'Records all financial transactions';
COMMENT ON TABLE game_sessions IS 'Tracks user game sessions for analytics';
COMMENT ON TABLE levels_config IS 'Configuration for wolf upgrade levels';
COMMENT ON TABLE ton_transactions IS 'Tracks TON blockchain transactions';
COMMENT ON TABLE audit_log IS 'Audit trail for administrative actions';