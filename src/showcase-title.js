const title = "Bufferage";
export function initShowcaseTitleParticles({ canvas, interactionTarget }) {
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Unable to initialize showcase title canvas");
    }
    const pointer = {
        x: -10000,
        y: -10000,
        isInside: false,
    };
    let width = 1920;
    let height = 1080;
    let particles = [];
    let titleBounds = { top: 0, right: 0, bottom: 0, left: 0 };
    const resize = () => {
        width = canvas.clientWidth || 1920;
        height = canvas.clientHeight || 1080;
        const ratio = Math.min(window.devicePixelRatio, 2);
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(ratio, ratio);
        const titleField = createTitleParticles(width, height);
        particles = titleField.particles;
        titleBounds = titleField.bounds;
    };
    const updatePointer = (clientX, clientY) => {
        const rect = interactionTarget.getBoundingClientRect();
        pointer.x = ((clientX - rect.left) / rect.width) * width;
        pointer.y = ((clientY - rect.top) / rect.height) * height;
        pointer.isInside = true;
    };
    const handlePointerMove = (event) => {
        updatePointer(event.clientX, event.clientY);
    };
    const handlePointerLeave = () => {
        pointer.x = -10000;
        pointer.y = -10000;
        pointer.isInside = false;
    };
    const render = (time) => {
        const seconds = time * 0.001;
        context.clearRect(0, 0, width, height);
        drawShadowTitle(context, width, height);
        drawTitleParticles(context, particles, pointer, seconds, titleBounds);
        requestAnimationFrame(render);
    };
    resize();
    requestAnimationFrame(render);
    interactionTarget.addEventListener("pointermove", handlePointerMove);
    interactionTarget.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);
    return () => {
        interactionTarget.removeEventListener("pointermove", handlePointerMove);
        interactionTarget.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("resize", resize);
    };
}
function createTitleParticles(viewportWidth, viewportHeight) {
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d");
    if (!sampleContext) {
        throw new Error("Unable to create showcase title particles");
    }
    sampleCanvas.width = viewportWidth;
    sampleCanvas.height = viewportHeight;
    const fontSize = Math.min(viewportWidth * 0.27, 430);
    const centerX = viewportWidth * 0.5;
    const centerY = viewportHeight * 0.53;
    sampleContext.clearRect(0, 0, viewportWidth, viewportHeight);
    sampleContext.fillStyle = "#ffffff";
    sampleContext.textAlign = "center";
    sampleContext.textBaseline = "middle";
    sampleContext.font = `600 ${fontSize}px "Bodoni 72", "Didot", serif`;
    sampleContext.fillText(title, centerX, centerY);
    const metrics = sampleContext.measureText(title);
    const bounds = {
        bottom: centerY + fontSize * 0.2,
        left: centerX - metrics.width * 0.5,
        right: centerX + metrics.width * 0.5,
        top: centerY - fontSize * 0.56,
    };
    const imageData = sampleContext.getImageData(0, 0, viewportWidth, viewportHeight).data;
    const step = Math.max(5, Math.round(fontSize / 44));
    const particles = [];
    for (let y = 0; y < viewportHeight; y += step) {
        for (let x = 0; x < viewportWidth; x += step) {
            const alpha = imageData[(y * viewportWidth + x) * 4 + 3];
            if (alpha < 40)
                continue;
            const solidity = Math.random();
            particles.push({
                alpha: solidity > 0.7 ? 0.92 : solidity > 0.32 ? 0.68 : 0.38,
                baseSize: solidity > 0.72 ? 2 + Math.random() * 1.1 : 1.15 + Math.random() * 1.1,
                homeX: x,
                homeY: y,
                phase: Math.random() * Math.PI * 2,
                size: solidity > 0.72 ? 2 + Math.random() * 1.1 : 1.15 + Math.random() * 1.1,
                vx: 0,
                vy: 0,
                x,
                y,
            });
        }
    }
    return { particles, bounds };
}
function drawShadowTitle(context, viewportWidth, viewportHeight) {
    const fontSize = Math.min(viewportWidth * 0.27, 430);
    context.save();
    context.fillStyle = "rgba(255,255,255,0.038)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `600 ${fontSize}px "Bodoni 72", "Didot", serif`;
    context.fillText(title, viewportWidth * 0.5, viewportHeight * 0.53);
    context.restore();
}
function drawTitleParticles(context, particles, pointer, seconds, bounds) {
    const mouseRadius = 84;
    const coreRadius = 26;
    const pointerOnTitle = pointer.isInside &&
        pointer.x > bounds.left - 18 &&
        pointer.x < bounds.right + 18 &&
        pointer.y > bounds.top - 18 &&
        pointer.y < bounds.bottom + 18;
    particles.forEach((particle) => {
        const breatheX = Math.sin(seconds * 1.2 + particle.phase) * 0.16;
        const breatheY = Math.cos(seconds * 1.06 + particle.phase) * 0.12;
        const targetX = particle.homeX + breatheX;
        const targetY = particle.homeY + breatheY;
        particle.vx += (targetX - particle.x) * 0.05;
        particle.vy += (targetY - particle.y) * 0.05;
        if (pointerOnTitle) {
            const deltaX = particle.homeX - pointer.x;
            const deltaY = particle.homeY - pointer.y;
            const distance = Math.hypot(deltaX, deltaY);
            if (distance < mouseRadius) {
                const nx = deltaX / Math.max(distance, 1);
                const ny = deltaY / Math.max(distance, 1);
                const tx = -ny;
                const ty = nx;
                const falloff = 1 - distance / mouseRadius;
                const coreFalloff = Math.max(0, 1 - distance / coreRadius);
                const pushForce = falloff * 0.11 + coreFalloff * 0.25;
                const swirlForce = falloff * 0.012;
                particle.vx += nx * pushForce + tx * swirlForce;
                particle.vy += ny * pushForce + ty * swirlForce;
            }
        }
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;
        const pointerDistance = Math.hypot(particle.homeX - pointer.x, particle.homeY - pointer.y);
        const alphaFade = pointerOnTitle && pointerDistance < mouseRadius
            ? Math.max(0.16, Math.min(1, (pointerDistance - coreRadius * 0.38) / (mouseRadius - coreRadius * 0.38)))
            : 1;
        context.beginPath();
        context.fillStyle = `rgba(245, 244, 239, ${particle.alpha * alphaFade})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
    });
}
