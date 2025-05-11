/**
 * QR Hunt Account Management
 * Handles user account, prizes, and payment information
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
            prizes: currentUser.prizes
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

// Initialize page
document.addEventListener('DOMContentLoaded', initAccountPage);
