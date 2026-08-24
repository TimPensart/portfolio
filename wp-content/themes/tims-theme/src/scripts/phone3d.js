import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader, DRACO_GLTF_CONFIG } from "three/addons/loaders/DRACOLoader.js";

export default function Render3dPhone(parentElement, sceneModel) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(10, parentElement.clientWidth / parentElement.clientHeight, 0.1, 1000);

    const rotateSpeed = 1;

    // Progress advances by this much every frame while a wallpaper transitions.
    // 1 / step is roughly the transition length in frames (about 0.5s at 60fps).
    const WALLPAPER_TRANSITION_STEP = 0.01;

    let object;

    let mouseX = 0;
    let mouseY = 0;

    // Add or remove wallpaper configs here. Each one is fully independent:
    // its own trigger offset, its own animating state, its own targets.
    let wallpapers = [
        {
            materialName: "Wallpaper.002",
            startTrigger: 250,
            endTrigger: 999,
            posY: -0.15,
            posAnim: { start: 0.2, end: 0 },
            opaAnim: { start: 0, end: 1 },
            animating: false,
        },
        {
            materialName: "Wallpaper.003",
            startTrigger: 499,
            endTrigger: 930,
            posY: -0.3,
            posAnim: { start: 0.2, end: 0 },
            opaAnim: { start: 0, end: 1 },
            animating: false,
        },
    ];

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

    loader.load(
        sceneModel,
        function (gltf) {
            object = gltf.scene;
            object.traverse((child) => {
                wallpapers = wallpapers.map((wallpaper) => {
                    if (child.isMesh && child.parent.name == "Body001") {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }

                    if (child.material?.name?.includes(wallpaper.materialName)) {
                        const merged = { ...wallpaper, ...child };
                        merged.mesh = child; // real reference to the mesh, needed to toggle castShadow later
                        merged.position.y = wallpaper.posY;
                        merged.position.z = merged.posAnim.start;
                        merged.material.transparent = true;
                        merged.material.opacity = merged.opaAnim.start;
                        merged.progress = 1;
                        merged.fromOpacity = merged.opaAnim.start;
                        merged.toOpacity = merged.opaAnim.start;
                        merged.fromPosZ = merged.posAnim.start;
                        merged.toPosZ = merged.posAnim.start;
                        return merged;
                    }
                    wallpaper.triggerOffset = wallpaper.startTrigger;
                    return wallpaper;
                });
            });
            scene.add(object);

            // Fit the floor and the light's shadow frustum to the actual model
            // instead of guessing fixed numbers.
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            const radius = Math.max(size.x, size.z) * 1 || 3;

            positionFloor(box.min.y + 0.02);

            topLight.shadow.camera.left = -radius;
            topLight.shadow.camera.right = radius;
            topLight.shadow.camera.top = radius;
            topLight.shadow.camera.bottom = -radius;
            topLight.shadow.camera.near = 0.1;
            topLight.shadow.camera.far = topLight.position.distanceTo(new THREE.Vector3(0, box.min.y, 0)) + 2;
            topLight.shadow.camera.updateProjectionMatrix();
        },
        function (xhr) {},
        function (error) {
            console.error(error);
        }
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap; // supports a real, adjustable blur radius

    renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);

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

    let counter = 0;

    let animationFrameId = null;

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        if (!object) return;
        object.rotation.x = (mouseY / window.innerHeight) * rotateSpeed;
        object.rotation.y = (Math.PI + mouseX / window.innerWidth) * rotateSpeed;

        wallpapers.forEach((wallpaper) => {
            if (wallpaper.material === undefined) return;

            if (counter % 1000 === wallpaper.triggerOffset) {
                wallpaper.fromOpacity = wallpaper.material.opacity;
                wallpaper.toOpacity = wallpaper.fromOpacity === 0 ? 1 : 0;
                wallpaper.fromPosZ = wallpaper.position.z;
                wallpaper.toPosZ = wallpaper.position.z === wallpaper.posAnim.end ? wallpaper.posAnim.start : wallpaper.posAnim.end;
                wallpaper.progress = 0;
                wallpaper.animating = true;

                wallpaper.triggerOffset = wallpaper.triggerOffset == wallpaper.startTrigger ? wallpaper.endTrigger : wallpaper.startTrigger;
            }

            if (wallpaper.animating) {
                wallpaper.progress = Math.min(wallpaper.progress + WALLPAPER_TRANSITION_STEP, 1);
                const eased = easeInOutCubic(wallpaper.progress);

                wallpaper.material.opacity = THREE.MathUtils.lerp(wallpaper.fromOpacity, wallpaper.toOpacity, eased);
                wallpaper.position.z = THREE.MathUtils.lerp(wallpaper.fromPosZ, wallpaper.toPosZ, eased);

                if (wallpaper.progress >= 1) {
                    wallpaper.animating = false;
                }
            }
        });

        counter += 1;

        renderer.render(scene, camera);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function startAnimation() {
        if (animationFrameId === null) {
            animate();
        }
    }

    function stopAnimation() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startAnimation();
                    console.log(entry);
                } else {
                    stopAnimation();
                }
            });
        },
        { threshold: 0 }
    );

    observer.observe(parentElement);

    window.addEventListener("resize", function () {
        camera.aspect = parentElement.clientWidth / parentElement.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);
    });

    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX - window.innerWidth / 2;
        mouseY = e.clientY - window.innerHeight / 2;
    });
}
