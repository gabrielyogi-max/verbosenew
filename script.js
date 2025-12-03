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

// Handle window resize
window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
});

// Handle mouse movement
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
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
        // Store original speed to limit max velocity
        this.speedX = directionX;
        this.speedY = directionY;
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
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

    // Fade effect for trails? The user mentioned "efeito visuais fodas" (cool visual effects).
    // Let's keep it simple with clearRect for now to ensure performance, 
    // unless "trails" are specifically requested again. 
    // The previous prompt removed lines, so clean dots are expected.

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

init();
animate();
