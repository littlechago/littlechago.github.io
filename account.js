/**
 * QR Hunt Account Management
 * Handles user account, prizes, power-ups, and payment information
 */

// DOM Elements
const userInfoSection = document.getElementById('user-info');
const prizeList = document.getElementById('prize-list');
const noPrizesMessage = document.getElementById('no-prizes');
const logoutButton = document.getElementById('logout-btn');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const paymentForm = document.getElementById('payment-form');
const claimForm = document.getElementById('claim-form');
const claimResult = document.getElementById('claim-result');
const powerupsList = document.getElementById('powerups-list');
const powerupsStore = document.getElementById('powerups-store');

// Current user data
let currentUser = null;

// Initialize the account page
function initAccountPage() {
    // Check if user is logged in
    const userData = sessionStorage.getItem('qrHuntCurrentUser');

    if (!userData) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html?redirect=account.html';
        return;
    }

    currentUser = JSON.parse(userData);

    // Load full user data from localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    const fullUserData = users.find(user => user.email === currentUser.email);

    if (fullUserData) {
        // Merge with session data
        currentUser = { ...currentUser, ...fullUserData };

        // Display user info
        displayUserInfo();

        // Load prizes
        loadPrizes();

        // Load power-ups
        loadPowerups();

        // Load payment info
        loadPaymentInfo();

        // Check if there's a prize code in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const prizeCode = urlParams.get('claim');

        if (prizeCode) {
            // Switch to claim tab
            document.querySelector('.tab[data-tab="claim"]').click();

            // Fill in the prize code
            document.getElementById('prize-code').value = prizeCode;

            // Focus on the submit button
            setTimeout(() => {
                document.querySelector('#claim-form button').focus();
            }, 500);
        }
    } else {
        console.error('User data not found in localStorage');
        // Handle error - could redirect to login
    }
}

// Display user information
function displayUserInfo() {
    userInfoSection.innerHTML = `
        <p><strong>Name:</strong> ${currentUser.name}</p>
        <p><strong>Email:</strong> ${currentUser.email}</p>
        <p><strong>Member Since:</strong> ${formatDate(currentUser.registrationDate)}</p>
    `;
}

// Load user's prizes
function loadPrizes() {
    const prizes = currentUser.prizes || [];

    if (prizes.length === 0) {
        prizeList.innerHTML = '';
        noPrizesMessage.style.display = 'block';
        return;
    }

    noPrizesMessage.style.display = 'none';

    // Sort prizes by date (newest first)
    prizes.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate prize list HTML
    prizeList.innerHTML = prizes.map(prize => `
        <li class="prize-item">
            <div class="prize-header">
                <span class="prize-title">${prize.type || 'Prize'}</span>
                <span class="prize-date">${formatDate(prize.date)}</span>
            </div>
            <div class="prize-code">${prize.code}</div>
            <div>
                <span class="prize-status status-${prize.status.toLowerCase()}">${prize.status}</span>
                ${prize.value ? `<span style="margin-left: 10px;">Value: $${prize.value}</span>` : ''}
            </div>
            ${prize.message ? `<p style="margin-top: 10px; font-size: 0.9rem;">${prize.message}</p>` : ''}
        </li>
    `).join('');
}

// Load payment information
function loadPaymentInfo() {
    if (currentUser.paymentInfo) {
        document.getElementById('payment-method').value = currentUser.paymentInfo.method || '';
        document.getElementById('payment-email').value = currentUser.paymentInfo.email || '';
        document.getElementById('payment-notes').value = currentUser.paymentInfo.notes || '';
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding content
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Handle payment form submission
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const method = document.getElementById('payment-method').value;
    const email = document.getElementById('payment-email').value;
    const notes = document.getElementById('payment-notes').value;

    // Update user's payment info
    currentUser.paymentInfo = {
        method,
        email,
        notes,
        lastUpdated: new Date().toISOString()
    };

    // Update in localStorage
    updateUserData();

    // Show success message
    alert('Payment information saved successfully!');
});

