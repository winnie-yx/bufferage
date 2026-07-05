import gsap from "gsap";
import * as THREE from "three/src/Three.js";
const posterImageConfigs = {
    "01": { src: "/images/moral-judgment-object.png", scale: 0.98 },
    "02": { src: "/images/temporal-discontinuity-object.png", scale: 0.82 },
    "03": { src: "/images/capability-boundary-object.png", scale: 0.86 },
    "04": { src: "/images/risk-assessment-object.png" },
    "05": { src: "/images/memory-interference-object.png", scale: 0.52 },
    "06": { src: "/images/social-gaze-object.png", scale: 0.98 },
    "07": { src: "/images/emotional-conflict-object.png" },
    "08": { src: "/images/value-system-conflict-object.png", scale: 0.82 },
    "09": { src: "/images/fear-of-irreversibility-object.png", scale: 0.82, rotation: 0.2, offsetX: 24 },
};
const posters = [
    { id: "01", title: "道德判断", english: "Moral Judgment", blurb: "A pause between what feels right, what seems fair, and what can still be justified.", accent: ["#8f5f69", "#2b2226"], size: [1.48, 1.96] },
    { id: "02", title: "时间感断裂", english: "Temporal Discontinuity", blurb: "The mind slips between past memory and future consequence before choosing the present act.", accent: ["#62708e", "#202631"], size: [1.48, 1.96] },
    { id: "03", title: "能力边界", english: "Capability Boundary", blurb: "Hesitation appears when desire exceeds skill and the self meets its own unfinished edge.", accent: ["#7d7560", "#2d2a24"], size: [1.48, 1.96] },
    { id: "04", title: "风险评估", english: "Risk Assessment", blurb: "Every option holds a hidden cost, and judgment stalls while danger is measured against gain.", accent: ["#56766d", "#202827"], size: [1.48, 1.96] },
    { id: "05", title: "记忆干扰", english: "Memory Interference", blurb: "Old impressions return at the wrong moment and blur what should have been a simple decision.", accent: ["#8c6d57", "#2d241f"], size: [1.48, 1.96] },
    { id: "06", title: "社会凝视", english: "Social Gaze", blurb: "The imagined eyes of others reshape private choices long before any answer is spoken aloud.", accent: ["#665b7f", "#231f2b"], size: [1.48, 1.96] },
    { id: "07", title: "情感冲突", english: "Emotional Conflict", blurb: "Love, fear, care, and anger pull together, leaving the decision suspended between impulses.", accent: ["#5a7081", "#20262c"], size: [1.48, 1.96] },
    { id: "08", title: "价值系统冲突", english: "Value System Conflict", blurb: "Different beliefs demand different futures, and hesitation lives in their unresolved collision.", accent: ["#875862", "#2a2023"], size: [1.48, 1.96] },
    { id: "09", title: "不可逆性恐惧", english: "Fear of Irreversibility", blurb: "Some choices feel permanent, and the hand slows down before crossing an imagined point of no return.", accent: ["#7f7872", "#282523"], size: [1.48, 1.96] },
];
const sphereRadius = 2.02;
const defaultRotationSpeed = 0.0027;
const hoveredRotationSpeed = 0.00075;
const blankAreaBoost = 0.00215;
const dragRotationForceX = 0.0048;
const dragRotationForceY = 0.0042;
export function initPortfolioShowcase({ canvas, onSelect }) {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#020202", 10, 18);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
    camera.position.set(0, 0, 10.8);
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.15);
    scene.add(ambientLight);
    const keyLight = new THREE.PointLight("#f7f0e6", 30, 24, 2);
    keyLight.position.set(3.6, 4.5, 6.5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight("#6b78ff", 18, 18, 2);
    rimLight.position.set(-5.2, 1.8, -3.8);
    scene.add(rimLight);
    const bottomLight = new THREE.PointLight("#d89058", 12, 18, 2);
    bottomLight.position.set(0, -5.5, 4.5);
    scene.add(bottomLight);
    const stage = new THREE.Group();
    stage.rotation.x = THREE.MathUtils.degToRad(-10);
    stage.position.y = 0.12;
    scene.add(stage);
    const ball = new THREE.Group();
    stage.add(ball);
    const haze = new THREE.Mesh(new THREE.CircleGeometry(5.6, 72), new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.055,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }));
    haze.position.z = -3.2;
    stage.add(haze);
    const floorGlow = new THREE.Mesh(new THREE.CircleGeometry(6.8, 72), new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.028,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }));
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = -4.6;
    stage.add(floorGlow);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(2, 2);
    const spherePoints = fibonacciSphere(posters.length, sphereRadius);
    const posterItems = posters.map((poster, index) => {
        let posterTexture;
        const canvasTextureSource = createPosterTexture(poster, () => {
            if (posterTexture) {
                posterTexture.needsUpdate = true;
            }
        });
        posterTexture = new THREE.CanvasTexture(canvasTextureSource);
        posterTexture.colorSpace = THREE.SRGBColorSpace;
        posterTexture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({
            map: posterTexture,
            transparent: true,
            opacity: 0.84,
            depthTest: false,
            depthWrite: false,
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(poster.size[0], poster.size[1]), material);
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(poster.size[0] * 1.12, poster.size[1] * 1.12), new THREE.MeshBasicMaterial({
            color: poster.accent[0],
            transparent: true,
            opacity: 0.06,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
        }));
        const group = new THREE.Group();
        const point = spherePoints[index];
        const vector = new THREE.Vector3(point.x, point.y, point.z);
        const depthFactor = THREE.MathUtils.clamp((point.z + sphereRadius) / (sphereRadius * 2), 0, 1);
        const baseScale = THREE.MathUtils.lerp(0.9, 1.03, depthFactor);
        group.position.copy(vector);
        group.lookAt(vector.clone().multiplyScalar(2));
        group.scale.setScalar(baseScale);
        glow.position.z = -0.04;
        group.add(glow);
        group.add(plane);
        ball.add(group);
        return {
            id: index,
            definition: poster,
            group,
            plane,
            material,
            glow,
            baseScale,
        };
    });
    const state = {
        hoveredId: -1,
        rotationX: 0.42,
        rotationY: -0.64,
        rotationVelocityX: 0.00055,
        rotationVelocityY: defaultRotationSpeed,
        targetVelocityY: defaultRotationSpeed,
        targetVelocityX: 0.00055,
        blankBoost: 0,
        isDragging: false,
        dragLastX: 0,
        dragLastY: 0,
        dragVelocityX: 0,
        dragVelocityY: 0,
        pointerDownMoved: false,
    };
    const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    const setHoveredItem = (nextId) => {
        if (state.hoveredId === nextId)
            return;
        state.hoveredId = nextId;
        state.targetVelocityY = nextId >= 0 ? hoveredRotationSpeed : defaultRotationSpeed;
        state.targetVelocityX = nextId >= 0 ? 0.00018 : 0.00055;
        canvas.style.cursor = nextId >= 0 ? "pointer" : "default";
        posterItems.forEach((item) => {
            const isActive = item.id === nextId;
            gsap.killTweensOf(item.group.scale);
            gsap.killTweensOf(item.material);
            gsap.killTweensOf(item.glow.material);
            gsap.to(item.group.scale, {
                x: item.baseScale * (isActive ? 1.2 : 1),
                y: item.baseScale * (isActive ? 1.2 : 1),
                z: item.baseScale * (isActive ? 1.2 : 1),
                duration: 0.7,
                ease: "power3.out",
            });
            gsap.to(item.material, {
                opacity: isActive ? 1 : 0.84,
                duration: 0.6,
                ease: "power2.out",
            });
            gsap.to(item.glow.material, {
                opacity: isActive ? 0.16 : 0.06,
                duration: 0.6,
                ease: "power2.out",
            });
        });
    };
    const updatePointer = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };
    const pickPosterAtPointer = () => {
        raycaster.setFromCamera(pointer, camera);
        const intersections = raycaster.intersectObjects(posterItems.map((item) => item.plane), false);
        if (intersections.length === 0) {
            return null;
        }
        const hoveredPlane = intersections[0]?.object;
        return posterItems.find((item) => item.plane === hoveredPlane) ?? null;
    };
    const handlePointerDown = (event) => {
        state.isDragging = true;
        state.pointerDownMoved = false;
        state.dragLastX = event.clientX;
        state.dragLastY = event.clientY;
        state.dragVelocityX = 0;
        state.dragVelocityY = 0;
        canvas.setPointerCapture(event.pointerId);
    };
    const handlePointerMove = (event) => {
        updatePointer(event.clientX, event.clientY);
        if (!state.isDragging) {
            return;
        }
        const deltaX = event.clientX - state.dragLastX;
        const deltaY = event.clientY - state.dragLastY;
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            state.pointerDownMoved = true;
        }
        state.dragLastX = event.clientX;
        state.dragLastY = event.clientY;
        state.dragVelocityY = deltaX * dragRotationForceX;
        state.dragVelocityX = deltaY * dragRotationForceY;
        state.rotationY += state.dragVelocityY;
        state.rotationX += state.dragVelocityX;
    };
    const handlePointerUp = (event) => {
        if (!state.isDragging) {
            return;
        }
        updatePointer(event.clientX, event.clientY);
        state.isDragging = false;
        canvas.releasePointerCapture(event.pointerId);
        if (!state.pointerDownMoved && onSelect) {
            const selected = pickPosterAtPointer();
            if (selected) {
                onSelect(selected.definition.id);
            }
        }
    };
    const handlePointerLeave = () => {
        if (!state.isDragging) {
            pointer.set(2, 2);
            setHoveredItem(-1);
            state.blankBoost = 0;
        }
    };
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);
    resize();
    renderer.setAnimationLoop((time) => {
        state.rotationVelocityY = THREE.MathUtils.lerp(state.rotationVelocityY, state.targetVelocityY + state.blankBoost, 0.045);
        state.rotationVelocityX = THREE.MathUtils.lerp(state.rotationVelocityX, state.targetVelocityX, 0.045);
        state.dragVelocityX *= 0.92;
        state.dragVelocityY *= 0.92;
        if (!state.isDragging) {
            state.rotationY += state.rotationVelocityY + state.dragVelocityY;
            state.rotationX += state.rotationVelocityX + state.dragVelocityX;
        }
        ball.rotation.y = state.rotationY;
        ball.rotation.x = Math.sin(time * 0.00028) * 0.12 + state.rotationX;
        ball.rotation.z = 0;
        stage.rotation.y = 0;
        stage.rotation.z = 0;
        stage.position.y = 0.12 + Math.sin(time * 0.00045) * 0.04;
        haze.material.opacity = 0.048 + Math.sin(time * 0.00042) * 0.012;
        if (!state.isDragging) {
            const hoveredItem = pickPosterAtPointer();
            if (hoveredItem) {
                state.blankBoost = 0;
                setHoveredItem(hoveredItem.id);
            }
            else if (state.hoveredId !== -1) {
                setHoveredItem(-1);
                state.blankBoost = blankAreaBoost;
            }
            else {
                state.blankBoost = THREE.MathUtils.lerp(state.blankBoost, blankAreaBoost, 0.08);
            }
        }
        else {
            state.blankBoost = 0;
            if (state.hoveredId !== -1) {
                setHoveredItem(-1);
            }
        }
        posterItems.forEach((item) => {
            item.plane.lookAt(camera.position);
            item.glow.lookAt(camera.position);
        });
        const depthOrdering = posterItems
            .map((item) => {
            const position = new THREE.Vector3();
            item.group.getWorldPosition(position);
            return { item, depth: position.z };
        })
            .sort((a, b) => a.depth - b.depth);
        depthOrdering.forEach((entry, index) => {
            entry.item.group.renderOrder = index;
            entry.item.plane.renderOrder = index;
            entry.item.glow.renderOrder = index - 0.5;
        });
        renderer.render(scene, camera);
    });
    return () => {
        renderer.setAnimationLoop(null);
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerup", handlePointerUp);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
        renderer.dispose();
    };
}
function fibonacciSphere(count, radius) {
    const points = [];
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));
    for (let index = 0; index < count; index += 1) {
        const y = index * offset - 1 + offset / 2;
        const distance = Math.sqrt(1 - y * y);
        const phi = index * increment;
        points.push({
            x: Math.cos(phi) * distance * radius,
            y: y * radius,
            z: Math.sin(phi) * distance * radius,
        });
    }
    return points;
}
function createPosterTexture(poster, onUpdate) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 768;
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Unable to create poster context");
    }
    const gradient = context.createLinearGradient(0, 0, 768, 768);
    gradient.addColorStop(0, poster.accent[0]);
    gradient.addColorStop(1, poster.accent[1]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 768, 768);
    const paperNoise = context.createLinearGradient(0, 0, 768, 768);
    paperNoise.addColorStop(0, "rgba(255,255,255,0.08)");
    paperNoise.addColorStop(1, "rgba(0,0,0,0.14)");
    context.fillStyle = paperNoise;
    context.fillRect(0, 0, 768, 768);
    context.fillStyle = "rgba(255,255,255,0.03)";
    for (let index = 0; index < 120; index += 1) {
        const x = (index * 71) % 768;
        const y = (index * 53) % 768;
        context.fillRect(x, y, 2, 2);
    }
    context.fillStyle = "rgba(24, 23, 25, 0.88)";
    context.fillRect(44, 44, 680, 680);
    context.strokeStyle = "rgba(255,255,255,0.08)";
    context.lineWidth = 2;
    context.strokeRect(44, 44, 680, 680);
    context.fillStyle = "rgba(255,255,255,0.05)";
    context.save();
    context.translate(112, 70);
    context.rotate(-0.18);
    context.fillRect(0, 0, 118, 26);
    context.restore();
    context.save();
    context.translate(548, 62);
    context.rotate(0.14);
    context.fillRect(0, 0, 96, 24);
    context.restore();
    context.fillStyle = "rgba(255,255,255,0.32)";
    context.font = "500 16px 'Helvetica Neue', Arial, sans-serif";
    context.fillText(`BUFFERAGE / ${poster.id}`, 82, 94);
    context.fillStyle = "rgba(234, 226, 215, 0.96)";
    context.font = "700 92px 'Caveat', 'Bradley Hand', 'Segoe Script', cursive";
    wrapText(context, poster.english, 82, 186, 612, 78);
    const imageY = 296;
    const imageHeight = 292;
    const posterImageConfig = posterImageConfigs[poster.id];
    const posterImageSource = posterImageConfig?.src;
    const frameGradient = context.createLinearGradient(120, imageY, 648, imageY + imageHeight);
    frameGradient.addColorStop(0, "rgba(255,255,255,0.06)");
    frameGradient.addColorStop(1, "rgba(255,255,255,0.015)");
    context.fillStyle = posterImageSource ? "rgba(12, 12, 14, 0.18)" : frameGradient;
    context.fillRect(120, imageY, 528, imageHeight);
    const imageGlow = context.createRadialGradient(384, imageY + 136, 28, 384, imageY + 146, 320);
    imageGlow.addColorStop(0, "rgba(255,255,255,0.22)");
    imageGlow.addColorStop(0.12, "rgba(255,255,255,0.12)");
    imageGlow.addColorStop(0.6, "rgba(255,255,255,0.04)");
    imageGlow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = imageGlow;
    context.fillRect(120, imageY, 528, imageHeight);
    if (posterImageSource) {
        const image = new Image();
        image.onload = () => {
            context.clearRect(120, imageY, 528, imageHeight);
            context.fillStyle = "rgba(12, 12, 14, 0.18)";
            context.fillRect(120, imageY, 528, imageHeight);
            const sourceRatio = image.width / image.height;
            const frameRatio = 528 / imageHeight;
            let drawWidth = 528;
            let drawHeight = imageHeight;
        if (sourceRatio > frameRatio) {
            drawHeight = imageHeight * 0.9;
            drawWidth = drawHeight * sourceRatio;
        }
        else {
            drawWidth = 528 * (posterImageConfig?.scale ?? 0.72);
            drawHeight = drawWidth / sourceRatio;
        }
        const drawX = 120 + (528 - drawWidth) / 2 + (posterImageConfig?.offsetX ?? 0);
        const drawY = imageY + (imageHeight - drawHeight) / 2 + (posterImageConfig?.offsetY ?? 0);
        const rotation = posterImageConfig?.rotation ?? 0;
        if (rotation !== 0) {
            context.save();
            context.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
            context.rotate(rotation);
            context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
            context.restore();
        }
        else {
            context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        }
            context.fillStyle = imageGlow;
            context.fillRect(120, imageY, 528, imageHeight);
            onUpdate?.();
        };
        image.src = posterImageSource;
    }
    else {
        context.fillStyle = "rgba(255,255,255,0.26)";
        context.font = "500 22px 'Helvetica Neue', Arial, sans-serif";
        context.textAlign = "center";
        context.fillText("IMAGE PLACEHOLDER", 384, imageY + 154);
        context.textAlign = "left";
    }
    if (!posterImageSource) {
        context.strokeStyle = "rgba(255,255,255,0.09)";
        context.lineWidth = 2;
        context.strokeRect(120, imageY, 528, imageHeight);
    }
    context.fillStyle = "rgba(234, 226, 215, 0.82)";
    context.font = "400 24px 'Iowan Old Style', 'Times New Roman', serif";
    wrapText(context, poster.blurb, 84, 638, 598, 34);
    context.fillStyle = "rgba(234, 226, 215, 0.64)";
    context.fillRect(84, 694, 132, 8);
    context.fillStyle = "rgba(255,255,255,0.34)";
    context.font = "500 15px 'Helvetica Neue', Arial, sans-serif";
    context.fillText("Nine dimensions of hesitation", 84, 716);
    return canvas;
}
function wrapText(context, text, x, startY, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let y = startY;
    words.forEach((word) => {
        const next = line ? `${line} ${word}` : word;
        const width = context.measureText(next).width;
        if (width > maxWidth && line) {
            context.fillText(line, x, y);
            line = word;
            y += lineHeight;
            return;
        }
        line = next;
    });
    if (line) {
        context.fillText(line, x, y);
    }
}
