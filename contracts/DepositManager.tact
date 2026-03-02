// DepositManager contract for Wolf Catches Eggs game
// Written in Tact language for TON blockchain

import "@stdlib/deploy";

contract DepositManager with Deployable {
    owner: Address;
    deposits: Map<Address, Int>;
    referralBonuses: Map<Address, Int>;
    
    init() {
        self.owner = sender();
        self.deposits = emptyMap();
        self.referralBonuses = emptyMap();
    }
    
    // Deposit TON to upgrade wolf level
    receive("deposit") {
        let amount: Int = context().value;
        let user: Address = sender();
        
        // Update user deposit balance
        let currentDeposit: Int = 0;
        if (self.deposits.exists(user)) {
            currentDeposit = self.deposits.get(user);
        }
        self.deposits.set(user, currentDeposit + amount);
        
        // Emit deposit event (for backend tracking)
        emit("Deposit", user, amount);
        
        // Send 25% to first-level referrer if exists (handled off-chain)
        // Backend will track referrals and distribute bonuses
        
        // Send remaining to owner (game treasury)
        self.owner.transfer(amount * 75 / 100); // 75% to treasury
    }
    
    // Withdraw earnings (only owner)
    receive("withdraw") {
        require(sender() == self.owner, "Only owner can withdraw");
        let amount: Int = context().value;
        self.owner.transfer(amount);
        emit("Withdraw", amount);
    }
    
    // Distribute referral bonus (called by backend)
    receive("distribute_bonus") {
        require(sender() == self.owner, "Only owner can distribute bonuses");
        let user: Address = context().slice().loadAddress();
        let amount: Int = context().value;
        
        let currentBonus: Int = 0;
        if (self.referralBonuses.exists(user)) {
            currentBonus = self.referralBonuses.get(user);
        }
        self.referralBonuses.set(user, currentBonus + amount);
        
        user.transfer(amount);
        emit("ReferralBonus", user, amount);
    }
    
    // Get user deposit amount
    get fun getDeposit(user: Address): Int {
        if (self.deposits.exists(user)) {
            return self.deposits.get(user);
        } else {
            return 0;
        }
    }
    
    // Get user referral bonus amount
    get fun getReferralBonus(user: Address): Int {
        if (self.referralBonuses.exists(user)) {
            return self.referralBonuses.get(user);
        } else {
            return 0;
        }
    }
    
    // Get contract balance
    get fun getBalance(): Int {
        return balance();
    }
}