/**
 * Final Ad Blocker Detection Script for QR Hunt
 * This script detects ad blockers and only allows dismissal when they're actually disabled
 */

// Final Ad Blocker Detector
const finalAdBlockDetector = {
    // State variables
    adBlockDetected: false,
    overlayCreated: false,

    // Initialize the detector
    init: function() {
        console.log("Initializing final ad blocker detector...");

        // Don't clear existing flags - this allows users who have legitimately disabled
        // their ad blockers to not see the message again

        // Create test elements for detection
        this.createTestElements();

        // Wait a moment then check if ad blocker is active
        setTimeout(() => {
            this.adBlockDetected = this.detectAdBlocker();

            if (this.adBlockDetected && !localStorage.getItem('adBlockerMessageDismissed')) {
                console.log("Ad blocker detected");
                this.showAdBlockerMessage();
            } else {
                console.log("No ad blocker detected or message previously dismissed");
                // If no ad blocker is detected now, mark as verified
                if (!this.adBlockDetected) {
                    localStorage.setItem('adBlockerVerifiedDisabled', 'true');
                    localStorage.setItem('adBlockerMessageDismissed', 'true');
                }
            }

            // Clean up test elements
            this.cleanupTestElements();
        }, 300);
    },

    // Create test elements for detection
    createTestElements: function() {
        // Create test elements with different ad-related class names
        const testClasses = [
            'adsbox', 'ad-banner', 'ad-container', 'adsbygoogle',
            'ad-slot', 'ad-wrapper', 'banner-ad', 'google-ad',
            'advert', 'advertisement', 'advertising', 'ad-unit'
        ];

        for (let i = 0; i < testClasses.length; i++) {
            const testEl = document.createElement('div');
            testEl.innerHTML = '&nbsp;';
            testEl.className = testClasses[i];
            testEl.id = 'ad-test-element-' + i;
            testEl.style.position = 'absolute';
            testEl.style.fontSize = '1px';
            testEl.style.top = '-10px';
            testEl.style.height = '1px';
            testEl.style.width = '1px';
            testEl.style.opacity = '0';
            document.body.appendChild(testEl);
        }

        // Create a more visible ad-like element
        const visibleAd = document.createElement('div');
        visibleAd.innerHTML = 'Advertisement';
        visibleAd.className = 'ad_unit adsbox';
        visibleAd.id = 'ad-test-visible';
        visibleAd.style.position = 'absolute';
        visibleAd.style.top = '-1000px';
        visibleAd.style.left = '-1000px';
        visibleAd.style.width = '300px';
        visibleAd.style.height = '250px';
        visibleAd.style.backgroundColor = '#f8f8f8';
        visibleAd.style.border = '1px solid #ccc';
        visibleAd.style.zIndex = '-1';
        document.body.appendChild(visibleAd);

        // Create a fake AdSense element
        const fakeAdSense = document.createElement('ins');
        fakeAdSense.className = 'adsbygoogle';
        fakeAdSense.id = 'ad-test-adsense';
        fakeAdSense.style.position = 'absolute';
        fakeAdSense.style.top = '-1000px';
        fakeAdSense.style.left = '-1000px';
        fakeAdSense.style.width = '300px';
        fakeAdSense.style.height = '250px';
        fakeAdSense.style.display = 'block';
        fakeAdSense.setAttribute('data-ad-client', 'ca-pub-5468169357445383');
        fakeAdSense.setAttribute('data-ad-slot', '9716086761');
        document.body.appendChild(fakeAdSense);
    },

    // Detect if ad blocker is active
    detectAdBlocker: function() {
        let adBlockerDetected = false;

        // Check test elements
        for (let i = 0; i < 12; i++) {
            const testEl = document.getElementById('ad-test-element-' + i);
            if (!testEl ||
                testEl.offsetHeight === 0 ||
                testEl.clientHeight === 0 ||
                getComputedStyle(testEl).display === 'none') {
                adBlockerDetected = true;
                break;
            }
        }

        // Check visible ad element
        const visibleAd = document.getElementById('ad-test-visible');
        if (!visibleAd ||
            visibleAd.offsetHeight === 0 ||
            visibleAd.clientHeight === 0 ||
            getComputedStyle(visibleAd).display === 'none') {
            adBlockerDetected = true;
        }

        // Check fake AdSense element
        const fakeAdSense = document.getElementById('ad-test-adsense');
        if (!fakeAdSense ||
            fakeAdSense.offsetHeight === 0 ||
            fakeAdSense.clientHeight === 0 ||
            getComputedStyle(fakeAdSense).display === 'none') {
            adBlockerDetected = true;
        }

        // Check if AdSense is defined - this is the most reliable check
        if (typeof adsbygoogle === 'undefined') {
            adBlockerDetected = true;
        } else {
            // If AdSense is defined, it's a strong indicator that ad blocker is off
            // This check should override other checks
            return false;
        }

        return adBlockerDetected;
    },

    // More lenient ad blocker detection for verification after user claims to have disabled it
    lenientDetectAdBlocker: function() {
        // Only check if AdSense is defined and if at least one test element is visible
        let allTestsBlocked = true;

        // Check if at least one test element is visible
        for (let i = 0; i < 12; i++) {
            const testEl = document.getElementById('ad-test-element-' + i);
            if (testEl &&
                testEl.offsetHeight > 0 &&
                testEl.clientHeight > 0 &&
                getComputedStyle(testEl).display !== 'none') {
                allTestsBlocked = false;
                break;
            }
        }

        // Check visible ad element as a backup
        const visibleAd = document.getElementById('ad-test-visible');
        if (visibleAd &&
            visibleAd.offsetHeight > 0 &&
            visibleAd.clientHeight > 0 &&
            getComputedStyle(visibleAd).display !== 'none') {
            allTestsBlocked = false;
        }

        // If AdSense is defined, that's a good sign
        if (typeof adsbygoogle !== 'undefined') {
            return false;
        }

        // If all tests are blocked and AdSense is undefined, ad blocker is likely still active
        return allTestsBlocked;
    },

    // Clean up test elements
    cleanupTestElements: function() {
        for (let i = 0; i < 12; i++) {
            const testEl = document.getElementById('ad-test-element-' + i);
            if (testEl) document.body.removeChild(testEl);
        }

        const visibleAd = document.getElementById('ad-test-visible');
        if (visibleAd) document.body.removeChild(visibleAd);

        const fakeAdSense = document.getElementById('ad-test-adsense');
        if (fakeAdSense) document.body.removeChild(fakeAdSense);
    },

    // Show ad blocker message
    showAdBlockerMessage: function() {
        // Only create the overlay once and respect previous dismissal
        if (this.overlayCreated || localStorage.getItem('adBlockerMessageDismissed') === 'true') return;
        this.overlayCreated = true;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'adblock-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // Create content
        const content = document.createElement('div');
        content.style.backgroundColor = 'rgba(30, 30, 40, 0.95)';
        content.style.borderRadius = '15px';
        content.style.padding = '30px';
        content.style.maxWidth = '500px';
        content.style.width = '90%';
        content.style.textAlign = 'center';
        content.style.boxShadow = '0 0 30px rgba(103, 126, 234, 0.5)';

        // Create title
        const title = document.createElement('h2');
        title.textContent = "Ad Blocker Detected";
        title.style.color = '#fff';
        title.style.fontSize = '1.8rem';
        title.style.marginBottom = '15px';

        // Create message
        const message = document.createElement('p');
        message.textContent = "QR Hunt relies on advertising revenue to provide free prizes. You must disable your ad blocker to play the game and win prizes.";
        message.style.color = '#fff';
        message.style.fontSize = '1.1rem';
        message.style.marginBottom = '25px';
        message.style.lineHeight = '1.5';

        // Create buttons container
        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.flexDirection = 'column';
        buttons.style.gap = '10px';

        // Create "I've disabled my ad blocker" button
        const disabledButton = document.createElement('button');
        disabledButton.textContent = "I've Disabled My Ad Blocker";
        disabledButton.style.backgroundColor = '#4CAF50';
        disabledButton.style.color = '#fff';
        disabledButton.style.border = 'none';
        disabledButton.style.borderRadius = '30px';
        disabledButton.style.padding = '12px 25px';
        disabledButton.style.fontSize = '1.1rem';
        disabledButton.style.fontWeight = 'bold';
        disabledButton.style.cursor = 'pointer';
        disabledButton.style.marginBottom = '10px';

        disabledButton.addEventListener('click', () => {
            // Show loading message
            const loadingMsg = document.createElement('p');
            loadingMsg.textContent = "Verifying... Please wait";
            loadingMsg.style.color = '#f9c74f';
            loadingMsg.style.fontWeight = 'bold';
            loadingMsg.style.marginTop = '10px';

            // Remove any existing messages
            const existingMsg = content.querySelector('.verification-message');
            if (existingMsg) {
                content.removeChild(existingMsg);
            }

            // Add class for easy identification
            loadingMsg.className = 'verification-message';
            content.appendChild(loadingMsg);

            // Give more time for AdSense to load after ad blocker is disabled
            setTimeout(() => {
                // Force reload AdSense script to ensure it loads after ad blocker is disabled
                const adScript = document.createElement('script');
                adScript.async = true;
                adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5468169357445383";
                adScript.crossOrigin = "anonymous";
                document.head.appendChild(adScript);

                // Wait a bit more for the script to load
                setTimeout(() => {
                    // Check if AdSense is defined - this is the most reliable check
                    if (typeof adsbygoogle !== 'undefined') {
                        // Ad blocker is truly disabled, dismiss the message
                        localStorage.setItem('adBlockerMessageDismissed', 'true');
                        localStorage.setItem('adBlockerVerifiedDisabled', 'true');
                        document.body.removeChild(overlay);

                        // Update debug info
                        const debugInfo = document.getElementById('ad-debug-info');
                        if (debugInfo) {
                            debugInfo.textContent = 'Ad display enabled - thank you for supporting QR Hunt';
                            debugInfo.style.color = '#4CAF50';
                        }
                    } else {
                        // Try one more time with a more lenient check
                        const lenientCheck = finalAdBlockDetector.lenientDetectAdBlocker();

                        if (!lenientCheck) {
                            // Lenient check passed, dismiss the message
                            localStorage.setItem('adBlockerMessageDismissed', 'true');
                            localStorage.setItem('adBlockerVerifiedDisabled', 'true');
                            document.body.removeChild(overlay);

                            // Update debug info
                            const debugInfo = document.getElementById('ad-debug-info');
                            if (debugInfo) {
                                debugInfo.textContent = 'Ad display enabled - thank you for supporting QR Hunt';
                                debugInfo.style.color = '#4CAF50';
                            }
                        } else {
                            // Ad blocker still seems to be active, but let's give the user the benefit of the doubt
                            loadingMsg.textContent = "We're having trouble verifying that your ad blocker is disabled. Would you like to proceed anyway?";
                            loadingMsg.style.color = '#f9c74f';

                            // Add proceed anyway button
                            const proceedButton = document.createElement('button');
                            proceedButton.textContent = "Yes, I've disabled my ad blocker";
                            proceedButton.style.backgroundColor = '#4CAF50';
                            proceedButton.style.color = '#fff';
                            proceedButton.style.border = 'none';
                            proceedButton.style.borderRadius = '30px';
                            proceedButton.style.padding = '8px 15px';
                            proceedButton.style.fontSize = '0.9rem';
                            proceedButton.style.fontWeight = 'bold';
                            proceedButton.style.cursor = 'pointer';
                            proceedButton.style.marginTop = '10px';

                            proceedButton.addEventListener('click', () => {
                                // Trust the user and dismiss
                                localStorage.setItem('adBlockerMessageDismissed', 'true');
                                localStorage.setItem('adBlockerVerifiedDisabled', 'true');
                                document.body.removeChild(overlay);

                                // Update debug info
                                const debugInfo = document.getElementById('ad-debug-info');
                                if (debugInfo) {
                                    debugInfo.textContent = 'Ad display enabled - thank you for supporting QR Hunt';
                                    debugInfo.style.color = '#4CAF50';
                                }
                            });

                            // Add button to the message
                            loadingMsg.appendChild(document.createElement('br'));
                            loadingMsg.appendChild(document.createElement('br'));
                            loadingMsg.appendChild(proceedButton);
                        }
                    }
                }, 1500);
            }, 1000);
        }
        });

        // Create "Refresh Page" button
        const refreshButton = document.createElement('button');
        refreshButton.textContent = "Refresh Page";
        refreshButton.style.backgroundColor = '#3a9bd9';
        refreshButton.style.color = '#fff';
        refreshButton.style.border = 'none';
        refreshButton.style.borderRadius = '30px';
        refreshButton.style.padding = '12px 25px';
        refreshButton.style.fontSize = '1.1rem';
        refreshButton.style.fontWeight = 'bold';
        refreshButton.style.cursor = 'pointer';

        refreshButton.addEventListener('click', () => {
            window.location.reload();
        });

        // Assemble the overlay
        buttons.appendChild(disabledButton);
        buttons.appendChild(refreshButton);
        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(buttons);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
};

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if the user has previously dismissed the message
    if (localStorage.getItem('adBlockerMessageDismissed') === 'true') {
        console.log("Ad blocker message previously dismissed, skipping strict detection");

        // Update debug info
        setTimeout(function() {
            const debugInfo = document.getElementById('ad-debug-info');
            if (debugInfo) {
                debugInfo.textContent = 'Ad display enabled - thank you for supporting QR Hunt';
                debugInfo.style.color = '#4CAF50';
            }
        }, 1000);

        // Still create test elements for potential future checks
        finalAdBlockDetector.createTestElements();

        // But don't show the message
        return;
    }

    // Otherwise, proceed with normal initialization
    finalAdBlockDetector.init();
});
