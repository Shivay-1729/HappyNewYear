const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let starSpeed = 0.5;
let isHyperspace = false;

// Add this at the very top of your script.js
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const customName = urlParams.get('name'); // This looks for ?name=YourName
    
    if (customName) {
        // Find the user-name element and update it
        document.querySelector('.user-name').innerText = customName.toUpperCase();
    }
};
// Initialize Stars
for (let i = 0; i < 800; i++) {
    stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        prevZ: 0
    });
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // Trail effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);

    stars.forEach(s => {
        s.z -= starSpeed;
        if (s.z <= 0) s.z = canvas.width;

        let sx = s.x / (s.z / canvas.width);
        let sy = s.y / (s.z / canvas.width);
        
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = isHyperspace ? 3 : 1;
        // This creates the "stretch" line effect
        ctx.moveTo(sx, sy);
        let px = s.x / ((s.z + (isHyperspace ? 50 : 2)) / canvas.width);
        let py = s.y / ((s.z + (isHyperspace ? 50 : 2)) / canvas.width);
        ctx.lineTo(px, py);
        ctx.stroke();
    });

    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    requestAnimationFrame(draw);
}

// Hyperspace Trigger & Sound
function goHyperspace() {
    isHyperspace = true;
    starSpeed = 60;
    
    // Audio Context for Lightsaber/Glitch Hum
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);

    setTimeout(() => {
        starSpeed = 0.5;
        isHyperspace = false;
    }, 1500);
}

// Countdown Timer
setInterval(() => {
    const target = new Date("Jan 1, 2026 00:00:00").getTime();
    const now = new Date().getTime();
    const diff = target - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById("timer").innerText = `${d}D ${h}H ${m}M ${s}S`;
}, 1000);

draw();