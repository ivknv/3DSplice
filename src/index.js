import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls"
import Splicer from './Splicer'

async function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.025, 1000);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.physicallyCorrectLights = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", function() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    })

    scene.add(new THREE.AmbientLight("white", 3));

    const directionalLights = [
        {
            position: new THREE.Vector3(0, 100, -100),
            intensity: 10
        }, // back
        {
            position: new THREE.Vector3(100, 100, -100),
            intensity: 10
        }, // right
        {
            position: new THREE.Vector3(-100, 100, -100),
            intensity: 10
        }, // left
        {
            position: new THREE.Vector3(0, 20, 100),
            intensity: 10
        }, // front
    ];

    for (const directionalLight of directionalLights) {
        const light = new THREE.DirectionalLight("white", directionalLight.intensity);
        light.position.copy(directionalLight.position);

        scene.add(light);
    }

    const splicer = new Splicer(camera, renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.x = 0.5;
    camera.position.y = 1;
    camera.position.z = 0.5;

    renderer.setClearColor(0xe0e0e0, 1);

    function animate() {
        controls.update();
        splicer.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    await splicer.load();

    splicer.model.position.y = -0.07;
    scene.add(splicer.model);

    animate();
}

main();
