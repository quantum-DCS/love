document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sceneGift = document.getElementById('scene-gift');
    const sceneCalendar = document.getElementById('scene-calendar');
    const sceneTree = document.getElementById('scene-tree');

    const giftBox = document.getElementById('giftBox');

    const calMonth = document.getElementById('calMonth');
    const calDay = document.getElementById('calDay');

    const timerDisplay = document.getElementById('timer');
    const bgMusic = document.getElementById('bgMusic');

    // Constants
    const START_DATE = new Date('2025-01-20T00:00:00');
    const END_DATE = new Date('2025-12-25T00:00:00'); // Target for calendar animation
    const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    // State
    let isMusicPlaying = false;

    // --- Snow Effect ---
    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 + 1;
            this.size = Math.random() * 3 + 1;
            this.alpha = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initSnow() {
        resize();
        window.addEventListener('resize', resize);
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
        animateSnow();
    }

    function animateSnow() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateSnow);
    }

    // --- Logic ---

    // 1. Gift Interaction
    giftBox.addEventListener('click', () => {
        if (!isMusicPlaying) {
            bgMusic.play().catch(e => console.log("Audio play failed interaction required"));
            isMusicPlaying = true;
        }

        giftBox.classList.add('open');

        setTimeout(() => {
            switchScene(sceneGift, sceneCalendar);
            startCalendarAnimation();
        }, 1500);
    });

    function switchScene(from, to) {
        from.classList.remove('active');
        setTimeout(() => {
            to.classList.add('active');
        }, 500); // slight overlap/delay
    }

    // 2. Calendar Animation
    function startCalendarAnimation() {
        let currentDate = new Date(START_DATE);
        let speed = 800; // Start slow (ms per frame)

        // Initial acceleration loop
        setTimeout(() => {
            animateStep();
        }, 1000); // Wait 1s before starting

        function animateStep() {
            if (currentDate >= END_DATE) {
                // Done
                currentDate = new Date(END_DATE);
                updateCalendarDisplay(currentDate);

                setTimeout(() => {
                    startSecondsTimer();
                    switchScene(sceneCalendar, sceneTree);
                    initGeekTree();
                    initSnow();
                }, 1500);
                return;
            }

            // Visual Tear Effect if not too fast
            if (speed > 30) {
                createTearEffect(currentDate);
            }

            // Advance Date
            currentDate.setDate(currentDate.getDate() + 1);
            updateCalendarDisplay(currentDate);

            // Accelerate
            speed = Math.max(10, speed * 0.92); // Reduce delay by 8% each step until 10ms

            setTimeout(animateStep, speed);
        }
    }

    function createTearEffect(date) {
        // Create a clone element to animate falling
        const tearEl = document.createElement('div');
        tearEl.className = 'calendar-tear';
        tearEl.innerHTML = `
            <div class="calendar-month">${MONTH_NAMES[date.getMonth()]}</div>
            <div class="calendar-day">${date.getDate()}</div>
            <div class="calendar-year">2025</div>
        `;
        // Append to calendar-card so it's positioned relative to the card
        document.querySelector('.calendar-card').appendChild(tearEl);

        // Remove after animation
        setTimeout(() => {
            tearEl.remove();
        }, 600);
    }

    function updateCalendarDisplay(date) {
        calMonth.textContent = MONTH_NAMES[date.getMonth()];
        calDay.textContent = date.getDate();
        // Year is static 2025 in HTML
    }

    // 3. Seconds Timer
    function startSecondsTimer() {
        // Update immediately
        updateTimer();
        // Then every second (or faster for "ticking" effect)
        setInterval(updateTimer, 100);
    }

    const daysDisplay = document.getElementById('daysTimer');
    const secondsDisplay = document.getElementById('secondsTimer');

    function updateTimer() {
        const now = new Date();
        const diff = now - START_DATE;
        // Total Seconds
        const totalSeconds = Math.floor(diff / 1000);
        // Days
        const days = Math.floor(totalSeconds / (3600 * 24));

        daysDisplay.textContent = days.toLocaleString();
        secondsDisplay.textContent = totalSeconds.toLocaleString();
    }

    // --- Geek Tree Logic ---
    // --- Geek Tree Logic ---
    function initGeekTree() {
        const tCanvas = document.getElementById('geekTreeCanvas');
        const tCtx = tCanvas.getContext('2d');
        // Make sure canvas is clear & sized
        tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);

        // Dynamic sizing based on container
        const container = document.querySelector('.tree-container');
        const tWidth = container.clientWidth || 400;
        const tHeight = container.clientHeight || 500;

        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;
        tCanvas.width = tWidth * dpr;
        tCanvas.height = tHeight * dpr;
        tCtx.scale(dpr, dpr);

        // Re-calculate scales for mobile
        const isMobile = tWidth < 350;
        const scaleFactor = isMobile ? 0.7 : 1;
        const yOffset = isMobile ? 100 : 200;

        const particles = [];
        const particleCount = 1200; // Increased count for density

        // Create Spiral Tree with enhanced visuals
        for (let i = 0; i < particleCount; i++) {
            // p goes from 0 (bottom) to 1 (top)
            const p = i / particleCount;

            // Adjust geometry: 
            // y: -200 (top) to 200 (bottom)
            // radius: 0 (top) to 180 (bottom)

            const angle = p * Math.PI * 40; // More loops (20 turns)

            // Add some randomness to spread particles out from the perfect line
            const radiusSpread = Math.random() * 20;
            const ySpread = Math.random() * 20;

            // Inverted Logic: 
            // Top of tree (y=-180) has radius near 0
            // Bottom of tree (y=180) has radius near 150
            const y = (1 - p) * 400 - 200; // map 1->0 to -200->200? No.
            // p=0 => bottom of loop? 
            // Let's explicitly define:
            // h = -200 to 200

            // Let's use linear distribution for height, but mapped to cone
            // For mobile, reduce height range
            const h = ((p * 400) - 200) * scaleFactor;

            // Normalize h to 0..1 range for radius calc
            // Adjusted for scaling: max H is 200*scaleFactor
            const normH = (h + (200 * scaleFactor)) / (400 * scaleFactor);
            const radius = normH * 160 * scaleFactor;

            // Enhanced color palette
            let color;
            const colorRand = Math.random();
            if (colorRand > 0.98) {
                color = '#ff6b9d'; // Pink ornaments
            } else if (colorRand > 0.96) {
                color = '#4fc3f7'; // Blue ornaments
            } else if (colorRand > 0.93) {
                color = '#f8b229'; // Gold ornaments
            } else if (colorRand > 0.90) {
                color = '#ef5350'; // Red ornaments
            } else if (colorRand > 0.6) {
                color = `hsl(140, ${60 + Math.random() * 40}%, ${25 + Math.random() * 35}%)`; // Green variations
            } else {
                color = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`; // White/silver
            }

            // Some particles are ornaments (larger)
            const isOrnament = Math.random() > 0.97;
            const isTwinkling = Math.random() > 0.85;

            particles.push({
                x: Math.cos(angle) * (radius + Math.random() * 10),
                y: h + Math.random() * 10,
                z: Math.sin(angle) * (radius + Math.random() * 10),
                color: color,
                size: isOrnament ? (4 + Math.random() * 3) * scaleFactor : (Math.random() * 2 + 0.5) * scaleFactor,
                originalY: h,
                isOrnament: isOrnament,
                isTwinkling: isTwinkling,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }

        // Add Star with glow
        particles.push({
            x: 0, y: (-210 * scaleFactor), z: 0,
            color: '#ffd700',
            size: 12 * scaleFactor,
            isStar: true,
            twinklePhase: 0
        });

        let angleOffset = 0;
        let time = 0;

        function renderTree() {
            tCtx.clearRect(0, 0, tWidth, tHeight);

            const centerX = tWidth / 2;
            const centerY = tHeight / 2 + (30 * scaleFactor);

            // Sort by depth for correct occlusion (painters algorithm)
            particles.sort((a, b) => b.rotatedZ - a.rotatedZ);

            particles.forEach(p => {
                // Rotate around Y axis
                const cos = Math.cos(angleOffset);
                const sin = Math.sin(angleOffset);

                // 3D Rotation
                const rx = p.x * cos - p.z * sin;
                const rz = p.x * sin + p.z * cos;
                p.rotatedZ = rz; // Store for sorting

                // Perspective projection
                const fov = 350;
                const scale = fov / (fov + rz + 250);

                const x2d = rx * scale + centerX;
                const y2d = p.y * scale + centerY;

                // Draw
                let alpha = (rz + 250) / 500; // Fade back particles
                alpha = Math.max(0.1, Math.min(1, alpha + 0.2));

                // Twinkling effect
                if (p.isTwinkling) {
                    alpha *= 0.5 + 0.5 * Math.sin(time * 3 + p.twinklePhase);
                }

                tCtx.globalAlpha = alpha;

                // Star special rendering
                if (p.isStar) {
                    const starGlow = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 2));
                    tCtx.shadowBlur = 40 * starGlow;
                    tCtx.shadowColor = '#ffd700';
                    tCtx.fillStyle = '#ffd700';

                    // Draw star as a multi-point shape
                    tCtx.beginPath();
                    tCtx.arc(x2d, y2d, p.size * scale * (1 + starGlow * 0.2), 0, Math.PI * 2);
                    tCtx.fill();
                    tCtx.shadowBlur = 0;
                } else if (p.isOrnament) {
                    // Ornaments have extra shine
                    tCtx.fillStyle = p.color;
                    tCtx.beginPath();
                    tCtx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
                    tCtx.fill();

                    // Add highlight
                    const gradient = tCtx.createRadialGradient(
                        x2d - p.size * scale * 0.3,
                        y2d - p.size * scale * 0.3,
                        0,
                        x2d,
                        y2d,
                        p.size * scale
                    );
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    tCtx.fillStyle = gradient;
                    tCtx.fill();
                } else {
                    // Regular particles
                    tCtx.fillStyle = p.color;
                    tCtx.beginPath();
                    tCtx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
                    tCtx.fill();
                }
            });

            angleOffset += 0.015;
            time += 0.05;
            requestAnimationFrame(renderTree);
        }

        renderTree();
    }

});
