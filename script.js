// Ad landing page URL - 97% chance of getting this
// We'll use a simplified ad landing page with Google AdSense
const adLandingPage = "ad-landing-simple.html";

// Prize URLs - 3% chance of getting these
// We now use the prize-tiers.js system for more granular control
// This array is kept for backward compatibility
const prizeUrls = [
    "prizes/grand-prize.html", // Grand prize page
    "prizes/discount-code.html", // Discount code page
    "prizes/free-trial.html", // Free trial page
    "prizes/digital-gift.html", // Digital gift page
    "prizes/sweepstakes-entry.html" // Sweepstakes entry page
];

// The prize tiers system is loaded in the HTML file
// See the <script src="prize-tiers.js"></script> tag in index.html

// Function to generate a unique prize code with checksum
function generatePrizeCode() {
    // Generate a random 8-character code
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Add timestamp to make it unique
    const timestamp = new Date().getTime();
    const timestampCode = timestamp.toString(36).slice(-4);

    // Add a simple checksum (sum of character codes modulo 36 converted to base36)
    let sum = 0;
    for (let i = 0; i < code.length; i++) {
        sum += code.charCodeAt(i);
    }
    sum += timestamp % 1000; // Add part of timestamp to the checksum
    const checksum = sum % 36;
    const checksumChar = checksum.toString(36).toUpperCase();

    return `QR-${code}-${timestampCode}${checksumChar}`;
}