// Handle prize claim form submission
claimForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const prizeCode = document.getElementById('prize-code').value.trim();

    if (!prizeCode) {
        claimResult.innerHTML = '<p style="color: #dc3545;">Please enter a prize code.</p>';
        return;
    }

    // Validate prize code format
    if (!validatePrizeCode(prizeCode)) {
        claimResult.innerHTML = '<p style="color: #dc3545;">Invalid prize code format. Please check and try again.</p>';
        return;
    }

    // Check if code already claimed by this user
    if (currentUser.prizes && currentUser.prizes.some(prize => prize.code === prizeCode)) {
        claimResult.innerHTML = '<p style="color: #dc3545;">You have already claimed this prize code.</p>';
        return;
    }

    // Check localStorage for prize wins
    const prizeWins = JSON.parse(localStorage.getItem('prizeWins') || '[]');
    const prizeWin = prizeWins.find(win => win.prizeCode === prizeCode);

    if (prizeWin && !prizeWin.claimed) {
        // Valid prize code that hasn't been claimed
        const prize = {
            code: prizeCode,
            date: new Date().toISOString(),
            type: getPrizeType(prizeWin.prizeUrl),
            status: 'Pending',
            message: 'Your prize claim is being verified. This usually takes 1-2 business days.'
        };

        // Add to user's prizes
        if (!currentUser.prizes) {
            currentUser.prizes = [];
        }

        currentUser.prizes.push(prize);

        // Mark as claimed in prizeWins
        prizeWin.claimed = true;
        prizeWin.claimedBy = currentUser.email;
        prizeWin.claimDate = new Date().toISOString();

        // Update localStorage
        localStorage.setItem('prizeWins', JSON.stringify(prizeWins));
        updateUserData();

        // Show success message
        claimResult.innerHTML = `
            <p style="color: #28a745;">Prize code verified successfully!</p>
            <p>Your prize claim is now pending verification. Check back soon for updates.</p>
        `;

        // Reload prizes display
        loadPrizes();

        // Clear form
        document.getElementById('prize-code').value = '';
    } else if (prizeWin && prizeWin.claimed) {
        claimResult.innerHTML = '<p style="color: #dc3545;">This prize code has already been claimed.</p>';
    } else {
        claimResult.innerHTML = '<p style="color: #dc3545;">Invalid or expired prize code. Please check and try again.</p>';
    }
});

// Validate prize code format
function validatePrizeCode(code) {
    // Basic format validation: QR-XXXXXXXX-XXXXX
    const regex = /^QR-[A-Z0-9]{8}-[A-Z0-9]{5}$/;
    return regex.test(code);
}

// Get prize type from URL
function getPrizeType(url) {
    if (!url) return 'Unknown Prize';

    if (url.includes('grand-prize')) return 'Grand Prize';
    if (url.includes('discount-code')) return 'Discount Code';
    if (url.includes('free-trial')) return 'Free Trial';
    if (url.includes('digital-gift')) return 'Digital Gift';
    if (url.includes('sweepstakes-entry')) return 'Sweepstakes Entry';

    return 'Prize';
}

// Update user data in localStorage
function updateUserData() {
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex !== -1) {
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            paymentInfo: currentUser.paymentInfo,
            prizes: currentUser.prizes,
            powerups: currentUser.powerups,
            activePowerups: currentUser.activePowerups,
            purchases: currentUser.purchases
        };

        localStorage.setItem('qrHuntUsers', JSON.stringify(users));
    }
}

// Handle logout
logoutButton.addEventListener('click', function() {
    // Clear session storage
    sessionStorage.removeItem('qrHuntCurrentUser');

    // Redirect to login page
    window.location.href = 'login.html';
});

