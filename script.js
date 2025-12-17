document.addEventListener('DOMContentLoaded', () => {
    // --- Developer Background System ---
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const cursorGlow = document.querySelector('.cursor-glow');

    let width, height;
    let particles = [];

    // Icons: Developer, Android, Kotlin, Compose, Flutter, BT, Wifi, USB, 2-Wheeler, 3-Wheeler
    // Icons: Java, Android (Kotlin), Compose, Bike, EV Charger, Hardware, Bluetooth, Wifi
    const icons = [
        '\uf4e4', // Java (Brands)
        '\uf17b', // Android (Brands) - Kotlin Proxy
        '\uf5fd', // Layers (Solid) - Jetpack Compose
        '\uf21c', // Motorcycle (Solid)
        '\uf5e7', // Charging Station (Solid) - EV
        '\uf2db', // Microchip (Solid) - Hardware
        '\uf293', // Bluetooth (Brands)
        '\uf1eb', // Wifi (Solid)
        '\ue694'  // Flutter (Brands)
    ];

    // Solids: Layers, Motorcycle, Charging Station, Microchip, Wifi
    const solidIcons = ['\uf5fd', '\uf21c', '\uf5e7', '\uf2db', '\uf1eb'];

    // Initial dimensions
    const bgContainer = document.querySelector('.developer-bg-container');
    // Fallback if container not found immediately (though it should be)
    width = bgContainer ? bgContainer.clientWidth : window.innerWidth;
    height = bgContainer ? bgContainer.clientHeight : window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width !== width || entry.contentRect.height !== height) {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
                canvas.width = width;
                canvas.height = height;
                initParticles();
            }
        }
    });
    if (bgContainer) resizeObserver.observe(bgContainer);

    let mouseX = -1000, mouseY = -1000;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorGlow) {
            cursorGlow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 30 + 30; // Increased size: 30px to 60px
            this.speedY = Math.random() * 0.5 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.symbol = icons[Math.floor(Math.random() * icons.length)];

            // Font selection based on symbol type (Solid vs Brands)
            if (solidIcons.includes(this.symbol)) {
                this.font = '900 ' + this.size + 'px "Font Awesome 6 Free"';
            } else {
                this.font = '400 ' + this.size + 'px "Font Awesome 6 Brands"';
            }

            this.opacity = Math.random() * 0.4 + 0.15;
            this.baseColor = 'rgba(148, 163, 184,';
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            if (this.y < -50) {
                this.y = height + 50;
                this.x = Math.random() * width;
            }

            // Interaction
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                this.color = `rgba(139, 92, 246, ${this.opacity + 0.3})`;
            } else {
                this.color = `${this.baseColor} ${this.opacity})`;
            }
        }

        draw() {
            if (!ctx) return;
            ctx.font = this.font;
            ctx.fillStyle = this.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    function initParticles() {
        particles = [];
        if (!width) return;
        // Exactly one particle per icon type as requested
        for (let i = 0; i < icons.length; i++) {
            particles.push(new Particle(icons[i]));
        }
    }

    function animate() {
        if (!ctx || !width) return;
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => p.update());
        particles.forEach(p => p.draw());
        requestAnimationFrame(animate);
    }

    // Wait for fonts to load before starting
    // Use a small timeout fallback just in case fonts.ready hangs
    Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 1000))
    ]).then(() => {
        initParticles();
        animate();
    });
    // Typing Animation
    const dynamicText = document.querySelector('.dynamic-text');
    const words = ["an Android Developer", "a Vehicle Diagnostics Expert", "a Kotlin Specialist", "an Automotive Software Engineer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);

        dynamicText.textContent = currentChar;
        dynamicText.classList.add('stop-blinking');

        if (!isDeleting && charIndex < currentWord.length) {
            // Typing
            charIndex++;
            setTimeout(typeEffect, 100);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            setTimeout(typeEffect, 50);
        } else {
            // Word complete or deleted
            isDeleting = !isDeleting;
            dynamicText.classList.remove('stop-blinking');
            wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
            setTimeout(typeEffect, 1200);
        }
    };

    typeEffect();

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 17, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.backdropFilter = 'blur(20px)';
            }
        });
    }

    // Scroll Active State
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // Form Submission (Mock)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the data to a server or email service
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#10b981'; // Success green
                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.background = ''; // Revert to original gradient
                }, 3000);
            }, 1500);
        });
    }
    // --- 3D Tilt Interaction for Glass Cards ---
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply transform (remove transition for instant response)
            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Add gloss effect dynamically
            const existingGloss = card.querySelector('.gloss-effect');
            if (!existingGloss) {
                const gloss = document.createElement('div');
                gloss.className = 'gloss-effect';
                gloss.style.position = 'absolute';
                gloss.style.top = '0';
                gloss.style.left = '0';
                gloss.style.width = '100%';
                gloss.style.height = '100%';
                gloss.style.background = 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 60%)';
                gloss.style.pointerEvents = 'none';
                gloss.style.zIndex = '2';
                gloss.style.borderRadius = 'inherit';
                card.appendChild(gloss);
            } else {
                // Move gloss light source
                existingGloss.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            // Restore transition for smooth return
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

            const gloss = card.querySelector('.gloss-effect');
            if (gloss) gloss.style.opacity = '0';
        });

        card.addEventListener('mouseenter', () => {
            const gloss = card.querySelector('.gloss-effect');
            if (gloss) gloss.style.opacity = '1';
        });
    });
});
