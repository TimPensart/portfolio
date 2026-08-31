import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader, DRACO_GLTF_CONFIG } from "three/addons/loaders/DRACOLoader.js";

const REFERENCE_FPS = 60;
const WALLPAPER_CYCLE_FRAMES = 500;

const WALLPAPER_TRANSITION_SECONDS = 0.5 / (0.01 * REFERENCE_FPS);

const LIGHTING = {
    // Exposure applied after tone mapping. Brightens or darkens everything at
    // once, without changing the balance between the lights.
    exposure: 1,

    // The stand-in for Blender's sky: a sky/horizon/ground gradient wrapped
    // around the scene and prefiltered into an environment map, so every
    // surface picks up soft light from all directions.
    environment: {
        intensity: 0.6,
        skyColor: 0xdce7f5,
        horizonColor: 0xffffff,
        groundColor: 0x7d848c,
    },

    // Flat, directionless fill.
    ambient: { color: 0xffffff, intensity: 0.08 },

    // Key light, and the one that casts the floor shadow
    key: { color: 0xffffff, intensity: 2, position: [0, 12, 0] },

    // Fill from the opposite side, so the shadow side does not go solid.
    fill: { color: 0xffffff, intensity: 0.5, position: [-7, 1, 5] },

    // Rim from behind, to separate the silhouette from the background.
    rim: { color: 0xffffff, intensity: 1, position: [-3, 5, -8] },

    screenBrightness: 1,

    shadowOpacity: 0.16,
};

/**
 * Render a rotating 3D phone into `parentElement`.
 *
 * @param {HTMLElement} parentElement Element the canvas is appended to.
 * @param {string} sceneModel URL of the .glb scene to load.
 * @returns {() => void} Teardown: stops the loop and releases the GPU
 *   resources and listeners this instance created.
 */
