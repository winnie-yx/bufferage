import gsap from "gsap";
const titleLines = ["Hyper", "hesitation"];
export function initLandingExperience({ canvas, enterButton, overlay, shellFrame, }) {
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Unable to initialize landing canvas");
    }
    const pointer = {
        dx: 0,
        x: -10000,
        dy: 0,
        y: -10000,
        isInside: false,
    };
    const state = {
        isEntering: false,
        hasAssembled: false,
        introProgress: 0,
        mouseParallaxX: 0,
        mouseParallaxY: 0,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
    };
    let particles = [];
    let dust = [];
    let burstParticles = [];
    let titleBounds = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    };
    let titleLetterZones = [];
    const resize = () => {
        state.viewportWidth = window.innerWidth;
        state.viewportHeight = window.innerHeight;
        canvas.width = Math.floor(window.innerWidth * Math.min(window.devicePixelRatio, 2));
        canvas.height = Math.floor(window.innerHeight * Math.min(window.devicePixelRatio, 2));
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(canvas.width / window.innerWidth, canvas.height / window.innerHeight);
        const titleField = createTitleParticles(window.innerWidth, window.innerHeight);
        particles = titleField.particles;
        titleBounds = titleField.bounds;
        titleLetterZones = titleField.letterZones;
        dust = createDustParticles(window.innerWidth, window.innerHeight);
        burstParticles = [];
    };
    const handlePointerMove = (event) => {
        pointer.dx = event.clientX - pointer.x;
        pointer.dy = event.clientY - pointer.y;
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.isInside = true;
        state.mouseParallaxX = (event.clientX / state.viewportWidth - 0.5) * 2;
        state.mouseParallaxY = (event.clientY / state.viewportHeight - 0.5) * 2;
    };
    const handlePointerLeave = () => {
        pointer.dx = 0;
        pointer.dy = 0;
        pointer.x = -10000;
        pointer.y = -10000;
        pointer.isInside = false;
        state.mouseParallaxX = 0;
        state.mouseParallaxY = 0;
    };
    const triggerEnter = () => {
        if (state.isEntering)
            return;
        state.isEntering = true;
        overlay.classList.add("landing-overlay--entering");
        shellFrame.classList.add("shell-frame--revealed");
        particles.forEach((particle, index) => {
            const angle = Math.atan2(particle.y - state.viewportHeight * 0.5, particle.x - state.viewportWidth * 0.5);
            const burst = 2.4 + (index % 7) * 0.32;
            particle.vx += Math.cos(angle) * burst;
            particle.vy += Math.sin(angle) * burst;
        });
        dust.forEach((particle, index) => {
            const angle = Math.atan2(particle.y - state.viewportHeight * 0.5, particle.x - state.viewportWidth * 0.5) +
                Math.sin(index * 1.7) * 0.22;
            const burst = 0.8 + particle.depth * 2.6;
            particle.vx += Math.cos(angle) * burst;
            particle.vy += Math.sin(angle) * burst;
            particle.alpha = Math.min(0.42, particle.alpha + 0.08);
        });
        burstParticles = createBurstParticles(state.viewportWidth, state.viewportHeight);
        gsap.to(state, {
            introProgress: 1,
            duration: 1.45,
            ease: "power3.inOut",
            onComplete: () => {
                overlay.classList.add("landing-overlay--hidden");
            },
        });
    };
    enterButton.addEventListener("click", triggerEnter);
    overlay.addEventListener("pointermove", handlePointerMove);
    overlay.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);
    resize();
    gsap.to(state, {
        duration: 1.8,
        ease: "power2.out",
        introProgress: 0.18,
        onComplete: () => {
            state.hasAssembled = true;
        },
    });
    const render = (time) => {
        const seconds = time * 0.001;
        context.clearRect(0, 0, state.viewportWidth, state.viewportHeight);
        drawDust(context, dust, state.mouseParallaxX, state.mouseParallaxY, seconds);
        drawTitleParticles(context, particles, pointer, state, seconds, titleBounds, titleLetterZones);
        drawBurstParticles(context, burstParticles, state.isEntering);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
    return () => {
        enterButton.removeEventListener("click", triggerEnter);
        overlay.removeEventListener("pointermove", handlePointerMove);
        overlay.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("resize", resize);
    };
}
function createTitleParticles(viewportWidth, viewportHeight) {
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d");
    if (!sampleContext) {
        throw new Error("Unable to create title particle canvas");
    }
    sampleCanvas.width = viewportWidth;
    sampleCanvas.height = viewportHeight;
    const fontSize = Math.min(viewportWidth * 0.17, 220);
    const lineHeight = fontSize * 0.84;
    sampleContext.clearRect(0, 0, viewportWidth, viewportHeight);
    sampleContext.fillStyle = "#ffffff";
    sampleContext.textAlign = "center";
    sampleContext.textBaseline = "middle";
    sampleContext.font = `600 ${fontSize}px "Bodoni 72", "Didot", serif`;
    const centerX = viewportWidth * 0.5;
    const centerY = viewportHeight * 0.435;
    const lineYs = [centerY - lineHeight * 0.5, centerY + lineHeight * 0.5];
    const lineMetrics = titleLines.map((line) => sampleContext.measureText(line));
    titleLines.forEach((line, index) => {
        sampleContext.fillText(line, centerX, lineYs[index]);
    });
    const maxLineWidth = Math.max(...lineMetrics.map((metrics) => metrics.width));
    const bounds = {
        bottom: lineYs[1] + fontSize * 0.32,
        left: centerX - maxLineWidth * 0.5,
        right: centerX + maxLineWidth * 0.5,
        top: lineYs[0] - fontSize * 0.58,
    };
    const letterZones = [];
    const zonePaddingX = fontSize * 0.045;
    const zonePaddingY = fontSize * 0.09;
    titleLines.forEach((line, lineIndex) => {
        const lineWidth = lineMetrics[lineIndex].width;
        const lineLeft = centerX - lineWidth * 0.5;
        const lineTop = lineYs[lineIndex] - fontSize * 0.58;
        const lineBottom = lineYs[lineIndex] + fontSize * 0.32;
        for (let index = 0; index < line.length; index += 1) {
            const letter = line[index];
            const leftWidth = index === 0 ? 0 : sampleContext.measureText(line.slice(0, index)).width;
            const rightWidth = sampleContext.measureText(line.slice(0, index + 1)).width;
            const letterLeft = lineLeft + leftWidth;
            const letterRight = lineLeft + rightWidth;
            const letterWidth = Math.max(sampleContext.measureText(letter).width, letterRight - letterLeft);
            letterZones.push({
                bottom: lineBottom + zonePaddingY,
                left: letterLeft - zonePaddingX,
                right: letterLeft + letterWidth + zonePaddingX,
                top: lineTop - zonePaddingY,
            });
        }
    });
    const imageData = sampleContext.getImageData(0, 0, viewportWidth, viewportHeight).data;
    const step = Math.max(4, Math.round(fontSize / 36));
    const particles = [];
    for (let y = 0; y < viewportHeight; y += step) {
        for (let x = 0; x < viewportWidth; x += step) {
            const alpha = imageData[(y * viewportWidth + x) * 4 + 3];
            if (alpha < 40)
                continue;
            particles.push({
                alpha: 0.92,
                baseSize: 1.2 + Math.random() * 1.8,
                homeX: x,
                homeY: y,
                influence: 0,
                phase: Math.random() * Math.PI * 2,
                size: 1.2 + Math.random() * 1.8,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                x: Math.random() * viewportWidth,
                y: Math.random() * viewportHeight,
            });
        }
    }
    return { particles, bounds, letterZones };
}
function createDustParticles(viewportWidth, viewportHeight) {
    return Array.from({ length: 220 }, () => ({
        alpha: 0.12 + Math.random() * 0.3,
        depth: 0.2 + Math.random() * 0.8,
        drift: Math.random() * Math.PI * 2,
        size: 0.8 + Math.random() * 2.2,
        vx: 0,
        vy: 0,
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
    }));
}
function createBurstParticles(viewportWidth, viewportHeight) {
    return Array.from({ length: 560 }, (_, index) => {
        const x = Math.random() * viewportWidth;
        const y = Math.random() * viewportHeight;
        const angle = Math.atan2(y - viewportHeight * 0.5, x - viewportWidth * 0.5) + (Math.random() - 0.5) * 0.8;
        const speed = 1.2 + Math.random() * 4.4;
        return {
            alpha: 0.14 + Math.random() * 0.24,
            size: 0.6 + Math.random() * 1.8,
            vx: Math.cos(angle) * speed + Math.sin(index * 0.31) * 0.18,
            vy: Math.sin(angle) * speed + Math.cos(index * 0.27) * 0.18,
            x,
            y,
        };
    });
}
function drawDust(context, dust, parallaxX, parallaxY, seconds) {
    dust.forEach((particle, index) => {
        const driftX = Math.sin(seconds * 0.3 + particle.drift + index) * 4 * particle.depth;
        const driftY = Math.cos(seconds * 0.24 + particle.drift + index * 1.1) * 4 * particle.depth;
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        particle.x += particle.vx;
        particle.y += particle.vy;
        const x = particle.x + driftX + parallaxX * 22 * particle.depth;
        const y = particle.y + driftY + parallaxY * 18 * particle.depth;
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${particle.alpha})`;
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
    });
}
function drawBurstParticles(context, particles, isEntering) {
    if (!isEntering || particles.length === 0) {
        return;
    }
    for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha *= 0.975;
        if (particle.alpha < 0.014) {
            particles.splice(index, 1);
            continue;
        }
        context.beginPath();
        context.fillStyle = `rgba(246, 245, 240, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
    }
}
function drawTitleParticles(context, particles, pointer, state, seconds, bounds, letterZones) {
    const mouseRadius = 86;
    const coreRadius = 26;
    const assembleStrength = state.isEntering ? 0.02 : state.hasAssembled ? 0.05 : 0.028;
    const pointerOnTitleBounds = pointer.isInside &&
        pointer.x > bounds.left - 84 &&
        pointer.x < bounds.right + 84 &&
        pointer.y > bounds.top - 72 &&
        pointer.y < bounds.bottom + 72;
    const pointerOnLetter = letterZones.some((zone) => pointer.x > zone.left &&
        pointer.x < zone.right &&
        pointer.y > zone.top &&
        pointer.y < zone.bottom);
    particles.forEach((particle) => {
        const breatheX = Math.sin(seconds * 1.3 + particle.phase) * 0.18;
        const breatheY = Math.cos(seconds * 1.08 + particle.phase) * 0.14;
        const targetX = particle.homeX + breatheX;
        const targetY = particle.homeY + breatheY;
        const homeAttraction = state.isEntering ? 0 : assembleStrength * (pointerOnLetter ? 0.72 : 1);
        const pointerSpeed = Math.min(18, Math.hypot(pointer.dx, pointer.dy));
        particle.vx += (targetX - particle.x) * homeAttraction;
        particle.vy += (targetY - particle.y) * homeAttraction;
        if (pointerOnLetter) {
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
                const dragForce = falloff * pointerSpeed * 0.013;
                const pushForce = falloff * 0.16 + coreFalloff * 0.32;
                const tangentialForce = falloff * pointerSpeed * 0.0025;
                particle.vx += nx * pushForce + pointer.dx * dragForce + tx * tangentialForce;
                particle.vy += ny * pushForce + pointer.dy * dragForce + ty * tangentialForce;
            }
            else {
                particle.influence *= 0.9;
            }
        }
        else {
            particle.influence *= 0.9;
        }
        particle.size += (particle.baseSize - particle.size) * 0.22;
        if (state.isEntering) {
            const centerX = state.viewportWidth * 0.5;
            const centerY = state.viewportHeight * 0.36;
            particle.vx += (particle.x - centerX) * 0.0006;
            particle.vy += (particle.y - centerY) * 0.0006;
        }
        particle.vx *= state.isEntering ? 0.97 : 0.82;
        particle.vy *= state.isEntering ? 0.97 : 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;
        const pointerDistance = Math.hypot(particle.homeX - pointer.x, particle.homeY - pointer.y);
        const alphaFade = pointerOnLetter && pointerDistance < mouseRadius
            ? Math.max(0.12, Math.min(1, (pointerDistance - coreRadius * 0.4) / (mouseRadius - coreRadius * 0.4)))
            : 1;
        context.beginPath();
        context.fillStyle = `rgba(246, 245, 240, ${particle.alpha * alphaFade * (1 - state.introProgress * 0.24)})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
    });
}
