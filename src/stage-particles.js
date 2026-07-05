export function initStageParticles({ canvas }) {
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Unable to initialize stage particle canvas");
    }
    let width = 1920;
    let height = 1080;
    let particles = [];
    const resize = () => {
        width = canvas.clientWidth || 1920;
        height = canvas.clientHeight || 1080;
        const ratio = Math.min(window.devicePixelRatio, 2);
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(ratio, ratio);
        particles = Array.from({ length: 900 }, () => ({
            alpha: 0.04 + Math.random() * 0.12,
            depth: 0.2 + Math.random() * 0.8,
            drift: Math.random() * Math.PI * 2,
            size: 0.6 + Math.random() * 1.8,
            x: Math.random() * width,
            y: Math.random() * height,
        }));
    };
    const render = (time) => {
        const seconds = time * 0.001;
        context.clearRect(0, 0, width, height);
        particles.forEach((particle, index) => {
            const driftX = Math.sin(seconds * 0.18 + particle.drift + index * 0.03) * 4 * particle.depth;
            const driftY = Math.cos(seconds * 0.14 + particle.drift + index * 0.02) * 3 * particle.depth;
            context.beginPath();
            context.fillStyle = `rgba(236, 235, 230, ${particle.alpha})`;
            context.arc(particle.x + driftX, particle.y + driftY, particle.size, 0, Math.PI * 2);
            context.fill();
        });
        requestAnimationFrame(render);
    };
    resize();
    requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    return () => {
        window.removeEventListener("resize", resize);
    };
}
