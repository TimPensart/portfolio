import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader, DRACO_GLTF_CONFIG } from "three/addons/loaders/DRACOLoader.js";

// The wallpaper cycle used to be counted in frames, which made it run twice as
// fast on a 120Hz display. The timings below are still expressed as "frames at
// 60fps" because that is how they were dialled in, but they are converted to
// seconds once and the loop runs off elapsed time, so the cadence is the same
// on every display.
const REFERENCE_FPS = 60;
const WALLPAPER_CYCLE_FRAMES = 1000;

// How long one wallpaper fade takes. 0.01 of progress per frame at 60fps was
// the original value, which works out to a touch under 1.7 seconds.
const WALLPAPER_TRANSITION_SECONDS = 1 / (0.01 * REFERENCE_FPS);

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
        // A collapsed container would hand the camera a NaN aspect, which
        // blanks the canvas until the next resize.
        return parentElement.clientHeight > 0 ? parentElement.clientWidth / parentElement.clientHeight : 1;
    }

    // 0 when the phone's top hits the bottom of the viewport, 1 when its bottom
    // clears the top. Sampled once per rendered frame so it stays in sync with
    // scrolling instead of jumping between IntersectionObserver callbacks.
    function computeScrollProgress() {
        const rect = parentElement.getBoundingClientRect();
        const vh = window.innerHeight;
        return Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
    }

    // Add or remove wallpaper configs here. Each one is fully independent: its
    // own trigger offsets, its own animating state, its own targets. `mesh` is
    // filled in once the model has loaded and the matching material is found.
    const wallpapers = [
        {
            materialName: "Wallpaper.002",
            startTrigger: 250,
            endTrigger: 999,
            posY: -0.15,
            posAnim: { start: 0.2, end: 0 },
        },
        {
            materialName: "Wallpaper.003",
            startTrigger: 499,
            endTrigger: 930,
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
        // Set up front rather than during the traverse, so a wallpaper whose
        // mesh happens to be the last child visited still gets one.
        nextTrigger: wallpaper.startTrigger,
    }));

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // --- Floor / shadow ------------------------------------------------
    // No visible floor mesh. ShadowMaterial is transparent except where a
    // shadow falls, so it blends straight into your page's white background.
    const shadowGeometry = new THREE.PlaneGeometry(20, 20);
    shadowGeometry.rotateX(-Math.PI / 2);

    const shadowMaterial = new THREE.ShadowMaterial({ color: 0x000000 });
    shadowMaterial.opacity = 0.16; // tweak this to make the shadow lighter or darker
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

    loader.load(
        sceneModel,
        function (gltf) {
            object = gltf.scene;

            object.traverse((child) => {
                if (!child.isMesh) return;

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

            // Fit the floor and the light's shadow frustum to the actual model
            // instead of guessing fixed numbers.
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            const radius = Math.max(size.x, size.z) || 3;

            positionFloor(box.min.y + 0.02);

            topLight.shadow.camera.left = -radius;
            topLight.shadow.camera.right = radius;
            topLight.shadow.camera.top = radius;
            topLight.shadow.camera.bottom = -radius;
            topLight.shadow.camera.near = 0.1;
            topLight.shadow.camera.far = topLight.position.distanceTo(new THREE.Vector3(0, box.min.y, 0)) + 2;
            topLight.shadow.camera.updateProjectionMatrix();
        },
        undefined,
        function (error) {
            console.error("Could not load 3D scene " + sceneModel, error);
        }
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap; // supports a real, adjustable blur radius

    // Match the device's pixel density so the phone stays sharp on hi-DPR
    // (mobile/retina) screens. Capped at 2 to avoid overdrawing on phones
    // that report a DPR of 3+ and tanking the framerate for no visible gain.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);

    // Let vertical page scrolling pass through the canvas. Without this the
    // WebGL canvas swallows touch-drags and the page gets "stuck" on mobile.
    renderer.domElement.style.touchAction = "pan-y";

    parentElement.appendChild(renderer.domElement);

    camera.position.z = 9;
    camera.position.y = -0.05;

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(0, 16, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.radius = 320; // blur amount, raise for softer edges
    topLight.shadow.blurSamples = 32; // smoothness of that blur, VSM-only property
    topLight.shadow.bias = -0.0015;
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let animationFrameId = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // A wallpaper flips state when the cycle clock passes its next trigger.
    // Comparing positions in the cycle (rather than an exact frame count) means
    // a dropped frame delays the flip instead of skipping it entirely.
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

        dracoLoader.dispose();
        renderer.dispose();
        renderer.domElement.remove();
    };
}
