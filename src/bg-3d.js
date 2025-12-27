import * as THREE from 'three';

export function init3DScene() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // --- Configuration & Adaptive Scaling ---
    const width = container.clientWidth;
    const isMobile = width < 768;
    const densityMultiplier = isMobile ? 0.5 : 1.0;

    // Scene Setup
    const scene = new THREE.Scene();
    // Dark space fog
    scene.fog = new THREE.FogExp2(0x050505, 0.04);

    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = isMobile ? 12 : 8;
    camera.position.y = 1.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Interaction State ---
    const mouse = new THREE.Vector2(0, 0);
    const targetCameraPos = new THREE.Vector3(0, 1.5, camera.position.z);

    const onMouseMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // --- Elements ---

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Starfield / Particle Cloud
    const starCount = Math.floor(2000 * densityMultiplier);
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
        starPositions[i] = (Math.random() - 0.5) * 60;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0x00ff9d,
        size: 0.05,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    worldGroup.add(stars);

    // 2. Data Streams (Moving Lines)
    const streamCount = Math.floor(15 * densityMultiplier);
    const streams = [];
    for (let i = 0; i < streamCount; i++) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 10 + Math.random() * 20)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x00d8ff,
            transparent: true,
            opacity: Math.random() * 0.3
        });
        const line = new THREE.Line(lineGeom, lineMat);
        line.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 30
        );
        line.userData = { speed: 0.05 + Math.random() * 0.1 };
        worldGroup.add(line);
        streams.push(line);
    }

    // 3. Tech Nodes (Icosahedrons, Cubes, Tetrahedrons)
    const geometryGroup = new THREE.Group();
    worldGroup.add(geometryGroup);

    const geometries = [
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.TetrahedronGeometry(0.4, 0),
        new THREE.OctahedronGeometry(0.5, 0)
    ];

    const materialWire = new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });

    const materialSolid = new THREE.MeshBasicMaterial({
        color: 0x00d8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });

    const particleCount = Math.floor(40 * densityMultiplier);
    const items = [];

    for (let i = 0; i < particleCount; i++) {
        const geom = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = Math.random() > 0.6 ? materialWire : materialSolid;
        const mesh = new THREE.Mesh(geom, mat);

        mesh.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 20
        );

        mesh.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.015,
            rotSpeedY: (Math.random() - 0.5) * 0.015,
            floatSpeed: (Math.random() * 0.005) + 0.002,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: mesh.position.y
        };

        geometryGroup.add(mesh);
        items.push(mesh);
    }

    // 4. Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x111111, 0x111111);
    gridHelper.position.y = -6;
    worldGroup.add(gridHelper);

    // --- Animation Loop ---
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Mouse Parallax Effect
        targetCameraPos.x = mouse.x * 2;
        targetCameraPos.y = 1.5 + (mouse.y * 1);
        camera.position.lerp(targetCameraPos, 0.05);
        camera.lookAt(0, 0, 0);

        // Rotate entire group slowly
        geometryGroup.rotation.y = time * 0.05;
        stars.rotation.y = time * 0.02;

        // Animate individual items
        items.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotSpeedX;
            mesh.rotation.y += mesh.userData.rotSpeedY;
            mesh.position.y = mesh.userData.originalY + Math.sin(time + mesh.userData.floatOffset) * 0.3;
        });

        // Animate Data Streams
        streams.forEach(line => {
            line.position.z += line.userData.speed;
            if (line.position.z > 20) {
                line.position.z = -30;
            }
        });

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

        // Update FOV for mobile responsiveness
        if (newWidth < 768) {
            camera.position.z = 12;
        } else {
            camera.position.z = 8;
        }
    });
}
