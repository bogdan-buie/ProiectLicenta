import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import './Home.css';

const Home = () => {
    const canvasRef = useRef();

    useEffect(() => {
        // Curățăm toți copiii din div
        while (canvasRef.current.firstChild) {
            canvasRef.current.removeChild(canvasRef.current.firstChild);
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        // Creăm textura pentru stele
        const starTexture = new THREE.TextureLoader().load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, map: starTexture, transparent: true });

        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = THREE.MathUtils.randFloatSpread(2000);
            const y = THREE.MathUtils.randFloatSpread(2000);
            const z = THREE.MathUtils.randFloatSpread(2000);
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Adăugăm Soarele ca sursă de lumină
        const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        const sunLight = new THREE.PointLight(0xffffff, 2, 100);
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);

        // Adăugăm lumină ambientală și direcțională suplimentară
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Funcție pentru a crea planete
        const createPlanet = (size, color, distance, orbitSpeed) => {
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color });
            const planet = new THREE.Mesh(geometry, material);
            planet.userData = { distance, orbitSpeed, angle: Math.random() * Math.PI * 2 };
            return planet;
        };

        // Creăm planetele
        const planets = [];
        planets.push(createPlanet(0.5, 0xaaaaaa, 4, 0.02)); // Mercur
        planets.push(createPlanet(0.6, 0xffa500, 6, 0.015)); // Venus
        planets.push(createPlanet(0.7, 0x0000ff, 8, 0.01)); // Pământ
        planets.push(createPlanet(0.4, 0xff4500, 10, 0.008)); // Marte
        planets.push(createPlanet(1.2, 0xffff00, 14, 0.005)); // Jupiter
        planets.push(createPlanet(1, 0xffe4b5, 18, 0.003)); // Saturn
        planets.push(createPlanet(0.8, 0xadd8e6, 22, 0.002)); // Uranus
        planets.push(createPlanet(0.7, 0x4169e1, 26, 0.001)); // Neptun

        planets.forEach(planet => {
            scene.add(planet);
        });

        // Poziționarea camerei
        camera.position.z = 30;

        // Postprocesare pentru bloom
        const renderScene = new RenderPass(scene, camera);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0.1;
        bloomPass.strength = 1.5;
        bloomPass.radius = 0.4;

        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        const clock = new THREE.Clock();

        // Funcție de animație
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Animație pentru planete
            planets.forEach(planet => {
                planet.userData.angle += planet.userData.orbitSpeed;
                planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
                planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
            });

            composer.render();
        };

        animate();

        // Funcție de redimensionare
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            composer.dispose();
        };
    }, []);

    return (
        <div className="home-container">
            <div className="header">
                <h1>Welcome to ThreeJS IDE</h1>
                <p>Create, Share, and Explore 3D projects with ThreeJS</p>
            </div>
            <div className="threejs-container" ref={canvasRef} />
            <div className="info-section">
                <h2>About Our App</h2>
                <p>info</p>
            </div>
        </div>
    );
};

export default Home;
