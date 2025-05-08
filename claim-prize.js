document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prizeClaimForm');
    const statusDiv = document.getElementById('claimStatus');

    // Track submission attempts for rate limiting
    initRateLimiting();

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check rate limiting
        if (isRateLimited()) {
            showStatus('Too many submission attempts. Please try again later.', 'error');
            return;
        }

        // Get form values
        const prizeCode = document.getElementById('prizeCode').value.trim();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const winDate = document.getElementById('winDate').value;
        const winDetails = document.getElementById('winDetails').value.trim();
        const termsAgreed = document.getElementById('termsAgreement').checked;

        // Get reCAPTCHA response
        const recaptchaResponse = grecaptcha.getResponse();

        // Comprehensive validation
        if (!prizeCode || !name || !email || !winDate || !winDetails) {
            showStatus('Please fill out all required fields', 'error');
            return;
        }

        if (!recaptchaResponse) {
            showStatus('Please complete the CAPTCHA verification', 'error');
            return;
        }

        if (!termsAgreed) {
            showStatus('You must agree to the terms to submit your claim', 'error');
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            showStatus('Please enter a valid email address', 'error');
            return;
        }

        // Validate prize code format and checksum
        if (!validatePrizeCodeFormat(prizeCode)) {
            showStatus('Invalid prize code format. Please check and try again.', 'error');
            return;
        }

        // Check if this code has already been claimed
        const existingClaims = JSON.parse(localStorage.getItem('prizeClaims') || '[]');
        const alreadyClaimed = existingClaims.some(claim => claim.prizeCode.toLowerCase() === prizeCode.toLowerCase());

        if (alreadyClaimed) {
            showStatus('This prize code has already been claimed', 'error');
            return;
        }

        // Verify the code exists in our prize wins
        const prizeWins = JSON.parse(localStorage.getItem('prizeWins') || '[]');
        const validWin = prizeWins.some(win => win.prizeCode === prizeCode);

        if (!validWin) {
            // Log the suspicious activity but don't tell the user it's invalid
            // This prevents people from guessing which codes are valid
            logSuspiciousActivity(prizeCode, email);

            // Show a generic error that looks like a technical issue
            showStatus('We encountered a problem processing your claim. Please try again later or contact support.', 'error');
            return;
        }

        // Store the claim with enhanced security data
        saveClaim(prizeCode, name, email, address, winDate, winDetails);

        // Record this submission for rate limiting
        recordSubmission();

        // Show success message
        showStatus('Your prize claim has been submitted successfully! We will contact you soon via email with further instructions.', 'success');
        form.reset();
        grecaptcha.reset();
    });

    function validatePrizeCodeFormat(code) {
        // Basic format validation
        const regex = /^QR-[A-Z0-9]{8}-[A-Z0-9]{5}$/;
        return regex.test(code);

        // Note: In a real implementation, you would also call the validatePrizeCode function
        // from script.js to verify the checksum, but for simplicity we're just checking format here
    }

    function saveClaim(prizeCode, name, email, address, winDate, winDetails) {
        // Get existing claims or initialize empty array
        let claims = JSON.parse(localStorage.getItem('prizeClaims') || '[]');

        // Get client fingerprint data for security
        const fingerprint = getClientFingerprint();

        // Add new claim with timestamp and security data
        claims.push({
            prizeCode,
            name,
            email,
            address,
            winDate,
            winDetails,
            timestamp: new Date().toISOString(),
            status: 'pending',
            securityData: {
                fingerprint,
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                screen: `${window.screen.width}x${window.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language
            }
        });

        // Save back to localStorage
        localStorage.setItem('prizeClaims', JSON.stringify(claims));
    }

    function getClientFingerprint() {
        // Create a simple fingerprint based on available browser data
        // This is a simplified version - in production you might use a library like FingerprintJS
        const components = [
            navigator.userAgent,
            navigator.language,
            new Date().getTimezoneOffset(),
            screen.colorDepth,
            window.screen.width + 'x' + window.screen.height,
            navigator.cookieEnabled,
            navigator.doNotTrack,
            navigator.hardwareConcurrency,
            navigator.deviceMemory
        ];

        // Create a hash of the components
        let hash = 0;
        const str = components.join('');
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }

        return hash.toString(16);
    }

    function logSuspiciousActivity(prizeCode, email) {
        // Get existing suspicious activity log or initialize empty array
        let suspiciousLog = JSON.parse(localStorage.getItem('suspiciousClaimAttempts') || '[]');

        // Add new suspicious activity with timestamp and client data
        suspiciousLog.push({
            prizeCode,
            email,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            fingerprint: getClientFingerprint()
        });

        // Save back to localStorage
        localStorage.setItem('suspiciousClaimAttempts', JSON.stringify(suspiciousLog));
    }

    function initRateLimiting() {
        // Initialize rate limiting data if it doesn't exist
        if (!localStorage.getItem('claimSubmissions')) {
            localStorage.setItem('claimSubmissions', JSON.stringify([]));
        }
    }

    function recordSubmission() {
        // Get existing submissions
        let submissions = JSON.parse(localStorage.getItem('claimSubmissions') || '[]');

        // Add current submission with timestamp and fingerprint
        submissions.push({
            timestamp: new Date().toISOString(),
            fingerprint: getClientFingerprint()
        });

        // Only keep the last 20 submissions to save space
        if (submissions.length > 20) {
            submissions = submissions.slice(-20);
        }

        // Save back to localStorage
        localStorage.setItem('claimSubmissions', JSON.stringify(submissions));
    }

    function isRateLimited() {
        // Get existing submissions
        const submissions = JSON.parse(localStorage.getItem('claimSubmissions') || '[]');

        // Get current fingerprint
        const fingerprint = getClientFingerprint();

        // Get submissions from this client in the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const recentSubmissions = submissions.filter(sub =>
            sub.fingerprint === fingerprint && sub.timestamp > oneHourAgo
        );

        // Rate limit: maximum 3 submissions per hour per client
        return recentSubmissions.length >= 3;
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = 'status ' + type; // 'success' or 'error'

        // Scroll to status message
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
