import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Window size update
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5; // Set the camera's initial position
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

// Load texture and create material
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/293534_B2BFC5_738289_8A9AA7-256px.png'); // Ensure the texture URL is correct

const textMat = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// Load font using FontLoader
const loader = new THREE.FontLoader();
let textMesh;

loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry('Hello, 3D!', {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
    });

    // Compute bounding box to center text
    textGeometry.computeBoundingBox();

    // Create mesh with MeshMatcapMaterial
    textMesh = new THREE.Mesh(textGeometry, textMat);
    scene.add(textMesh);

    // Center the text
    const boundingBox = textGeometry.boundingBox;
    const centerOffset = new THREE.Vector3(
        -(boundingBox.max.x - boundingBox.min.x) / 2 - boundingBox.min.x,
        -(boundingBox.max.y - boundingBox.min.y) / 2 - boundingBox.min.y,
        -(boundingBox.max.z - boundingBox.min.z) / 2 - boundingBox.min.z
    );
    textMesh.position.add(centerOffset);

    // Add decorative donuts
    for (let i = 0; i < 100; i++) {
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        const donut = new THREE.Mesh(donutGeometry, donutMaterial);

        donut.position.x = (Math.random() - 0.5) * 10;
        donut.position.y = (Math.random() - 0.5) * 10;
        donut.position.z = (Math.random() - 0.5) * 10;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random() * 0.5 + 0.5;
        donut.scale.set(scale, scale, scale);

        scene.add(donut);
    }
});

// Mouse control
let targetX = 0; // Target rotation on X-axis
let targetY = 0; // Target rotation on Y-axis
let currentX = 0; // Current rotation on X-axis
let currentY = 0; // Current rotation on Y-axis
let isRotating = false; // Flag to enable rotation after double-click
let isMouseDown = false; // Flag to check if mouse is being held down

// Start rotating only after double-click
window.addEventListener('dblclick', () => {
    isRotating = !isRotating; // Toggle rotation state
    console.log(`Rotation ${isRotating ? 'enabled' : 'disabled'}`);
});

// Handle mouse down event to start rotation
window.addEventListener('mousedown', () => {
    if (isRotating) {
        isMouseDown = true; // Allow rotation while mouse is held down
    }
});

// Handle mouse up event to stop rotation
window.addEventListener('mouseup', () => {
    isMouseDown = false; // Stop rotation when mouse is released
});

// Handle mouse move to track mouse position
window.addEventListener('mousemove', (event) => {
    if (isRotating && isMouseDown) {
        // Normalize mouse position and set target rotations (reversed for inverse control)
        targetX = (event.clientX / sizes.width - 0.5) * Math.PI * 2; // Reverse X-axis (rotating opposite)
        targetY = -(event.clientY / sizes.height - 0.5) * Math.PI * 2; // Reverse Y-axis (rotating opposite)

        console.log(`Mouse moved: targetX = ${targetX}, targetY = ${targetY}`); // Debugging: Track mouse position
    }
});

// Animation loop
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    if (isRotating && isMouseDown) {
        // Smooth rotation with interpolation (lerp)
        currentX += (targetX - currentX) * 0.1; // Smoothly interpolate X-axis
        currentY += (targetY - currentY) * 0.1; // Smoothly interpolate Y-axis

        // Rotate the camera around the scene's origin
        camera.position.x = Math.sin(currentX) * 5; // Adjust radius for smooth circular movement
        camera.position.y = Math.sin(currentY) * 5; // Adjust height for vertical movement
        camera.position.z = Math.cos(currentX) * 5; // Adjust depth
        camera.lookAt(0, 0, 0); // Always look at the origin
    }

    // Render
    renderer.render(scene, camera);

    // Call next frame
    window.requestAnimationFrame(tick);
};

tick();
