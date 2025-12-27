import * as THREE from 'three';

export function init3DScene() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Fog to fade out items in back
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2; // Look down slightly

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Objects
    const geometryGroup = new THREE.Group();
    scene.add(geometryGroup);

    // Create a grid of "Tech Nodes" (Icosahedrons and Cubes)
    const geometries = [
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.OctahedronGeometry(0.5, 0)
    ];

    const materialWire = new THREE.MeshBasicMaterial({
        color: 0x00ff9d, // Primary green
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const materialSolid = new THREE.MeshBasicMaterial({
        color: 0x00d8ff, // Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });

    const particleCount = 40;
    const items = [];

    for (let i = 0; i < particleCount; i++) {
        const geom = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = Math.random() > 0.5 ? materialWire : materialSolid;
        const mesh = new THREE.Mesh(geom, mat);

        // Random positions spread out
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 15;

        // Random rotation speeds
        mesh.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02,
            floatSpeed: (Math.random() * 0.005) + 0.002,
            floatOffset: Math.random() * Math.PI * 2
        };

        geometryGroup.add(mesh);
        items.push(mesh);
    }

    // Add connecting lines (Cyber network effect)
    // We will update line positions in animate loop if we want them dynamic, 
    // or just static grid lines. Let's do a static "Floor" grid moving for performance while nodes float.

    const gridHelper = new THREE.GridHelper(40, 40, 0x111111, 0x111111);
    gridHelper.position.y = -3;
    scene.add(gridHelper);

    // Animation Loop
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Rotate entire group slowly
        geometryGroup.rotation.y = time * 0.1;

        // Animate individual items
        items.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotSpeedX;
            mesh.rotation.y += mesh.userData.rotSpeedY;

            // Floating bounce
            mesh.position.y += Math.sin(time + mesh.userData.floatOffset) * 0.005;
        });

        // Mouse interaction parallax (gentle)
        // camera.position.x += (mouseX - camera.position.x) * 0.05;
        // camera.position.y += (-mouseY - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}
