// Ad landing page URL - 95% chance of getting this
// We'll use a simplified ad landing page with Google AdSense
const adLandingPage = "ad-landing-simple.html";

// Prize URLs - 5% chance of getting these
const prizeUrls = [
    "prizes/grand-prize.html", // Grand prize page
    "prizes/discount-code.html", // Discount code page
    "prizes/free-trial.html", // Free trial page
    "prizes/digital-gift.html", // Digital gift page
    "prizes/sweepstakes-entry.html" // Sweepstakes entry page
];

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
    const timestampCode = timestampAndChecksum.slice(0, 4);

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

        // Create additional QR containers for mobile
        createAdditionalQRContainers();
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

    // Function to create additional QR containers for mobile view
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

    // Function to change QR code for mobile containers
    function changeQRForMobile(container, imgElement) {
        // Fade out
        imgElement.style.transition = 'opacity 0.5s ease-out';
        imgElement.style.opacity = 0;

        setTimeout(() => {
            // Determine if this is a prize (5% chance) or ad (95% chance)
            const isPrize = Math.random() < 0.05;

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
    }

    // Function to move QR code to random position with smooth animation
    function moveQR() {
        // Skip if we're on mobile
        if (isMobile) return;

        // Get container dimensions
        const containerWidth = 250; // Width of QR container
        const containerHeight = 350; // Approximate height of QR container

        // Calculate safe boundaries
        const maxX = window.innerWidth - containerWidth;
        const maxY = window.innerHeight - containerHeight - 60;
        const minY = 100; // Keep some distance from the top

        // Avoid center area where text is
        let randomX, randomY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Keep trying until we get a position that's not in the center
        do {
            randomX = Math.floor(Math.random() * maxX);
            randomY = Math.floor(Math.random() * (maxY - minY)) + minY;
        } while (
            Math.abs(randomX - centerX) < 200 &&
            Math.abs(randomY - centerY) < 200
        );

        // Apply easing for smoother animation
        qrContainer.style.transition = 'all 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
        qrContainer.style.left = `${randomX}px`;
        qrContainer.style.top = `${randomY}px`;
    }

    // Function to change QR code with fade effect
    function changeQR() {
        // Fade out
        qrImage.style.transition = 'opacity 0.5s ease-out';
        qrImage.style.opacity = 0;

        setTimeout(() => {
            // Determine if this is a prize (5% chance) or ad (95% chance)
            const isPrize = Math.random() < 0.05;

            let currentUrl;
            if (isPrize) {
                // It's a prize! Select a random prize URL
                const prizeIndex = Math.floor(Math.random() * prizeUrls.length);
                currentUrl = prizeUrls[prizeIndex];
                console.log("Prize QR generated!");

                // Generate a unique prize code
                const prizeCode = generatePrizeCode();

                // Store the prize code in the QR container's dataset
                qrContainer.dataset.prizeCode = prizeCode;

                // Store the prize in localStorage for reference
                storePrizeWin(prizeCode, prizeUrls[prizeIndex]);

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
        message.style.marginBottom = '20px';

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
            window.open('claim-prize.html', '_blank');
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

    // Initial QR code and position
    changeQR();
    moveQR();

    // Change QR code every 3 seconds
    setInterval(changeQR, 3000);

    // Move QR code continuously every 4 seconds
    setInterval(moveQR, 4000);

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
    function storePrizeWin(prizeCode, prizeUrl) {
        // Get existing prize wins or initialize empty array
        let prizeWins = JSON.parse(localStorage.getItem('prizeWins') || '[]');

        // Add new prize win with timestamp
        prizeWins.push({
            prizeCode: prizeCode,
            prizeUrl: prizeUrl,
            timestamp: new Date().toISOString(),
            claimed: false
        });

        // Save back to localStorage
        localStorage.setItem('prizeWins', JSON.stringify(prizeWins));
    }

    // Function to setup psychological engagement elements
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

                // Update the prizes left with a random number (creating scarcity)
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

        // Update scan stats randomly
        const scanStatsEl = document.getElementById('scan-stats');

        function updateScanStats() {
            const scans = Math.floor(Math.random() * 400) + 200; // 200-600 scans
            scanStatsEl.textContent = `${scans} people scanned in the last hour`;

            // Update every 30-60 seconds
            const nextUpdate = Math.floor(Math.random() * 30000) + 30000;
            setTimeout(updateScanStats, nextUpdate);
        }

        // Start updating scan stats
        updateScanStats();

        // Update winner ticker with random names and prizes
        const firstNames = ['John', 'Maria', 'Alex', 'Sarah', 'David', 'Emma', 'Michael', 'Olivia', 'James', 'Sophia'];
        const lastInitials = ['S', 'T', 'M', 'R', 'J', 'K', 'L', 'B', 'W', 'P'];
        const prizes = [
            '$5 Amazon card',
            'free movie ticket',
            '$10 gift card',
            'premium subscription',
            'discount code',
            'digital album',
            'ebook download',
            'sweepstakes entry'
        ];

        const winnerTickerEl = document.getElementById('winner-ticker');
        const winnerP1 = winnerTickerEl.children[0];
        const winnerP2 = winnerTickerEl.children[1];

        function updateWinnerTicker() {
            // Generate random winner and prize
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
            const prize = prizes[Math.floor(Math.random() * prizes.length)];

            // Update the ticker that's currently not visible
            if (winnerP1.offsetTop < 0) {
                winnerP1.textContent = `${firstName} ${lastInitial}. just won ${prize}!`;
            } else {
                winnerP2.textContent = `${firstName} ${lastInitial}. just won ${prize}!`;
            }

            // Update approximately every 20 seconds (between 18-22 seconds)
            const nextUpdate = Math.floor(Math.random() * 4000) + 18000;
            setTimeout(updateWinnerTicker, nextUpdate);
        }

        // Start updating winner ticker
        setTimeout(updateWinnerTicker, 2500); // Start after first animation cycle
    }
});