export default function Render3dPhone(parentElement, sceneModel) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(10, aspectRatio(), 0.1, 1000);

    const rotateSpeed = 1;

    let object;

    let mouseX = 0;
    let mouseY = 0;

    // Touch devices have no usable mouse position, so we tilt the phone from
    // the phone's scroll progress through the viewport instead (see animate()).
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    function aspectRatio() {
        return parentElement.clientHeight > 0 ? parentElement.clientWidth / parentElement.clientHeight : 1;
    }

    function computeScrollProgress() {
        const rect = parentElement.getBoundingClientRect();
        const vh = window.innerHeight;
        return Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
    }

    const wallpapers = [
        {
            materialName: "Wallpaper.002",
            startTrigger: 125,
            endTrigger: 499,
            posY: -0.15,
            posAnim: { start: 0.2, end: 0 },
        },
        {
            materialName: "Wallpaper.003",
            startTrigger: 250,
            endTrigger: 565,
            posY: -0.3,
            posAnim: { start: 0.2, end: 0 },
        },
    ].map((wallpaper) => ({
        ...wallpaper,
        mesh: null,
        animating: false,
        progress: 1,
        fromOpacity: 0,
        toOpacity: 0,
        fromPosZ: wallpaper.posAnim.start,
        toPosZ: wallpaper.posAnim.start,

        nextTrigger: wallpaper.startTrigger,
    }));

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const shadowGeometry = new THREE.PlaneGeometry(20, 20);
    shadowGeometry.rotateX(-Math.PI / 2);

    const shadowMaterial = new THREE.ShadowMaterial({ color: 0x000000 });
    shadowMaterial.opacity = LIGHTING.shadowOpacity;
    const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    function positionFloor(y) {
        shadowPlane.position.y = y;
    }

    positionFloor(-1); // placeholder until the model loads and we can fit it exactly

    function initWallpaper(wallpaper, mesh) {
        wallpaper.mesh = mesh;
        mesh.position.y = wallpaper.posY;
        mesh.position.z = wallpaper.posAnim.start;
        mesh.material.transparent = true;
        mesh.material.opacity = 0;
    }

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap; // supports a real, adjustable blur radius

    // Match the device's pixel density so the phone stays sharp on hi-DPR
    // (mobile/retina) screens. Capped at 2 to avoid overdrawing on phones
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);

    // Tone mapping maps the lit values, which are unbounded, down into display
    // range. Without it anything the lights push past 1.0 clips to flat white
    // and the highlights lose their shape. Neutral keeps hues stable as they
    // roll off; THREE.ACESFilmicToneMapping is the more contrasty alternative.
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = LIGHTING.exposure;

    // Let vertical page scrolling pass through the canvas. Without this the
    // WebGL canvas swallows touch-drags and the page gets "stuck" on mobile.
    renderer.domElement.style.touchAction = "pan-y";

    parentElement.appendChild(renderer.domElement);

    camera.position.z = 9;
    camera.position.y = -0.05;

    // --- Lights ---------------------------------------------------------
    // Everything below is driven by LIGHTING at the top of this file.

    function addDirectionalLight({ color, intensity, position }) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(position[0], position[1], position[2]);
        scene.add(light);
        return light;
    }

    /* 
    Rebuild Blender's sky as an environment map: a narrow vertical gradient
    read as an equirectangular panorama, then prefiltered by PMREM so rough
    surfaces sample a blurred version of it and polished ones a sharp one.
    */
    function createSkyEnvironment() {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 256;

        const context = canvas.getContext("2d");
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, cssColor(LIGHTING.environment.skyColor));
        gradient.addColorStop(0.5, cssColor(LIGHTING.environment.horizonColor));
        gradient.addColorStop(1, cssColor(LIGHTING.environment.groundColor));
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const panorama = new THREE.CanvasTexture(canvas);
        panorama.mapping = THREE.EquirectangularReflectionMapping;
        panorama.colorSpace = THREE.SRGBColorSpace;

        const pmrem = new THREE.PMREMGenerator(renderer);
        const environment = pmrem.fromEquirectangular(panorama).texture;

        pmrem.dispose();
        panorama.dispose();

        return environment;
    }

    function cssColor(hex) {
        return new THREE.Color(hex).getStyle();
    }

    let environmentTexture = null;

    if (LIGHTING.environment.intensity > 0) {
        environmentTexture = createSkyEnvironment();
        scene.environment = environmentTexture;
        scene.environmentIntensity = LIGHTING.environment.intensity;
    }

    const ambientLight = new THREE.AmbientLight(LIGHTING.ambient.color, LIGHTING.ambient.intensity);
    scene.add(ambientLight);

    const keyLight = addDirectionalLight(LIGHTING.key);
    addDirectionalLight(LIGHTING.fill);
    addDirectionalLight(LIGHTING.rim);

    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.radius = 320; // blur amount, raise for softer edges
    keyLight.shadow.blurSamples = 32; // smoothness of that blur, VSM-only property
    keyLight.shadow.bias = -0.0015;

    const scaledMaterials = new Set();

    function applyScreenBrightness(material) {
        if (!material || scaledMaterials.has(material)) return;
        scaledMaterials.add(material);

        if (material.isMeshBasicMaterial) {
            material.color.multiplyScalar(LIGHTING.screenBrightness);
            return;
        }

        if (material.emissive && material.emissive.getHex() !== 0x000000) {
            material.emissiveIntensity *= LIGHTING.screenBrightness;
        }
    }

    loader.load(
        sceneModel,
        function (gltf) {
            object = gltf.scene;

            object.traverse((child) => {
                if (!child.isMesh) return;

                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(applyScreenBrightness);

                if (child.parent.name === "Body001") {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                const wallpaper = wallpapers.find((candidate) => child.material?.name?.includes(candidate.materialName));

                if (wallpaper) {
                    initWallpaper(wallpaper, child);
                }
            });

            scene.add(object);

            const box = new THREE.Box3().setFromObject(object);
            const radius = box.getBoundingSphere(new THREE.Sphere()).radius || 3;

            positionFloor(box.min.y + 0.02);

            const shadowCamera = keyLight.shadow.camera;
            shadowCamera.left = -radius;
            shadowCamera.right = radius;
            shadowCamera.top = radius;
            shadowCamera.bottom = -radius;
            shadowCamera.near = 0.1;
            shadowCamera.far = keyLight.position.length() + radius * 2;
            shadowCamera.updateProjectionMatrix();
        },
        undefined,
        function (error) {
            console.error("Could not load 3D scene " + sceneModel, error);
        }
    );

    const clock = new THREE.Clock();
    let elapsed = 0;
    let animationFrameId = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function cyclePosition() {
        return ((elapsed * REFERENCE_FPS) % WALLPAPER_CYCLE_FRAMES) / REFERENCE_FPS;
    }

    function updateWallpaper(wallpaper, delta, previousCyclePosition, currentCyclePosition) {
        if (!wallpaper.mesh) return;

        const trigger = wallpaper.nextTrigger / REFERENCE_FPS;
        const wrapped = currentCyclePosition < previousCyclePosition;
        const passedTrigger = wrapped ? trigger > previousCyclePosition || trigger <= currentCyclePosition : trigger > previousCyclePosition && trigger <= currentCyclePosition;

        if (passedTrigger) {
            wallpaper.fromOpacity = wallpaper.mesh.material.opacity;
            wallpaper.toOpacity = wallpaper.fromOpacity === 0 ? 1 : 0;
            wallpaper.fromPosZ = wallpaper.mesh.position.z;
            wallpaper.toPosZ = wallpaper.mesh.position.z === wallpaper.posAnim.end ? wallpaper.posAnim.start : wallpaper.posAnim.end;
            wallpaper.progress = 0;
            wallpaper.animating = true;

            wallpaper.nextTrigger = wallpaper.nextTrigger === wallpaper.startTrigger ? wallpaper.endTrigger : wallpaper.startTrigger;
        }

        if (!wallpaper.animating) return;

        wallpaper.progress = Math.min(wallpaper.progress + delta / WALLPAPER_TRANSITION_SECONDS, 1);
        const eased = easeInOutCubic(wallpaper.progress);

        wallpaper.mesh.material.opacity = THREE.MathUtils.lerp(wallpaper.fromOpacity, wallpaper.toOpacity, eased);
        wallpaper.mesh.position.z = THREE.MathUtils.lerp(wallpaper.fromPosZ, wallpaper.toPosZ, eased);

        if (wallpaper.progress >= 1) {
            wallpaper.animating = false;
        }
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        // Clamp so a tab that was backgrounded for a minute does not fast
        // forward the whole cycle on the frame it comes back.
        const delta = Math.min(clock.getDelta(), 1 / 20);

        if (!object) return;

        if (isTouch) {
            const progress = computeScrollProgress();
            object.rotation.x = (progress - 0.5) * -3;
            object.rotation.y = Math.PI + (progress - 0.5) * 2;
        } else {
            object.rotation.x = (mouseY / window.innerHeight) * rotateSpeed;
            object.rotation.y = (Math.PI + mouseX / window.innerWidth) * rotateSpeed;
        }

        const previousCyclePosition = cyclePosition();
        elapsed += delta;
        const currentCyclePosition = cyclePosition();

        wallpapers.forEach((wallpaper) => updateWallpaper(wallpaper, delta, previousCyclePosition, currentCyclePosition));

        renderer.render(scene, camera);
    }

    function startAnimation() {
        if (animationFrameId === null) {
            clock.getDelta(); // drop the time spent off screen
            animate();
        }
    }

    function stopAnimation() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Only run the render loop while the phone is on screen. rotation.x itself
    // is driven from computeScrollProgress() inside animate(), not from here.
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            });
        },
        { threshold: 0 }
    );

    observer.observe(parentElement);

    function handleResize() {
        camera.aspect = aspectRatio();
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);
    }

    function handleMouseMove(event) {
        mouseX = event.clientX - window.innerWidth / 2;
        mouseY = event.clientY - window.innerHeight / 2;
    }

    window.addEventListener("resize", handleResize);

    // On touch the pointer position is never read, so there is no reason to
    // keep a listener alive for it.
    if (!isTouch) {
        window.addEventListener("mousemove", handleMouseMove);
    }

    return function dispose() {
        stopAnimation();
        observer.disconnect();
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);

        scene.traverse((child) => {
            if (!child.isMesh) return;
            child.geometry?.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => material?.dispose());
        });

        environmentTexture?.dispose();
        dracoLoader.dispose();
        renderer.dispose();
        renderer.domElement.remove();
    };
}
