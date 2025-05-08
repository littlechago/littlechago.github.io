document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prizeClaimForm');
    const statusDiv = document.getElementById('claimStatus');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const prizeCode = document.getElementById('prizeCode').value.trim();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        
        // Simple validation
        if (!prizeCode || !name || !email) {
            showStatus('Please fill out all required fields', 'error');
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showStatus('Please enter a valid email address', 'error');
            return;
        }
        
        // Check if this code has already been claimed
        const existingClaims = JSON.parse(localStorage.getItem('prizeClaims') || '[]');
        const alreadyClaimed = existingClaims.some(claim => claim.prizeCode.toLowerCase() === prizeCode.toLowerCase());
        
        if (alreadyClaimed) {
            showStatus('This prize code has already been claimed', 'error');
            return;
        }
        
        // Store the claim
        saveClaim(prizeCode, name, email, address);
        
        // Show success message
        showStatus('Your prize claim has been submitted successfully! We will contact you soon via email with further instructions.', 'success');
        form.reset();
    });
    
    function saveClaim(prizeCode, name, email, address) {
        // Get existing claims or initialize empty array
        let claims = JSON.parse(localStorage.getItem('prizeClaims') || '[]');
        
        // Add new claim with timestamp
        claims.push({
            prizeCode,
            name,
            email,
            address,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        
        // Save back to localStorage
        localStorage.setItem('prizeClaims', JSON.stringify(claims));
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
