const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];

// Configuration
const CONFIG = {
    nodeCount: 80,
    connectionDistance: 150,
    mouseDistance: 200,
    nodeSpeed: 0.3,
    colors: {
        node: 'rgba(235, 241, 245, 0.5)',
        line: 'rgba(38, 197, 237, 0.15)',
        highlight: 'rgba(38, 197, 237, 0.4)'
    }
};

let mouse = {
    x: null,
    y: null
};

window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

class Node {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * CONFIG.nodeSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.nodeSpeed;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = CONFIG.colors.node;
        ctx.fill();
    }
}

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    nodes = [];
    
    // Adjust node count based on screen size
    const count = (width * height) / 15000; 
    
    for (let i = 0; i < count; i++) {
        nodes.push(new Node());
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                
                // Calculate opacity based on distance
                let opacity = 1 - (distance / CONFIG.connectionDistance);
                ctx.strokeStyle = CONFIG.colors.line.replace('0.15)', `${opacity * 0.15})`);
                
                // Mouse Interaction: Highlight connections near mouse
                if (mouse.x) {
                    const mouseDx = mouse.x - nodes[i].x;
                    const mouseDy = mouse.y - nodes[i].y;
                    const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                    
                    if (mouseDist < CONFIG.mouseDistance) {
                        ctx.strokeStyle = CONFIG.colors.highlight.replace('0.4)', `${opacity * 0.4})`);
                        ctx.lineWidth = 1;
                    } else {
                         ctx.lineWidth = 0.5;
                    }
                }
                
                ctx.stroke();
            }
        }
    }
}

init();
animate();
