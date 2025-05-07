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
        banner.style.padding = '15px';
        banner.style.background = 'rgba(26, 26, 46, 0.95)';
        banner.style.color = '#fff';
        banner.style.zIndex = '999999';
        banner.style.display = 'flex';
        banner.style.justifyContent = 'space-between';
        banner.style.alignItems = 'center';
        banner.style.flexWrap = 'wrap';
        banner.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.2)';

        // Banner content
        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.marginRight = '20px';
        content.style.minWidth = '300px';

        const title = document.createElement('h3');
        title.textContent = 'We Value Your Privacy';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '1.2rem';
        title.style.color = '#3a9bd9';

        const text = document.createElement('p');
        text.innerHTML = 'We use cookies to enhance your experience, improve our content, and show you personalized ads. Consenting helps us provide a better service and supports our free prize offerings. You can manage your preferences anytime. For more details, visit our <a href="privacy-policy.html" style="color: #3a9bd9; text-decoration: underline;">Privacy Policy</a>.';
        text.style.margin = '0';
        text.style.fontSize = '0.9rem';
        text.style.lineHeight = '1.5';

        content.appendChild(title);
        content.appendChild(text);

        // Buttons container
        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.gap = '10px';
        buttons.style.marginTop = '10px';

        // Do Not Consent button
        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Do Not Consent';
        rejectButton.style.padding = '8px 20px';
        rejectButton.style.background = 'transparent';
        rejectButton.style.color = '#fff';
        rejectButton.style.border = '1px solid #fff';
        rejectButton.style.borderRadius = '4px';
        rejectButton.style.cursor = 'pointer';
        rejectButton.style.transition = 'background 0.3s, color 0.3s';

        rejectButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        rejectButton.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });

        rejectButton.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            banner.remove();
        });

        // Accept button
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Consent';
        acceptButton.style.padding = '8px 20px';
        acceptButton.style.background = '#3a9bd9';
        acceptButton.style.color = '#fff';
        acceptButton.style.border = 'none';
        acceptButton.style.borderRadius = '4px';
        acceptButton.style.cursor = 'pointer';
        acceptButton.style.fontWeight = 'bold';
        acceptButton.style.transition = 'background 0.3s';

        acceptButton.addEventListener('mouseenter', function() {
            this.style.background = '#2980b9';
        });

        acceptButton.addEventListener('mouseleave', function() {
            this.style.background = '#3a9bd9';
        });

        acceptButton.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.remove();
        });

        // Customize button
        const customizeButton = document.createElement('button');
        customizeButton.textContent = 'Manage Options';
        customizeButton.style.padding = '8px 20px';
        customizeButton.style.background = 'transparent';
        customizeButton.style.color = '#fff';
        customizeButton.style.border = '1px solid #fff';
        customizeButton.style.borderRadius = '4px';
        customizeButton.style.cursor = 'pointer';
        customizeButton.style.transition = 'background 0.3s, color 0.3s';

        customizeButton.addEventListener('mouseenter', function() {
            this.style.background = '#fff';
            this.style.color = '#1a1a2e';
        });

        customizeButton.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.color = '#fff';
        });

        customizeButton.addEventListener('click', function() {
            // For now, just open the privacy policy page
            window.location.href = 'privacy-policy.html';
        });

        buttons.appendChild(rejectButton);
        buttons.appendChild(acceptButton);
        buttons.appendChild(customizeButton);

        // Assemble the banner
        banner.appendChild(content);
        banner.appendChild(buttons);

        // Add banner to the page
        document.body.appendChild(banner);
    }
});
