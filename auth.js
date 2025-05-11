/**
 * QR Hunt Authentication System
 * Handles user registration, login, and session management
 */

// DOM Elements
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotPasswordLink = document.getElementById('forgot-password');

// Error and success message elements
const loginEmailError = document.getElementById('login-email-error');
const loginPasswordError = document.getElementById('login-password-error');
const loginError = document.getElementById('login-error');
const loginSuccess = document.getElementById('login-success');

const registerNameError = document.getElementById('register-name-error');
const registerEmailError = document.getElementById('register-email-error');
const registerPasswordError = document.getElementById('register-password-error');
const registerConfirmPasswordError = document.getElementById('register-confirm-password-error');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');

// Tab switching
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    clearErrors();
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    clearErrors();
});

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const successElements = document.querySelectorAll('.success-message');

    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });

    successElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });
}

// Show error message
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

// Show success message
function showSuccess(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    return password.length >= 8;
}

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let isValid = true;

    // Validate email
    if (!email) {
        showError(loginEmailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError(loginEmailError, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError(loginPasswordError, 'Password is required');
        isValid = false;
    }

    if (isValid) {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
        const user = users.find(u => u.email === email);

        if (user && user.password === password) {
            // Set current user in session
            sessionStorage.setItem('qrHuntCurrentUser', JSON.stringify({
                name: user.name,
                email: user.email,
                loggedIn: true,
                loginTime: new Date().toISOString()
            }));

            showSuccess(loginSuccess, 'Login successful! Redirecting...');

            // Redirect to account page or back to home
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect') || 'account.html';
                const prizeCode = urlParams.get('claim');

                // If there's a prize code, add it to the redirect URL
                if (prizeCode && redirectUrl === 'account.html') {
                    window.location.href = `${redirectUrl}?claim=${prizeCode}`;
                } else {
                    window.location.href = redirectUrl;
                }
            }, 1500);
        } else {
            showError(loginError, 'Invalid email or password');
        }
    }
});

// Registration form submission
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    let isValid = true;

    // Validate name
    if (!name) {
        showError(registerNameError, 'Name is required');
        isValid = false;
    }

    // Validate email
    if (!email) {
        showError(registerEmailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError(registerEmailError, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError(registerPasswordError, 'Password is required');
        isValid = false;
    } else if (!isValidPassword(password)) {
        showError(registerPasswordError, 'Password must be at least 8 characters long');
        isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
        showError(registerConfirmPasswordError, 'Passwords do not match');
        isValid = false;
    }

    if (isValid) {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            showError(registerError, 'Email already registered');
        } else {
            // Add new user
            users.push({
                name,
                email,
                password,
                registrationDate: new Date().toISOString(),
                prizes: []
            });

            localStorage.setItem('qrHuntUsers', JSON.stringify(users));

            showSuccess(registerSuccess, 'Registration successful! You can now login.');

            // Clear form
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm-password').value = '';

            // Switch to login tab after a delay
            setTimeout(() => {
                loginTab.click();
            }, 2000);
        }
    }
});

// Forgot password link
forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();

    if (!email) {
        showError(loginEmailError, 'Please enter your email first');
    } else if (!isValidEmail(email)) {
        showError(loginEmailError, 'Please enter a valid email address');
    } else {
        alert('Password reset functionality would be implemented with a real backend. For now, please create a new account.');
    }
});

// Check if user is already logged in
function checkLoggedInStatus() {
    const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser'));

    if (currentUser && currentUser.loggedIn) {
        // If on login page and already logged in, redirect to account page
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'account.html';
        }
    }
}

// Run on page load
checkLoggedInStatus();