// Load user's power-ups
function loadPowerups() {
    // Initialize powerups if not present
    if (!currentUser.powerups) {
        currentUser.powerups = {
            winBooster: 0,
            prizeUpgrade: 0,
            extraTime: 0
        };

        // Update in localStorage
        updateUserData();
    }

    // Load power-up types from powerups.js
    const powerupTypes = window.powerupTypes || {
        winBooster: {
            id: 'winBooster',
            name: 'Win Booster',
            description: '2x chance to win prizes for your next 5 scans',
            icon: '🎯',
            price: 2.99,
            duration: 5,
            effect: 'doubles your chance of winning from 0.5% to 1%'
        },
        prizeUpgrade: {
            id: 'prizeUpgrade',
            name: 'Prize Upgrade',
            description: 'Upgrades your next prize to a higher tier',
            icon: '⭐',
            price: 1.99,
            duration: 1,
            effect: 'upgrades your next prize to the next tier up'
        },
        extraTime: {
            id: 'extraTime',
            name: 'Extra Time',
            description: 'Extends prize claim window from 6 to 24 hours',
            icon: '⏰',
            price: 0.99,
            duration: 1,
            effect: 'gives you more time to claim your next prize'
        }
    };

    // Display user's power-ups
    const powerupsHTML = Object.keys(powerupTypes).map(type => {
        const count = currentUser.powerups[type] || 0;
        const powerup = powerupTypes[type];

        return `
            <div class="powerup-card">
                <div class="powerup-icon">${powerup.icon}</div>
                <div class="powerup-name">${powerup.name}</div>
                <div class="powerup-count">You have: ${count}</div>
                <div class="powerup-description">${powerup.description}</div>
                <div class="powerup-action">
                    <button class="powerup-button"
                            data-powerup="${type}"
                            ${count === 0 ? 'disabled' : ''}>
                        ${count > 0 ? 'Activate' : 'None Available'}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (powerupsList) {
        if (Object.values(currentUser.powerups).every(count => count === 0)) {
            powerupsList.innerHTML = `
                <div class="empty-powerups">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3>No Power-ups Yet</h3>
                    <p>Purchase power-ups below to enhance your QR Hunt experience!</p>
                </div>
            `;
        } else {
            powerupsList.innerHTML = powerupsHTML;

            // Add event listeners to activate buttons
            document.querySelectorAll('.powerup-button').forEach(button => {
                if (!button.disabled) {
                    button.addEventListener('click', function() {
                        const powerupType = this.getAttribute('data-powerup');
                        activatePowerup(powerupType);
                    });
                }
            });
        }
    }

    // Display power-up store
    const storeHTML = Object.keys(powerupTypes).map(type => {
        const powerup = powerupTypes[type];

        return `
            <div class="store-item" data-powerup="${type}">
                <div class="store-item-icon">${powerup.icon}</div>
                <div class="store-item-name">${powerup.name}</div>
                <div class="store-item-price">$${powerup.price.toFixed(2)}</div>
                <div class="store-item-description">${powerup.description}</div>
                <div class="store-item-effect">Effect: ${powerup.effect}</div>
                <div class="quantity-selector">
                    <button class="quantity-btn minus" data-powerup="${type}">-</button>
                    <span class="quantity-value" id="quantity-${type}">1</span>
                    <button class="quantity-btn plus" data-powerup="${type}">+</button>
                </div>
                <button class="buy-button" data-powerup="${type}">Buy Now</button>
            </div>
        `;
    }).join('');

    if (powerupsStore) {
        powerupsStore.innerHTML = storeHTML;

        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const powerupType = this.getAttribute('data-powerup');
                const quantityElement = document.getElementById(`quantity-${powerupType}`);
                let quantity = parseInt(quantityElement.textContent);

                if (this.classList.contains('minus')) {
                    quantity = Math.max(1, quantity - 1);
                } else {
                    quantity = Math.min(10, quantity + 1);
                }

                quantityElement.textContent = quantity;
            });
        });

        // Add event listeners to buy buttons
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', function() {
                const powerupType = this.getAttribute('data-powerup');
                const quantity = parseInt(document.getElementById(`quantity-${powerupType}`).textContent);
                purchasePowerup(powerupType, quantity);
            });
        });
    }
}

// Activate a power-up
function activatePowerup(powerupType) {
    // Check if user has this power-up
    if (!currentUser.powerups || currentUser.powerups[powerupType] <= 0) {
        alert('You don\'t have any of these power-ups available.');
        return;
    }

    // Decrement power-up count
    currentUser.powerups[powerupType]--;

    // Add to active power-ups
    if (!currentUser.activePowerups) {
        currentUser.activePowerups = {};
    }

    // Get power-up details
    const powerupTypes = window.powerupTypes || {
        winBooster: { duration: 5 },
        prizeUpgrade: { duration: 1 },
        extraTime: { duration: 1 }
    };

    currentUser.activePowerups[powerupType] = {
        activatedAt: new Date().toISOString(),
        remainingUses: powerupTypes[powerupType].duration
    };

    // Update user data
    updateUserData();

    // Show success message
    alert(`${powerupType === 'winBooster' ? 'Win Booster' :
           powerupType === 'prizeUpgrade' ? 'Prize Upgrade' :
           'Extra Time'} activated successfully!`);

    // Reload power-ups display
    loadPowerups();
}

// Purchase a power-up
function purchasePowerup(powerupType, quantity) {
    // Get power-up details
    const powerupTypes = window.powerupTypes || {
        winBooster: { name: 'Win Booster', price: 2.99 },
        prizeUpgrade: { name: 'Prize Upgrade', price: 1.99 },
        extraTime: { name: 'Extra Time', price: 0.99 }
    };

    const powerup = powerupTypes[powerupType];
    const totalPrice = (powerup.price * quantity).toFixed(2);

    // Confirm purchase
    if (confirm(`Are you sure you want to purchase ${quantity} ${powerup.name}${quantity > 1 ? 's' : ''} for $${totalPrice}?`)) {
        // In a real app, we would process payment here
        // For this demo, we'll just add the power-up to the user's account

        // Initialize powerups object if it doesn't exist
        if (!currentUser.powerups) {
            currentUser.powerups = {
                winBooster: 0,
                prizeUpgrade: 0,
                extraTime: 0
            };
        }

        // Add power-up to user's account
        currentUser.powerups[powerupType] = (currentUser.powerups[powerupType] || 0) + quantity;

        // Add purchase to user's purchase history
        if (!currentUser.purchases) {
            currentUser.purchases = [];
        }

        currentUser.purchases.push({
            type: powerupType,
            quantity: quantity,
            price: powerup.price * quantity,
            date: new Date().toISOString()
        });

        // Update user data
        updateUserData();

        // Show success message
        alert(`Successfully purchased ${quantity} ${powerup.name}${quantity > 1 ? 's' : ''}!`);

        // Reload power-ups display
        loadPowerups();
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', initAccountPage);
