/**
 * QR Hunt Admin Dashboard
 * Handles admin authentication and prize management
 */

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const loginError = document.getElementById('login-error');
const adminPassword = document.getElementById('admin-password');

const totalUsersElement = document.getElementById('total-users');
const totalPrizesElement = document.getElementById('total-prizes');
const pendingClaimsElement = document.getElementById('pending-claims');
const paidAmountElement = document.getElementById('paid-amount');

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const prizesTableBody = document.getElementById('prizes-table-body');
const noPrizesMessage = document.getElementById('no-prizes');
const usersTableBody = document.getElementById('users-table-body');
const noUsersMessage = document.getElementById('no-users');

const saveSettingsButton = document.getElementById('save-settings');
const prizeRateInput = document.getElementById('prize-rate');

// Admin password (in a real app, this would be server-side)
const ADMIN_PASSWORD = 'qrhunt2024';

// Check if admin is logged in
function checkAdminLogin() {
    const isLoggedIn = sessionStorage.getItem('qrHuntAdminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadDashboardData();
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
}

// Handle admin login
loginButton.addEventListener('click', function() {
    const password = adminPassword.value;
    
    if (password === ADMIN_PASSWORD) {
        // Set admin logged in
        sessionStorage.setItem('qrHuntAdminLoggedIn', 'true');
        
        // Show dashboard
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        
        // Clear password field
        adminPassword.value = '';
        
        // Hide error message
        loginError.style.display = 'none';
        
        // Load dashboard data
        loadDashboardData();
    } else {
        // Show error message
        loginError.textContent = 'Invalid password. Please try again.';
        loginError.style.display = 'block';
    }
});

// Handle admin logout
logoutButton.addEventListener('click', function() {
    // Clear admin session
    sessionStorage.removeItem('qrHuntAdminLoggedIn');
    
    // Show login section
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
});

// Load dashboard data
function loadDashboardData() {
    // Load users
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    
    // Load prize wins
    const prizeWins = JSON.parse(localStorage.getItem('prizeWins') || '[]');
    
    // Update stats
    updateStats(users, prizeWins);
    
    // Load prize claims
    loadPrizeClaims(users);
    
    // Load users table
    loadUsersTable(users);
    
    // Load settings
    loadSettings();
}

// Update dashboard stats
function updateStats(users, prizeWins) {
    // Total users
    totalUsersElement.textContent = users.length;
    
    // Total prizes
    let totalPrizes = 0;
    let pendingClaims = 0;
    let paidAmount = 0;
    
    users.forEach(user => {
        if (user.prizes && user.prizes.length > 0) {
            totalPrizes += user.prizes.length;
            
            user.prizes.forEach(prize => {
                if (prize.status === 'Pending') {
                    pendingClaims++;
                }
                
                if (prize.status === 'Paid' && prize.value) {
                    paidAmount += parseFloat(prize.value);
                }
            });
        }
    });
    
    totalPrizesElement.textContent = totalPrizes;
    pendingClaimsElement.textContent = pendingClaims;
    paidAmountElement.textContent = '$' + paidAmount.toFixed(2);
}

// Load prize claims
function loadPrizeClaims(users) {
    // Collect all prizes from all users
    let allPrizes = [];
    
    users.forEach(user => {
        if (user.prizes && user.prizes.length > 0) {
            user.prizes.forEach(prize => {
                allPrizes.push({
                    ...prize,
                    userName: user.name,
                    userEmail: user.email
                });
            });
        }
    });
    
    // Sort prizes by date (newest first)
    allPrizes.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allPrizes.length === 0) {
        prizesTableBody.innerHTML = '';
        noPrizesMessage.style.display = 'block';
        return;
    }
    
    noPrizesMessage.style.display = 'none';
    
    // Generate table rows
    prizesTableBody.innerHTML = allPrizes.map(prize => `
        <tr data-email="${prize.userEmail}" data-code="${prize.code}">
            <td>${formatDate(prize.date)}</td>
            <td>${prize.userName}<br><small>${prize.userEmail}</small></td>
            <td>${prize.code}</td>
            <td>${prize.type || 'Prize'}</td>
            <td><span class="status-badge status-${prize.status.toLowerCase()}">${prize.status}</span></td>
            <td class="action-buttons">
                ${getActionButtons(prize)}
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to action buttons
    addPrizeActionListeners();
}

// Get action buttons based on prize status
function getActionButtons(prize) {
    switch (prize.status) {
        case 'Pending':
            return `
                <button class="btn btn-success verify-prize" data-email="${prize.userEmail}" data-code="${prize.code}">Verify</button>
                <button class="btn btn-danger reject-prize" data-email="${prize.userEmail}" data-code="${prize.code}">Reject</button>
            `;
        case 'Verified':
            return `
                <button class="btn btn-primary mark-paid" data-email="${prize.userEmail}" data-code="${prize.code}">Mark Paid</button>
                <button class="btn btn-danger reject-prize" data-email="${prize.userEmail}" data-code="${prize.code}">Reject</button>
            `;
        case 'Rejected':
            return `
                <button class="btn btn-success verify-prize" data-email="${prize.userEmail}" data-code="${prize.code}">Verify</button>
            `;
        case 'Paid':
            return `<span style="color: #6f42c1;">Completed</span>`;
        default:
            return '';
    }
}

// Add event listeners to prize action buttons
function addPrizeActionListeners() {
    // Verify prize buttons
    document.querySelectorAll('.verify-prize').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const code = this.getAttribute('data-code');
            
            // Prompt for prize value
            const value = prompt('Enter prize value (e.g., 10.00):');
            
            if (value !== null) {
                updatePrizeStatus(email, code, 'Verified', parseFloat(value));
            }
        });
    });
    
    // Reject prize buttons
    document.querySelectorAll('.reject-prize').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const code = this.getAttribute('data-code');
            
            // Prompt for rejection reason
            const reason = prompt('Enter rejection reason:');
            
            if (reason !== null) {
                updatePrizeStatus(email, code, 'Rejected', null, reason);
            }
        });
    });
    
    // Mark paid buttons
    document.querySelectorAll('.mark-paid').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const code = this.getAttribute('data-code');
            
            // Confirm payment
            if (confirm('Confirm that payment has been sent to the user?')) {
                updatePrizeStatus(email, code, 'Paid');
            }
        });
    });
}

// Update prize status
function updatePrizeStatus(email, code, status, value = null, message = null) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
    
    // Find user
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
        const user = users[userIndex];
        
        // Find prize
        const prizeIndex = user.prizes.findIndex(prize => prize.code === code);
        
        if (prizeIndex !== -1) {
            // Update prize status
            user.prizes[prizeIndex].status = status;
            
            // Update value if provided
            if (value !== null) {
                user.prizes[prizeIndex].value = value;
            }
            
            // Update message if provided
            if (message !== null) {
                user.prizes[prizeIndex].message = message;
            } else if (status === 'Verified') {
                user.prizes[prizeIndex].message = 'Your prize has been verified! We will process your payment soon.';
            } else if (status === 'Paid') {
                user.prizes[prizeIndex].message = 'Your prize has been paid! Thank you for playing QR Hunt.';
            }
            
            // Update user in users array
            users[userIndex] = user;
            
            // Save to localStorage
            localStorage.setItem('qrHuntUsers', JSON.stringify(users));
            
            // Reload dashboard data
            loadDashboardData();
        }
    }
}

// Load users table
function loadUsersTable(users) {
    if (users.length === 0) {
        usersTableBody.innerHTML = '';
        noUsersMessage.style.display = 'block';
        return;
    }
    
    noUsersMessage.style.display = 'none';
    
    // Generate table rows
    usersTableBody.innerHTML = users.map(user => {
        const prizeCount = user.prizes ? user.prizes.length : 0;
        const hasPaymentInfo = user.paymentInfo && user.paymentInfo.method;
        
        return `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>${prizeCount}</td>
                <td>${hasPaymentInfo ? `${user.paymentInfo.method} (${user.paymentInfo.email})` : 'Not set'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary view-user" data-email="${user.email}">View Details</button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners to user action buttons
    document.querySelectorAll('.view-user').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            alert(`User details functionality would be implemented in a full version. Email: ${email}`);
        });
    });
}

// Load settings
function loadSettings() {
    // Get settings from localStorage
    const settings = JSON.parse(localStorage.getItem('qrHuntSettings') || '{}');
    
    // Set prize rate
    prizeRateInput.value = settings.prizeRate || 3;
}

// Save settings
saveSettingsButton.addEventListener('click', function() {
    const prizeRate = parseFloat(prizeRateInput.value);
    
    // Validate prize rate
    if (isNaN(prizeRate) || prizeRate < 1 || prizeRate > 10) {
        alert('Prize rate must be between 1% and 10%');
        return;
    }
    
    // Save settings to localStorage
    const settings = {
        prizeRate: prizeRate
    };
    
    localStorage.setItem('qrHuntSettings', JSON.stringify(settings));
    
    alert('Settings saved successfully!');
});

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

// Add event listener for Enter key on password field
adminPassword.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        loginButton.click();
    }
});

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', checkAdminLogin);