// Function to validate a prize code
function validatePrizeCode(code) {
    // Check basic format
    const regex = /^QR-[A-Z0-9]{8}-[A-Z0-9]{5}$/;
    if (!regex.test(code)) {
        return false;
    }

    // Extract parts
    const parts = code.split('-');
    const mainCode = parts[1];
    const timestampAndChecksum = parts[2];
    const checksumChar = timestampAndChecksum.charAt(4);
    // We don't need to use timestampCode, but we extract it for completeness
    // const timestampCode = timestampAndChecksum.slice(0, 4);

    // Calculate checksum
    let sum = 0;
    for (let i = 0; i < mainCode.length; i++) {
        sum += mainCode.charCodeAt(i);
    }

    // We don't have the exact timestamp, but we can check if the checksum is valid
    // for some reasonable range of timestamp values
    // This is a simplified check that at least verifies the format and main code checksum
    const possibleChecksums = [];
    for (let i = 0; i < 100; i++) {
        const possibleSum = sum + i;
        const possibleChecksum = possibleSum % 36;
        possibleChecksums.push(possibleChecksum.toString(36).toUpperCase());
    }

    return possibleChecksums.includes(checksumChar);
}

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing QR Hunt...');

    const qrContainer = document.getElementById('qr-container');
    const qrImage = document.getElementById('qr-code');
    const particlesContainer = document.getElementById('particles');
    const scene = document.getElementById('money-qr-scene');

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    // Create a container for mobile QR codes if on mobile
    let mobileContainer;
    if (isMobile) {
        mobileContainer = document.createElement('div');
        mobileContainer.id = 'game-container';
        mobileContainer.className = 'mobile-qr-layout';
        document.body.appendChild(mobileContainer);

        // Move the QR container to the mobile container
        mobileContainer.appendChild(qrContainer);

        // We're no longer creating additional QR containers
        // createAdditionalQRContainers();
    }

    // Create floating particles background
    createParticles();

    // Setup confetti and money effects with steady rate
    setupConfettiAndMoney();

    // Setup psychological engagement elements
    setupEngagementElements();

    // Function to create floating particles
    function createParticles() {
        // Add keyframes for floating animation
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes float {
                0% { transform: translateY(0) translateX(0); }
                25% { transform: translateY(-20px) translateX(10px); }
                50% { transform: translateY(0) translateX(20px); }
                75% { transform: translateY(20px) translateX(10px); }
                100% { transform: translateY(0) translateX(0); }
            }
        `;
        document.head.appendChild(styleSheet);

        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random size between 5px and 20px
            const size = Math.floor(Math.random() * 15) + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random position
            const posX = Math.floor(Math.random() * 100);
            const posY = Math.floor(Math.random() * 100);
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;

            // Random opacity
            const opacity = (Math.random() * 0.5) + 0.1;
            particle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;

            // Random animation delay
            const delay = Math.random() * 15;
            particle.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(particle);
        }
    }

    /*
    // Function to create additional QR containers for mobile view - DISABLED
    function createAdditionalQRContainers() {
        // Create 2 additional QR containers for mobile
        for (let i = 0; i < 2; i++) {
            const newContainer = document.createElement('div');
            newContainer.id = `qr-container-${i+1}`;
            newContainer.className = 'qr-container';
            newContainer.style.width = '160px';
            newContainer.style.padding = '10px';
            newContainer.style.backgroundColor = 'rgba(30, 30, 40, 0.85)';
            newContainer.style.borderRadius = '15px';
            newContainer.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            newContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
            newContainer.style.backdropFilter = 'blur(5px)';
            newContainer.style.cursor = 'pointer';

            // Create QR wrapper
            const qrWrapper = document.createElement('div');
            qrWrapper.className = 'qr-wrapper';
            qrWrapper.style.position = 'relative';
            qrWrapper.style.margin = '5px auto';
            qrWrapper.style.width = '110px';
            qrWrapper.style.height = '110px';
            qrWrapper.style.overflow = 'hidden';
            qrWrapper.style.borderRadius = '10px';
            qrWrapper.style.background = 'white';
            qrWrapper.style.padding = '6px';
            qrWrapper.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            qrWrapper.style.transition = 'transform 0.3s ease';

            // Create QR image
            const qrImg = document.createElement('img');
            qrImg.id = `qr-code-${i+1}`;
            qrImg.style.width = '110px';
            qrImg.style.height = '110px';
            qrImg.style.borderRadius = '10px';
            qrImg.style.background = 'white';

            // Create urgency banner
            const urgencyBanner = document.createElement('div');
            urgencyBanner.className = 'urgency-banner';
            urgencyBanner.style.backgroundColor = 'rgba(60, 60, 80, 0.8)';
            urgencyBanner.style.color = 'white';
            urgencyBanner.style.padding = '8px';
            urgencyBanner.style.borderRadius = '8px';
            urgencyBanner.style.marginBottom = '10px';
            urgencyBanner.style.textAlign = 'center';
            urgencyBanner.style.fontWeight = '500';
            urgencyBanner.style.display = 'flex';
            urgencyBanner.style.flexDirection = 'column';
            urgencyBanner.style.gap = '5px';
            urgencyBanner.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            urgencyBanner.style.fontSize = '0.8rem';

            const countdownSpan = document.createElement('span');
            countdownSpan.id = `countdown-timer-${i+1}`;
            countdownSpan.className = 'countdown';
            countdownSpan.textContent = 'Prize changes soon!';
            countdownSpan.style.color = '#e6e6fa';
            countdownSpan.style.fontSize = '0.8rem';

            urgencyBanner.appendChild(countdownSpan);

            // Assemble the container
            qrWrapper.appendChild(qrImg);
            newContainer.appendChild(urgencyBanner);
            newContainer.appendChild(qrWrapper);

            // Add click handler
            newContainer.addEventListener('click', function() {
                const url = this.dataset.url;
                const prizeCode = this.dataset.prizeCode;

                if (url) {
                    // Check if this is a prize QR code
                    if (prizeCode) {
                        // Show prize win modal with the code
                        showPrizeWinModal(prizeCode);
                    } else {
                        // Regular ad QR code - open the URL in a new tab
                        window.open(url, '_blank');
                    }

                    // Add a visual feedback for the click
                    this.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                }
            });

            // Add to mobile container
            mobileContainer.appendChild(newContainer);

            // Initialize QR code
            changeQRForMobile(newContainer, qrImg);

            // Set up interval to change QR code
            setInterval(() => {
                changeQRForMobile(newContainer, qrImg);
            }, 5000 + (i * 1000)); // Stagger the intervals
        }
    }

    */

    // Function to change QR code for mobile containers - DISABLED
    /* function changeQRForMobile(container, imgElement) {
        // Fade out
        imgElement.style.transition = 'opacity 0.5s ease-out';
        imgElement.style.opacity = 0;

        setTimeout(() => {
            // Determine if this is a prize (3% chance) or ad (97% chance)
            const isPrize = Math.random() < 0.03;

            let currentUrl;
            if (isPrize) {
                // It's a prize! Select a random prize URL
                const prizeIndex = Math.floor(Math.random() * prizeUrls.length);
                currentUrl = prizeUrls[prizeIndex];
                console.log("Prize QR generated!");

                // Generate a unique prize code
                const prizeCode = generatePrizeCode();

                // Store the prize code in the container's dataset
                container.dataset.prizeCode = prizeCode;

                // Store the prize in localStorage for reference
                storePrizeWin(prizeCode, prizeUrls[prizeIndex]);

                // Add a special class to indicate it's a prize QR code
                container.classList.add('prize-qr');

                // Remove the class after a short delay to reset the effect
                setTimeout(() => {
                    container.classList.remove('prize-qr');
                }, 300);
            } else {
                // It's an ad. Use our ad landing page with AdSense
                currentUrl = adLandingPage;

                // Remove prize class if it exists
                container.classList.remove('prize-qr');
            }

            // Generate QR code
            const data = encodeURIComponent(currentUrl);
            imgElement.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;

            // Store the current URL as a data attribute for click handling
            container.dataset.url = currentUrl;

            // Fade in
            imgElement.style.opacity = 1;
        }, 500);
    } */

    // Function to move QR code to random position with smooth animation
    function moveQR() {
        // Skip if we're on mobile
        if (isMobile) return;

        // For desktop, we'll use a more subtle animation that doesn't move the QR code too far
        // This creates a floating effect rather than jumping around the screen

        // Get the current position
        const currentLeft = parseInt(qrContainer.style.left) || window.innerWidth / 2 - 125;
        const currentTop = parseInt(qrContainer.style.top) || window.innerHeight / 2 - 175;

        // Get the h1 element position to ensure we stay below it
        const h1Element = document.querySelector('h1');
        let minY = 100; // Default minimum Y position

        if (h1Element) {
            const h1Rect = h1Element.getBoundingClientRect();
            minY = h1Rect.bottom + 20; // Stay at least 20px below the heading
        }

        // Calculate a small random movement (±30px horizontally, ±20px vertically)
        // Less vertical movement to keep it more in the same area below the heading
        const moveX = (Math.random() - 0.5) * 60;
        const moveY = (Math.random() - 0.5) * 40;

        // Calculate new position
        let newX = currentLeft + moveX;
        let newY = currentTop + moveY;

        // Ensure the QR code stays within the viewport
        const containerWidth = 250;
        const containerHeight = 350;
        const maxX = window.innerWidth - containerWidth;
        const maxY = window.innerHeight - containerHeight - 60;
        const minX = 50;

        // Constrain to boundaries
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        // Apply smooth animation
        qrContainer.style.transition = 'all 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
        qrContainer.style.left = `${newX}px`;
        qrContainer.style.top = `${newY}px`;
    }

    // Track QR code generation for enforcing prize rate
    const qrStats = {
        totalGenerated: 0,
        prizesGenerated: 0,
        targetPrizeRate: 0.005, // 0.5% prize rate (99.5% ad rate)

        // Initialize from localStorage if available
        init: function() {
            const savedStats = localStorage.getItem('qrHuntStats');
            if (savedStats) {
                try {
                    const parsed = JSON.parse(savedStats);
                    this.totalGenerated = parsed.totalGenerated || 0;
                    this.prizesGenerated = parsed.prizesGenerated || 0;
                    console.log('Loaded QR stats from localStorage:', this);
                } catch (e) {
                    console.error('Error loading QR stats:', e);
                }
            }
        },

        // Save stats to localStorage
        save: function() {
            localStorage.setItem('qrHuntStats', JSON.stringify({
                totalGenerated: this.totalGenerated,
                prizesGenerated: this.prizesGenerated,
                lastUpdated: new Date().toISOString()
            }));
        },

        // Calculate current prize rate
        getCurrentPrizeRate: function() {
            if (this.totalGenerated === 0) return 0;
            return this.prizesGenerated / this.totalGenerated;
        },

        // Determine if next QR should be a prize based on maintaining target rate
        shouldGeneratePrize: function() {
            // Always increment total
            this.totalGenerated++;

            // If we haven't generated any QRs yet, use random chance
            if (this.totalGenerated <= 10) {
                return Math.random() < this.targetPrizeRate;
            }

            // Calculate current prize rate
            const currentRate = this.getCurrentPrizeRate();

            // If current rate is higher than target, force an ad
            if (currentRate > this.targetPrizeRate) {
                return false;
            }

            // If current rate is much lower than target, increase chance of prize
            if (currentRate < (this.targetPrizeRate * 0.5)) {
                return Math.random() < (this.targetPrizeRate * 1.5);
            }

            // Otherwise use standard random chance
            return Math.random() < this.targetPrizeRate;
        }
    };

    // Function to change QR code with fade effect
    function changeQR() {
        // Fade out
        qrImage.style.transition = 'opacity 0.5s ease-out';
        qrImage.style.opacity = 0;

        setTimeout(() => {
            // Check for active power-ups
            let modifiedQrStats = { ...qrStats };

            // Get current user
            const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');

            if (currentUser && currentUser.loggedIn) {
                // Get full user data from localStorage
                const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
                const user = users.find(u => u.email === currentUser.email);

                if (user && user.activePowerups) {
                    // Apply power-up effects
                    if (typeof window.applyPowerupEffects === 'function') {
                        modifiedQrStats = window.applyPowerupEffects(qrStats);
                        console.log('Applied power-up effects:', modifiedQrStats.targetPrizeRate);
                    } else if (user.activePowerups.winBooster && user.activePowerups.winBooster.remainingUses > 0) {
                        // Fallback if powerups.js is not loaded
                        modifiedQrStats.targetPrizeRate = qrStats.targetPrizeRate * 2;

                        // Decrement remaining uses
                        user.activePowerups.winBooster.remainingUses--;

                        // Remove if used up
                        if (user.activePowerups.winBooster.remainingUses <= 0) {
                            delete user.activePowerups.winBooster;
                        }

                        // Update user in localStorage
                        const userIndex = users.findIndex(u => u.email === currentUser.email);
                        users[userIndex] = user;
                        localStorage.setItem('qrHuntUsers', JSON.stringify(users));
                    }
                }
            }

            // Use the tracking system to determine if this should be a prize
            const isPrize = modifiedQrStats.shouldGeneratePrize();

            // If it's a prize, increment the prize counter
            if (isPrize) {
                qrStats.prizesGenerated++;
            }

            // Save stats to localStorage
            qrStats.save();

            // Log current stats to console for debugging
            console.log(`QR Stats: Total: ${qrStats.totalGenerated}, Prizes: ${qrStats.prizesGenerated}, Rate: ${(qrStats.getCurrentPrizeRate() * 100).toFixed(2)}%`);

            let currentUrl;
            if (isPrize) {
                // It's a prize! Use the prize tiers system to select a prize
                const prize = typeof selectRandomPrize === 'function'
                    ? selectRandomPrize()
                    : { url: prizeUrls[Math.floor(Math.random() * prizeUrls.length)], value: 3.00 };

                currentUrl = prize.url;
                console.log("Prize QR generated! Value: $" + prize.value);

                // Generate a unique prize code
                const prizeCode = generatePrizeCode();

                // Store the prize code in the QR container's dataset
                qrContainer.dataset.prizeCode = prizeCode;

                // Store prize value in dataset
                qrContainer.dataset.prizeValue = prize.value;

                // Store the prize in localStorage with additional details
                storePrizeWin(prizeCode, prize.url, prize.value, prize.tier, prize.name);

                // Add a special class to indicate it's a prize QR code
                qrContainer.classList.add('prize-qr');

                // Remove the class after a short delay to reset the effect
                setTimeout(() => {
                    qrContainer.classList.remove('prize-qr');
                }, 300);
            } else {
                // It's an ad. Use our ad landing page with AdSense
                currentUrl = adLandingPage;

                // Remove prize class if it exists
                qrContainer.classList.remove('prize-qr');
            }

            // Generate QR code
            const data = encodeURIComponent(currentUrl);
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;

            // Store the current URL as a data attribute for click handling
            qrContainer.dataset.url = currentUrl;

            // Fade in
            qrImage.style.opacity = 1;
        }, 500);
    }

    // Make QR code clickable
    qrContainer.addEventListener('click', function() {
        const url = this.dataset.url;
        const prizeCode = this.dataset.prizeCode;

        if (url) {
            // Check if this is a prize QR code
            if (prizeCode) {
                // Show prize win modal with the code
                showPrizeWinModal(prizeCode);
            } else {
                // Regular ad QR code - open the URL in a new tab
                window.open(url, '_blank');
            }

            // Add a visual feedback for the click
            qrContainer.style.transform = 'scale(0.9)';
            setTimeout(() => {
                qrContainer.style.transform = 'scale(1)';
            }, 200);
        }
    });

    // Function to show prize win modal
    function showPrizeWinModal(prizeCode) {
        // Create modal container
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        // Create modal content
        const content = document.createElement('div');
        content.style.backgroundColor = 'rgba(30, 30, 40, 0.95)';
        content.style.borderRadius = '15px';
        content.style.padding = '30px';
        content.style.maxWidth = '90%';
        content.style.width = '400px';
        content.style.textAlign = 'center';
        content.style.boxShadow = '0 0 30px rgba(103, 126, 234, 0.5)';
        content.style.border = '1px solid rgba(255, 255, 255, 0.2)';

        // Add confetti animation to the modal
        content.style.animation = 'prize-pulse 0.5s ease-in-out';

        // Create heading
        const heading = document.createElement('h2');
        heading.textContent = 'Congratulations!';
        heading.style.color = '#fff';
        heading.style.fontSize = '2rem';
        heading.style.marginBottom = '15px';

        // Create message
        const message = document.createElement('p');
        message.textContent = 'You\'ve won a prize! Use this code to claim your reward:';
        message.style.color = '#fff';
        message.style.fontSize = '1.1rem';
        message.style.marginBottom = '10px';

        // Check if user has Extra Time power-up active
        let expirationHours = 6; // Default

        // Get current user
        const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');

        if (currentUser && currentUser.loggedIn) {
            // Get full user data from localStorage
            const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
            const user = users.find(u => u.email === currentUser.email);

            if (user && user.activePowerups && user.activePowerups.extraTime && user.activePowerups.extraTime.remainingUses > 0) {
                expirationHours = 24; // Extended with power-up
            }
        }

        // Create expiration message
        const expirationMessage = document.createElement('p');
        expirationMessage.textContent = `This code expires in ${expirationHours} hours. Claim it now!`;
        expirationMessage.style.color = '#ff5e57';
        expirationMessage.style.fontSize = '0.9rem';
        expirationMessage.style.marginBottom = '20px';
        expirationMessage.style.fontWeight = 'bold';
        expirationMessage.style.animation = 'pulse 2s infinite';

        // Create prize code display
        const codeDisplay = document.createElement('div');
        codeDisplay.textContent = prizeCode;
        codeDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        codeDisplay.style.padding = '15px';
        codeDisplay.style.borderRadius = '8px';
        codeDisplay.style.fontSize = '1.5rem';
        codeDisplay.style.fontWeight = 'bold';
        codeDisplay.style.color = '#f9c74f';
        codeDisplay.style.marginBottom = '25px';
        codeDisplay.style.letterSpacing = '1px';
        codeDisplay.style.border = '1px dashed rgba(249, 199, 79, 0.5)';

        // Create claim button
        const claimButton = document.createElement('button');
        claimButton.textContent = 'Claim Your Prize';
        claimButton.style.backgroundColor = '#667eea';
        claimButton.style.color = '#fff';
        claimButton.style.border = 'none';
        claimButton.style.borderRadius = '30px';
        claimButton.style.padding = '12px 25px';
        claimButton.style.fontSize = '1.1rem';
        claimButton.style.fontWeight = 'bold';
        claimButton.style.cursor = 'pointer';
        claimButton.style.transition = 'all 0.3s ease';
        claimButton.style.marginBottom = '15px';

        claimButton.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.2)';
        });

        claimButton.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        claimButton.addEventListener('click', function() {
            // Check if user is logged in
            const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');

            if (currentUser && currentUser.loggedIn) {
                // User is logged in, redirect to account page with prize code
                window.open(`account.html?claim=${prizeCode}`, '_blank');
            } else {
                // User is not logged in, redirect to login page with redirect to account page
                window.open(`login.html?redirect=account.html&claim=${prizeCode}`, '_blank');
            }

            modal.remove();
        });

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = '#fff';
        closeButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        closeButton.style.borderRadius = '30px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.fontSize = '0.9rem';
        closeButton.style.cursor = 'pointer';
        closeButton.style.transition = 'all 0.3s ease';

        closeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });

        closeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });

        closeButton.addEventListener('click', function() {
            modal.remove();
        });

        // Assemble modal
        content.appendChild(heading);
        content.appendChild(message);
        content.appendChild(expirationMessage);
        content.appendChild(codeDisplay);
        content.appendChild(claimButton);
        content.appendChild(closeButton);
        modal.appendChild(content);

        // Add to document
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Add cursor style to indicate it's clickable
    qrContainer.style.cursor = 'pointer';

    // Initialize QR stats from localStorage
    qrStats.init();

    // Initial QR code and position
    changeQR();

    // Set initial position for desktop
    if (!isMobile) {
        // Position the QR container below the "QR HUNT" heading
        const h1Element = document.querySelector('h1');
        if (h1Element) {
            const h1Rect = h1Element.getBoundingClientRect();
            const qrContainerWidth = 250; // Width of QR container

            // Center horizontally and position below the heading
            qrContainer.style.left = `${window.innerWidth / 2 - qrContainerWidth / 2}px`;
            qrContainer.style.top = `${h1Rect.bottom + 30}px`; // 30px gap below heading

            console.log('Positioned QR code below heading at:', qrContainer.style.top);
        } else {
            // Fallback if h1 not found
            qrContainer.style.left = `${window.innerWidth / 2 - 125}px`;
            qrContainer.style.top = `${window.innerHeight / 2 - 100}px`;
        }
    }

    // Start movement after a short delay
    setTimeout(moveQR, 1000);

    // Handle window resize to keep QR code properly positioned
    window.addEventListener('resize', function() {
        if (!isMobile) {
            // Reposition QR code below heading when window is resized
            const h1Element = document.querySelector('h1');
            if (h1Element) {
                const h1Rect = h1Element.getBoundingClientRect();
                const qrContainerWidth = 250;

                // Center horizontally and position below the heading
                qrContainer.style.transition = 'none'; // Disable transition for immediate repositioning
                qrContainer.style.left = `${window.innerWidth / 2 - qrContainerWidth / 2}px`;
                qrContainer.style.top = `${h1Rect.bottom + 30}px`;

                // Re-enable transition after a short delay
                setTimeout(() => {
                    qrContainer.style.transition = 'all 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
                }, 50);
            }
        }
    });

    // Change QR code less frequently (every 5 seconds instead of 3)
    // This reduces the number of opportunities to win
    setInterval(changeQR, 5000);

    // Move QR code continuously every 6 seconds
    setInterval(moveQR, 6000);

    // Add hover effect to QR code
    qrContainer.addEventListener('mouseenter', function() {
        qrContainer.style.transform = 'scale(1.1)';
        qrContainer.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))';
    });

    qrContainer.addEventListener('mouseleave', function() {
        qrContainer.style.transform = 'scale(1)';
        qrContainer.style.filter = 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))';
    });

    // Function to setup confetti and floating money
    function setupConfettiAndMoney() {
        // Skip heavy animations on mobile
        if (isMobile) {
            // On mobile, just create a few confetti pieces occasionally for a lighter effect
            setInterval(() => {
                // Only 20% chance to create confetti on each interval
                if (Math.random() < 0.2) {
                    const screenWidth = window.innerWidth;
                    const x = Math.random() * screenWidth;
                    createConfettiPiece(x);
                }
            }, 2000);

            return; // Skip money animation on mobile
        }

        // Desktop version - more animations
        // Start confetti drops at a steady rate
        // Create just 2-3 confetti pieces every second
        setInterval(() => {
            const numConfetti = Math.floor(Math.random() * 2) + 2;
            const screenWidth = window.innerWidth;

            for (let i = 0; i < numConfetti; i++) {
                // Calculate position to ensure even distribution
                const x = Math.random() * screenWidth;
                createConfettiPiece(x);
            }
        }, 1000);

        // Start money drops at a steady rate
        // Create just 1-2 money bills every 1.5 seconds
        setInterval(() => {
            const numMoney = Math.floor(Math.random() * 2) + 1;
            const screenWidth = window.innerWidth;

            for (let i = 0; i < numMoney; i++) {
                // Calculate position to ensure even distribution
                const x = Math.random() * screenWidth;
                const y = Math.random() * 50;
                createMoneyBill(x, y);
            }
        }, 1500);
    }

    // Function to create a single confetti piece
    function createConfettiPiece(x) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Start from the top of the screen
        const y = 0;

        // Set CSS variables for positioning
        confetti.style.setProperty('--start-x', `${x}px`);
        confetti.style.setProperty('--start-y', `${y}px`);
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;

        // Add drift for more natural movement
        let driftX = (Math.random() * 200) - 100; // Random drift between -100px and 100px
        confetti.style.setProperty('--drift-x', `${driftX}px`);

        // Random fall duration between 4-8 seconds
        const fallDuration = (Math.random() * 4) + 4;
        confetti.style.setProperty('--fall-duration', `${fallDuration}s`);

        // Random spin duration
        const spinDuration = (Math.random() * 2) + 1;
        confetti.style.setProperty('--spin-duration', `${spinDuration}s`);

        // Random initial rotation
        const rotationAngle = Math.random() * 360;
        confetti.style.setProperty('--rotation-angle', `${rotationAngle}deg`);

        // Create the inner rectangle
        const confettiRect = document.createElement('div');
        confettiRect.classList.add('confetti-rect');

        // Random color - bright and varied colors
        const colors = [
            '#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590',
            '#FF1493', '#00FFFF', '#FFD700', '#7FFF00', '#FF00FF', '#00FF7F', '#FF4500',
            '#1E90FF', '#FFFF00', '#32CD32', '#FF69B4', '#00CED1', '#FF8C00', '#8A2BE2'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        confettiRect.style.backgroundColor = randomColor;

        // Random size for more variety
        const size = Math.floor(Math.random() * 8) + 5; // 5-13px
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        confetti.appendChild(confettiRect);
        scene.appendChild(confetti);

        // Remove confetti after animation completes
        confetti.addEventListener('animationend', function() {
            confetti.remove();
        });
    }

    // Function to create a single money bill
    function createMoneyBill(x, y) {
        const money = document.createElement('div');
        money.classList.add('money-bill');

        // Random money colors for variety
        const moneyColors = ['#85bb65', '#3D9970', '#2ECC40', '#01FF70', '#ADFF2F', '#7CFC00', '#32CD32'];
        const randomMoneyColor = moneyColors[Math.floor(Math.random() * moneyColors.length)];
        money.style.backgroundColor = randomMoneyColor;

        // Random size for more variety
        const width = Math.floor(Math.random() * 20) + 30; // 30-50px
        const height = Math.floor(Math.random() * 10) + 20; // 20-30px
        money.style.width = `${width}px`;
        money.style.height = `${height}px`;

        // Set CSS variables for positioning
        money.style.setProperty('--start-x', `${x}px`);
        money.style.setProperty('--start-y', `${y}px`);
        money.style.left = `${x}px`;
        money.style.top = `${y}px`;

        // Add movement for more natural falling effect
        const moveX = (Math.random() * 200) - 100; // Random horizontal movement
        const moveY = window.innerHeight; // Move down to the bottom of the screen
        money.style.setProperty('--move-x', `${moveX}px`);
        money.style.setProperty('--move-y', `${moveY}px`);

        // Random rotation
        const rotation = Math.random() * 360;
        money.style.setProperty('--rotation', `${rotation}deg`);

        // Random rotation amount
        const rotateAmount = (Math.random() * 180) - 90; // Rotate between -90 and 90 degrees
        money.style.setProperty('--rotate-amount', `${rotateAmount}deg`);

        // Random duration between 4-8 seconds
        const duration = (Math.random() * 4) + 4;
        money.style.setProperty('--float-duration', `${duration}s`);

        scene.appendChild(money);

        // Remove money after animation completes
        money.addEventListener('animationend', function() {
            money.remove();
        });
    }

    // Function to store prize wins in localStorage
    function storePrizeWin(prizeCode, prizeUrl, prizeValue = null, prizeTier = null, prizeName = null) {
        // Get existing prize wins or initialize empty array
        let prizeWins = JSON.parse(localStorage.getItem('prizeWins') || '[]');

        // Check for active power-ups
        let expirationHours = 6; // Default expiration time
        let upgradedTier = prizeTier;
        let upgradedValue = prizeValue;

        // Get current user
        const currentUser = JSON.parse(sessionStorage.getItem('qrHuntCurrentUser') || 'null');

        if (currentUser && currentUser.loggedIn) {
            // Get full user data from localStorage
            const users = JSON.parse(localStorage.getItem('qrHuntUsers') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);

            if (userIndex !== -1) {
                const user = users[userIndex];

                if (user.activePowerups) {
                    // Check for Extra Time power-up
                    if (user.activePowerups.extraTime && user.activePowerups.extraTime.remainingUses > 0) {
                        expirationHours = 24; // Extended expiration time
                        console.log('Applied Extra Time power-up: Extended expiration to 24 hours');

                        // Decrement remaining uses
                        user.activePowerups.extraTime.remainingUses--;

                        // Remove if used up
                        if (user.activePowerups.extraTime.remainingUses <= 0) {
                            delete user.activePowerups.extraTime;
                        }
                    }

                    // Check for Prize Upgrade power-up
                    if (user.activePowerups.prizeUpgrade && user.activePowerups.prizeUpgrade.remainingUses > 0) {
                        // Upgrade the prize tier and value
                        if (prizeTier === 'micro') {
                            upgradedTier = 'small';
                            upgradedValue = 2.00;
                        } else if (prizeTier === 'small') {
                            upgradedTier = 'medium';
                            upgradedValue = 5.00;
                        } else if (prizeTier === 'medium') {
                            upgradedTier = 'grand';
                            upgradedValue = 10.00;
                        } else {
                            // Already at grand tier, increase value by 50%
                            upgradedValue = prizeValue * 1.5;
                        }

                        console.log(`Applied Prize Upgrade power-up: Upgraded from ${prizeTier} ($${prizeValue}) to ${upgradedTier} ($${upgradedValue})`);

                        // Decrement remaining uses
                        user.activePowerups.prizeUpgrade.remainingUses--;

                        // Remove if used up
                        if (user.activePowerups.prizeUpgrade.remainingUses <= 0) {
                            delete user.activePowerups.prizeUpgrade;
                        }
                    }

                    // Update user in localStorage if power-ups were used
                    users[userIndex] = user;
                    localStorage.setItem('qrHuntUsers', JSON.stringify(users));
                }
            }
        }

        // Add new prize win with timestamp and enhanced details
        prizeWins.push({
            prizeCode: prizeCode,
            prizeUrl: prizeUrl,
            timestamp: new Date().toISOString(),
            claimed: false,
            claimedBy: null,
            claimDate: null,
            verified: false,
            status: 'Unclaimed',
            value: upgradedValue || prizeValue || 3.00, // Use upgraded value if available
            tier: upgradedTier || prizeTier || 'standard',
            name: prizeName || 'Prize',
            paymentMethod: null,
            paymentDate: null,
            notes: null,
            expirationDate: new Date(Date.now() + expirationHours * 60 * 60 * 1000).toISOString() // Dynamic expiration time
        });

        // Save back to localStorage
        localStorage.setItem('prizeWins', JSON.stringify(prizeWins));

        // Log prize details for debugging
        console.log(`Prize stored: ${prizeCode}, Value: $${upgradedValue || prizeValue}, Tier: ${upgradedTier || prizeTier}`);
    }

    // Function to setup engagement elements
    function setupEngagementElements() {
        // Countdown timer
        const countdownEl = document.getElementById('countdown-timer');
        let timeLeft = 180; // 3 minutes in seconds

        function updateCountdown() {
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            countdownEl.textContent = `Prize changes in: ${minutes}:${seconds}`;

            if (timeLeft > 0) {
                timeLeft--;
                setTimeout(updateCountdown, 1000);
            } else {
                // Reset timer when it reaches zero
                timeLeft = 180;
                updateCountdown();

                // Update the prizes left with a random number
                const prizesLeftEl = document.getElementById('prizes-left');
                const prizesLeft = Math.floor(Math.random() * 8) + 1; // 1-8 prizes left
                prizesLeftEl.textContent = `${prizesLeft} grand prizes left today!`;

                // Flash the container to draw attention
                qrContainer.classList.add('prize-qr');
                setTimeout(() => {
                    qrContainer.classList.remove('prize-qr');
                }, 300);
            }
        }

        // Start the countdown
        updateCountdown();
    }
});
