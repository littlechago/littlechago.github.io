// QR code data - add your own URLs or data
const qrData = [
    "https://example.com",
    "https://github.com",
    "https://twitter.com",
    "https://linkedin.com",
    "Hello World!"
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

    // Setup confetti and money
    setupEffects();

    // Function to create floating particles
    function createParticles() {
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

            particlesContainer.appendChild(particle);
        }
    }

    // Function to setup confetti and money effects
    function setupEffects() {
        // Create initial batch of effects
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createLeftRightEffects(true); // Force creation
            }, i * 500); // Stagger initial creation
        }

        // Set intervals for continuous effects
        setInterval(createLeftRightEffects, 1000); // More frequent (every 1 second)
    }

    // Function to create effects across the top of the screen
    function createLeftRightEffects(force = false) {
        // 70% chance to create effects (reduced by 30%) unless forced
        if (!force && Math.random() > 0.7) return;

        // Create confetti across the top
        const screenWidth = window.innerWidth;
        const numConfetti = force ? 12 : 8; // More confetti when forced

        // Distribute confetti evenly across the screen width
        for (let i = 0; i < numConfetti; i++) {
            const x = (screenWidth / numConfetti) * i + (Math.random() * (screenWidth / numConfetti));
            createConfettiAt(x, 0);
        }

        // Create money across the top (fewer than confetti)
        const numMoney = force ? 8 : 4; // More money when forced

        // Distribute money evenly across the screen width
        for (let i = 0; i < numMoney; i++) {
            const x = (screenWidth / numMoney) * i + (Math.random() * (screenWidth / numMoney));
            const y = Math.random() * 50; // Slight variation in starting height
            createMoneyAt(x, y);
        }
    }

    // Function to create confetti at specific position
    function createConfettiAt(x, y) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Set position directly
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;

        // Random color
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = randomColor;

        // Random size
        const size = Math.floor(Math.random() * 10) + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        // Random animation duration (3-7 seconds)
        const duration = (Math.random() * 4) + 3;
        confetti.style.animationDuration = `${duration}s`;

        // Random horizontal drift as it falls
        const drift = (Math.random() * 100) - 50; // -50px to +50px
        confetti.style.setProperty('--drift-x', `${drift}px`);

        // Random rotation
        const rotation = Math.random() * 360;
        confetti.style.setProperty('--rotation', `${rotation}deg`);

        // Add to scene
        scene.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000 + 100); // Add a little buffer
    }

    // Function to create money at specific position
    function createMoneyAt(x, y) {
        const money = document.createElement('div');
        money.classList.add('money-bill');

        // Set position directly
        money.style.left = `${x}px`;
        money.style.top = `${y}px`;

        // Add $ symbol
        money.textContent = "$";

        // Random rotation
        const rotation = (Math.random() * 40) - 20; // -20 to +20 degrees
        money.style.transform = `rotate(${rotation}deg)`;

        // Add to scene
        scene.appendChild(money);

        // Animate with JavaScript for more control
        let opacity = 0;
        let moveX = 0;
        let moveY = 0;

        // Random parameters for more natural movement
        const maxMove = 150 + (Math.random() * 100); // 150-250px
        const fallSpeed = 0.5 + (Math.random() * 1); // 0.5-1.5px per frame
        const driftDirection = Math.random() > 0.5 ? 1 : -1;
        const driftSpeed = (Math.random() * 0.5) + 0.1; // 0.1-0.6px per frame
        const rotationSpeed = (Math.random() * 0.2) - 0.1; // -0.1 to +0.1 degrees per frame
        const duration = 5000 + (Math.random() * 3000); // 5-8 seconds
        const startTime = Date.now();

        // Animation interval
        const interval = setInterval(() => {
            // Calculate elapsed time
            const elapsed = Date.now() - startTime;

            // Fade in/out based on elapsed time
            if (elapsed < 500) {
                // Fade in during first 500ms
                opacity = elapsed / 500 * 0.8;
            } else if (elapsed > duration - 500) {
                // Fade out during last 500ms
                opacity = 0.8 * (1 - (elapsed - (duration - 500)) / 500);
            } else {
                // Stay at 0.8 opacity
                opacity = 0.8;
            }

            // Move
            moveY += fallSpeed; // Fall downward
            moveX += driftDirection * driftSpeed; // Drift sideways

            // Apply changes
            money.style.opacity = opacity;
            money.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation + (rotationSpeed * elapsed)}deg)`;

            // Remove when animation is complete
            if (elapsed >= duration) {
                clearInterval(interval);
                money.remove();
            }
        }, 16); // ~60fps
    }

    // Function to move QR code to random position
    function moveQR() {
        const maxX = window.innerWidth - 170;
        const maxY = window.innerHeight - 170;

        // Avoid center area where text is
        let randomX, randomY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        do {
            randomX = Math.floor(Math.random() * maxX);
            randomY = Math.floor(Math.random() * maxY);
        } while (
            Math.abs(randomX - centerX) < 200 &&
            Math.abs(randomY - centerY) < 200
        );

        qrContainer.style.transition = 'all 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
        qrContainer.style.left = `${randomX}px`;
        qrContainer.style.top = `${randomY}px`;
    }

    // Function to change QR code
    function changeQR() {
        qrImage.style.transition = 'opacity 0.5s ease-out';
        qrImage.style.opacity = 0;

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * qrData.length);
            const data = encodeURIComponent(qrData[randomIndex]);
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
            qrImage.style.opacity = 1;
        }, 500);
    }

    // Initial QR code and position
    changeQR();
    moveQR();

    // Change QR code every 8 seconds
    setInterval(changeQR, 8000);

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
});
