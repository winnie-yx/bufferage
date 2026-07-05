import * as THREE from "three/src/Three.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ModelViewerElements = {
  canvas: HTMLCanvasElement;
  onFocusLocked?: () => void;
};

export function initModelViewer({ canvas, onFocusLocked }: ModelViewerElements) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#05070b", 9, 20);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0.2, 7.8);
  const baseFov = 34;
  const focusFov = 18.4;
  const baseCameraPosition = new THREE.Vector3(0, 0.2, 7.8);
  const focusCameraPosition = new THREE.Vector3(0, 1.42, 1.98);
  const cameraLookAt = new THREE.Vector3(0, 0, 0);
  const baseLookAt = new THREE.Vector3(0, 0.15, 0);
  const focusLookAt = new THREE.Vector3(0, 1.4, -0.04);

  const ambient = new THREE.AmbientLight("#dfe7ff", 1.35);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight("#f4e6d7", 2.6);
  keyLight.position.set(4, 5, 5.5);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight("#7fa4ff", 18, 24, 2);
  fillLight.position.set(-4.5, 1.8, 3.2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight("#86d0ff", 12, 18, 2);
  rimLight.position.set(0, 3.2, -6);
  scene.add(rimLight);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  const pedestalGlow = new THREE.Mesh(
    new THREE.CircleGeometry(2.8, 64),
    new THREE.MeshBasicMaterial({
      color: "#d8dff5",
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  pedestalGlow.rotation.x = -Math.PI / 2;
  pedestalGlow.position.y = -2.2;
  scene.add(pedestalGlow);

  const shadowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 64),
    new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -2.12;
  scene.add(shadowPlane);

  const state = {
    currentX: 0.12,
    currentY: -0.42,
    focusProgress: 0,
    targetFocus: 0,
    targetScale: 1,
    velocityX: 0,
    velocityY: 0.0026,
    isDragging: false,
    isHovering: false,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerDownMoved: false,
    loaded: false,
    focusLocked: false,
  };

  const loader = new GLTFLoader();
  loader.load("/models/computer.glb", (gltf: any) => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    gltf.scene.position.sub(center);
    const fitScale = 3.7 / Math.max(size.x, size.y, size.z, 1);
    gltf.scene.scale.setScalar(fitScale);
    const scaledSize = size.clone().multiplyScalar(fitScale);

    focusCameraPosition.set(0, scaledSize.y * 0.47, Math.max(1.68, scaledSize.z * 0.74));
    focusLookAt.set(0, scaledSize.y * 0.45, -0.04);

    modelGroup.add(gltf.scene);
    modelGroup.position.y = -0.15;
    state.loaded = true;
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const updateRayPointer = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (state.targetFocus > 0.01) {
      return;
    }

    state.isDragging = true;
    state.pointerDownMoved = false;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.velocityX = 0;
    state.velocityY = 0;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: PointerEvent) => {
    updateRayPointer(event.clientX, event.clientY);

    if (!state.isDragging) {
      return;
    }

    const deltaX = event.clientX - state.lastPointerX;
    const deltaY = event.clientY - state.lastPointerY;
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      state.pointerDownMoved = true;
    }
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;

    state.velocityY = deltaX * 0.0048;
    state.velocityX = deltaY * 0.0028;
    state.currentY += state.velocityY;
    state.currentX = THREE.MathUtils.clamp(state.currentX + state.velocityX, -0.45, 0.38);
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (state.targetFocus > 0.01 && !state.isDragging) {
      return;
    }

    state.isDragging = false;
    canvas.releasePointerCapture(event.pointerId);

    if (!state.pointerDownMoved && state.isHovering && state.loaded) {
      state.targetFocus = 1;
      state.focusLocked = false;
      state.velocityX = 0;
      state.velocityY = 0;
      canvas.style.cursor = "default";
      return;
    }

    canvas.style.cursor = state.isHovering ? "grab" : "default";
  };

  const handlePointerLeave = () => {
    pointer.set(2, 2);
    state.isHovering = false;
    if (!state.isDragging) {
      canvas.style.cursor = "default";
    }
  };

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("resize", resize);

  resize();

  renderer.setAnimationLoop((time: number) => {
    state.focusProgress = THREE.MathUtils.lerp(state.focusProgress, state.targetFocus, 0.08);

    if (!state.isDragging) {
      if (state.targetFocus < 0.01) {
        state.currentY += state.velocityY;
        state.currentX = THREE.MathUtils.clamp(state.currentX + state.velocityX, -0.45, 0.38);
        state.velocityX *= 0.92;
        state.velocityY *= 0.94;
        state.velocityY += (0.0016 - state.velocityY) * 0.018;
      } else {
        state.currentY += (0 - state.currentY) * 0.09;
        state.currentX += (0 - state.currentX) * 0.09;
        state.velocityX *= 0.8;
        state.velocityY *= 0.8;
      }
    }

    if (state.loaded) {
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(modelGroup.children, true);
      state.isHovering = intersections.length > 0;
      state.targetScale = state.targetFocus > 0.01 ? 1.02 : state.isHovering ? 1.03 : 1;

      if (!state.isDragging && state.targetFocus < 0.01) {
        canvas.style.cursor = state.isHovering ? "grab" : "default";
      }
    }

    modelGroup.rotation.y += (state.currentY - modelGroup.rotation.y) * 0.14;
    modelGroup.rotation.x += (state.currentX - modelGroup.rotation.x) * 0.14;
    const targetScale = state.targetScale;
    modelGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    modelGroup.position.y = -0.15 + (1 - state.focusProgress) * Math.sin(time * 0.0007) * 0.04;
    pedestalGlow.material.opacity = state.isHovering ? 0.12 : 0.08;

    camera.position.lerpVectors(baseCameraPosition, focusCameraPosition, state.focusProgress);
    cameraLookAt.lerpVectors(baseLookAt, focusLookAt, state.focusProgress);
    camera.fov = THREE.MathUtils.lerp(baseFov, focusFov, state.focusProgress);
    camera.updateProjectionMatrix();
    camera.lookAt(cameraLookAt);

    if (state.targetFocus > 0.99 && state.focusProgress > 0.992 && !state.focusLocked) {
      state.focusLocked = true;
      onFocusLocked?.();
    }

    renderer.render(scene, camera);
  });

  return {
    resetFocus: () => {
      state.targetFocus = 0;
      state.focusLocked = false;
      state.isDragging = false;
      state.isHovering = false;
      state.pointerDownMoved = false;
      state.velocityX = 0;
      state.velocityY = 0.0026;
      pointer.set(2, 2);
      canvas.style.cursor = "default";
    },
    destroy: () => {
      renderer.setAnimationLoop(null);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    },
  };
}
