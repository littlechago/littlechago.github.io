// Cookie Consent Banner for QR Hunt
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        createConsentBanner();
    }

    function createConsentBanner() {
        // Create banner elements
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '0';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.padding = '15px 20px';
        banner.style.background = 'rgba(0, 0, 0, 0.85)';
        banner.style.color = '#fff';
        banner.style.zIndex = '999999';
        banner.style.display = 'flex';
        banner.style.flexDirection = 'column';
        banner.style.gap = '15px';
        banner.style.backdropFilter = 'blur(5px)';
        banner.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.2)';
        banner.style.fontFamily = "'Poppins', sans-serif";

        // Content container
        const content = document.createElement('div');
        content.innerHTML = `
            <h3 style="margin: 0 0 10px; font-size: 1.2rem; color: #667eea;">We Value Your Privacy</h3>
            <p style="margin: 0; font-size: 0.9rem; line-height: 1.5;">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies. Visit our 
                <a href="privacy-policy.html" style="color: #667eea; text-decoration: underline;">Privacy Policy</a> 
                to learn more.
            </p>
        `;

        // Buttons container
        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.gap = '10px';
        buttons.style.flexWrap = 'wrap';
        buttons.style.justifyContent = 'flex-end';

        // Reject button
        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject All';
        rejectButton.style.padding = '8px 16px';
        rejectButton.style.background = 'transparent';
        rejectButton.style.border = '1px solid #ccc';
        rejectButton.style.borderRadius = '20px';
        rejectButton.style.color = '#ccc';
        rejectButton.style.cursor = 'pointer';
        rejectButton.style.fontFamily = "'Poppins', sans-serif";
        rejectButton.style.fontSize = '0.9rem';
        rejectButton.style.transition = 'all 0.3s ease';

        rejectButton.addEventListener('mouseover', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        rejectButton.addEventListener('mouseout', function() {
            this.style.background = 'transparent';
        });

        rejectButton.addEventListener('click', function() {
            // Set minimal consent
            localStorage.setItem('cookieConsent', 'minimal');
            banner.remove();
        });

        // Accept button
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept All';
        acceptButton.style.padding = '8px 16px';
        acceptButton.style.background = 'linear-gradient(to right, #764ba2, #667eea)';
        acceptButton.style.border = 'none';
        acceptButton.style.borderRadius = '20px';
        acceptButton.style.color = '#fff';
        acceptButton.style.cursor = 'pointer';
        acceptButton.style.fontFamily = "'Poppins', sans-serif";
        acceptButton.style.fontSize = '0.9rem';
        acceptButton.style.transition = 'all 0.3s ease';
        acceptButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

        acceptButton.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });

        acceptButton.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        });

        acceptButton.addEventListener('click', function() {
            // Set full consent
            localStorage.setItem('cookieConsent', 'full');
            banner.remove();
        });

        // Customize button
        const customizeButton = document.createElement('button');
        customizeButton.textContent = 'Customize';
        customizeButton.style.padding = '8px 16px';
        customizeButton.style.background = 'transparent';
        customizeButton.style.border = '1px solid #667eea';
        customizeButton.style.borderRadius = '20px';
        customizeButton.style.color = '#667eea';
        customizeButton.style.cursor = 'pointer';
        customizeButton.style.fontFamily = "'Poppins', sans-serif";
        customizeButton.style.fontSize = '0.9rem';
        customizeButton.style.transition = 'all 0.3s ease';

        customizeButton.addEventListener('mouseover', function() {
            this.style.background = 'rgba(102, 126, 234, 0.1)';
        });

        customizeButton.addEventListener('mouseout', function() {
            this.style.background = 'transparent';
        });

        customizeButton.addEventListener('click', function() {
            // For now, just open the privacy policy page
            window.location.href = 'privacy-policy.html';
        });

        buttons.appendChild(rejectButton);
        buttons.appendChild(customizeButton);
        buttons.appendChild(acceptButton);

        // Assemble the banner
        banner.appendChild(content);
        banner.appendChild(buttons);

        // Add banner to the page
        document.body.appendChild(banner);
    }
});
