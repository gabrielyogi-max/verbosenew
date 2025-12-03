const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particlesArray;

// Mouse interaction object
let mouse = {
    x: null,
    y: null,
    radius: 250 // Increased radius for better gravity effect
}

let parallax = {
    x: 0,
    y: 0
}

// Handle window resize
window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
});

// Handle mouse movement and Parallax
window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    
    // Parallax Effect
    // Calculate displacement from center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // The further from center, the larger the shift
    parallax.x = (centerX - mouse.x) / 20; // Divider controls sensitivity
    parallax.y = (centerY - mouse.y) / 20;
});

// Handle mouse out
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Handle touch events for mobile
window.addEventListener('touchstart', function(event) {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

window.addEventListener('touchmove', function(event) {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    
    // Parallax for touch
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    parallax.x = (centerX - mouse.x) / 20;
    parallax.y = (centerY - mouse.y) / 20;
});

window.addEventListener('touchend', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.hue = Math.random() * 360; // Individual hue for each particle
        // Store original speed to limit max velocity
        this.speedX = directionX;
        this.speedY = directionY;
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        // Add parallax offset based on size (depth)
        // Larger particles are "closer", so they move MORE (standard parallax)
        // Or LESS? 
        // In standard parallax:
        // Foreground moves fast. Background moves slow.
        // If size = closeness, then:
        // shift = parallax * size * factor
        
        let pX = parallax.x * this.size * 0.5;
        let pY = parallax.y * this.size * 0.5;
        
        ctx.arc(this.x + pX, this.y + pY, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`; // Dynamic color
        ctx.fill();
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        // Wall collisions - bounce off walls
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse interaction (Gravity)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        // If mouse is on screen and particle is within radius
        if (mouse.x != undefined && distance < mouse.radius) {
            // Calculate force vector towards mouse
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            
            // The closer it is, the stronger the pull (gravity)
            // But cap it so they don't explode
            const force = (mouse.radius - distance) / mouse.radius; 
            const directionMultiplier = 0.6; // Adjust strength of gravity

            this.directionX += forceDirectionX * force * directionMultiplier;
            this.directionY += forceDirectionY * force * directionMultiplier;
        } 

        // Apply friction to stop them from accelerating infinitely
        // And slowly return to original chaotic movement if left alone? 
        // Or just dampen the velocity.
        // Let's limit the max speed so they don't vanish.
        
        const maxSpeed = 5;
        // Clamp speed
        const speed = Math.sqrt(this.directionX**2 + this.directionY**2);
        if (speed > maxSpeed) {
            this.directionX = (this.directionX / speed) * maxSpeed;
            this.directionY = (this.directionY / speed) * maxSpeed;
        }

        // Update individual hue
        this.hue += 2; // Increment hue for color change effect per particle

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        
        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1; // Speed between -1 and 1
        let directionY = (Math.random() * 2) - 1;
        let color = '#00f3ff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

init();
animate();
