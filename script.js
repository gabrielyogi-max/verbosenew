document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth follow for outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects for cursor
    const hoverElements = document.querySelectorAll('.hover-effect, a, button, .card, .gallery-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(0, 242, 255, 0.1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Tilt Effect for Cards
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // --- NEBULA CLOUD EFFECT ---
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    const particleCount = 250; // More particles for a "cloud" feel
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles(); // Re-init on resize to keep them at top
    }
    
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            // Concentrate at the top (0 to 40% of height)
            this.y = Math.random() * (height * 0.4); 
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 3 + 1;
            // Nebula colors
            this.color = Math.random() > 0.5 ? 'rgba(0, 242, 255, ' : 'rgba(255, 0, 85, '; 
            this.alpha = Math.random() * 0.5 + 0.2;
            
            // Original position to return to (optional, but good for "cloud" staying in place)
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }
        
        update() {
            // Mouse Interaction (Repulsion/Swirl)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // Distance of interaction
            const maxDistance = 150;
            let force = (maxDistance - distance) / maxDistance;
            
            if (force < 0) force = 0;
            
            // Move particles away from mouse
            if (distance < maxDistance) {
                this.vx -= forceDirectionX * force * 2;
                this.vy -= forceDirectionY * force * 2;
            }

            // Friction / returning to "cloud" movement
            this.x += this.vx;
            this.y += this.vy;
            
            // Damping
            this.vx *= 0.95;
            this.vy *= 0.95;

            // Boundary checks / Wrap around for cloud effect
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            
            // Keep them mostly at the top, bounce back softly
            if (this.y < 0) this.y = height * 0.4;
            if (this.y > height * 0.5) {
                this.y = 0; // Respawn at top if they fall too far
                this.vy = Math.random() * 0.5;
            }
            
            // Add natural drift
            this.x += (Math.random() - 0.5) * 0.5;
            this.y += (Math.random() - 0.5) * 0.5;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Connect particles to form "cloud" mesh
        for (let i = 0; i < particles.length; i++) {
            // Optimization: Only check a subset or neighbors
            // For simple demo, checking all vs all is O(N^2), keep N low-ish (250 is ok)
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    ctx.beginPath();
                    // Alpha depends on distance
                    const opacity = 1 - (distance / 80);
                    ctx.strokeStyle = 'rgba(255, 255, 255,' + (opacity * 0.2) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    resize(); // Init
    animateParticles();
});
