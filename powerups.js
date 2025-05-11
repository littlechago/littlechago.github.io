/**
 * QR Hunt Power-ups System
 * Provides functionality for power-ups that enhance the user's experience
 */

// Power-up definitions
const powerupTypes = {
    winBooster: {
        id: 'winBooster',
        name: 'Win Booster',
        description: '2x chance to win prizes for your next 5 scans',
        icon: '🎯',
        price: 2.99,
        duration: 5, // Number of scans it lasts for
        effect: 'doubles your chance of winning from 0.5% to 1%',
        multiplier: 2
    },
    prizeUpgrade: {
        id: 'prizeUpgrade',
        name: 'Prize Upgrade',
        description: 'Upgrades your next prize to a higher tier',
        icon: '⭐',
        price: 1.99,
        duration: 1, // Applies to next win only
        effect: 'upgrades your next prize to the next tier up',
        multiplier: 1
    },
    extraTime: {
        id: 'extraTime',
        name: 'Extra Time',
        description: 'Extends prize claim window from 6 to 24 hours',
        icon: '⏰',
        price: 0.99,
        duration: 1, // Applies to next win only
        effect: 'gives you more time to claim your next prize',
        multiplier: 1
    }
};

// Check if user has active power-ups
function hasActivePowerup(powerupType) {
    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');
    
    if (!currentUser || !currentUser.loggedIn) {
        return false;
    }
    
    // Get full user data from localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    const user = users.find(u => u.email === currentUser.email);
    
    if (!user || !user.powerups || !user.powerups[powerupType]) {
        return false;
    }
    
    return user.powerups[powerupType] > 0;
}

// Get user's power-up count
function getPowerupCount(powerupType) {
    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');
    
    if (!currentUser || !currentUser.loggedIn) {
        return 0;
    }
    
    // Get full user data from localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    const user = users.find(u => u.email === currentUser.email);
    
    if (!user || !user.powerups || !user.powerups[powerupType] === undefined) {
        return 0;
    }
    
    return user.powerups[powerupType];
}

// Use a power-up
function usePowerup(powerupType) {
    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');
    
    if (!currentUser || !currentUser.loggedIn) {
        console.error('User not logged in');
        return false;
    }
    
    // Get full user data from localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) {
        console.error('User not found in localStorage');
        return false;
    }
    
    const user = users[userIndex];
    
    // Check if user has the power-up
    if (!user.powerups || user.powerups[powerupType] <= 0) {
        console.error('User does not have this power-up');
        return false;
    }
    
    // Decrement power-up count
    user.powerups[powerupType]--;
    
    // Add to active power-ups
    if (!user.activePowerups) {
        user.activePowerups = {};
    }
    
    user.activePowerups[powerupType] = {
        activatedAt: new Date().toISOString(),
        remainingUses: powerupTypes[powerupType].duration
    };
    
    // Update user in localStorage
    users[userIndex] = user;
    localStorage.setItem('qrHuntUsers', JSON.stringify(users));
    
    console.log(`Power-up ${powerupType} activated`);
    return true;
}

// Purchase a power-up
function purchasePowerup(powerupType, quantity = 1) {
    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');
    
    if (!currentUser || !currentUser.loggedIn) {
        console.error('User not logged in');
        return {
            success: false,
            message: 'You must be logged in to purchase power-ups'
        };
    }
    
    // Get full user data from localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) {
        console.error('User not found in localStorage');
        return {
            success: false,
            message: 'User account not found'
        };
    }
    
    // Check if power-up type is valid
    if (!powerupTypes[powerupType]) {
        console.error('Invalid power-up type');
        return {
            success: false,
            message: 'Invalid power-up type'
        };
    }
    
    // In a real app, we would process payment here
    // For this demo, we'll just add the power-up to the user's account
    
    const user = users[userIndex];
    
    // Initialize powerups object if it doesn't exist
    if (!user.powerups) {
        user.powerups = {
            winBooster: 0,
            prizeUpgrade: 0,
            extraTime: 0
        };
    }
    
    // Add power-up to user's account
    user.powerups[powerupType] = (user.powerups[powerupType] || 0) + quantity;
    
    // Add purchase to user's purchase history
    if (!user.purchases) {
        user.purchases = [];
    }
    
    user.purchases.push({
        type: powerupType,
        quantity: quantity,
        price: powerupTypes[powerupType].price * quantity,
        date: new Date().toISOString()
    });
    
    // Update user in localStorage
    users[userIndex] = user;
    localStorage.setItem('qrHuntUsers', JSON.stringify(users));
    
    console.log(`Power-up ${powerupType} purchased (${quantity})`);
    
    return {
        success: true,
        message: `Successfully purchased ${quantity} ${powerupTypes[powerupType].name}!`,
        newCount: user.powerups[powerupType]
    };
}

// Apply power-up effects to QR code generation
function applyPowerupEffects(qrStats) {
    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');
    
    if (!currentUser || !currentUser.loggedIn) {
        return qrStats; // No changes if not logged in
    }
    
    // Get full user data from localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) {
        return qrStats; // No changes if user not found
    }
    
    const user = users[userIndex];
    
    // Check for active power-ups
    if (!user.activePowerups) {
        return qrStats; // No changes if no active power-ups
    }
    
    let modifiedStats = { ...qrStats };
    
    // Apply Win Booster effect
    if (user.activePowerups.winBooster && user.activePowerups.winBooster.remainingUses > 0) {
        // Double the prize rate
        modifiedStats.targetPrizeRate = qrStats.targetPrizeRate * powerupTypes.winBooster.multiplier;
        
        // Decrement remaining uses
        user.activePowerups.winBooster.remainingUses--;
        
        // Remove if used up
        if (user.activePowerups.winBooster.remainingUses <= 0) {
            delete user.activePowerups.winBooster;
        }
        
        // Update user in localStorage
        users[userIndex] = user;
        localStorage.setItem('qrHuntUsers', JSON.stringify(users));
    }
    
    return modifiedStats;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        powerupTypes,
        hasActivePowerup,
        getPowerupCount,
        usePowerup,
        purchasePowerup,
        applyPowerupEffects
    };
}
