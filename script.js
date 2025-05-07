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

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing QR Hunt...');

    const qrContainer = document.getElementById('qr-container');
    const qrImage = document.getElementById('qr-code');
    const particlesContainer = document.getElementById('particles');
    const scene = document.getElementById('money-qr-scene');

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

    // Function to move QR code to random position with smooth animation
    function moveQR() {
        // Get container dimensions
        const containerWidth = 250; // Width of QR container
        const containerHeight = 350; // Approximate height of QR container
\
            setTimeout(() => {
                qrContainer.style.transform = 'scale(1)';
            }, 200);
        }
    });

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
