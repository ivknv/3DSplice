import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import MouseHandler from "./MouseHandler";
import Splicer from "./Splicer";
import Fiber from "./Fiber";

export default class Application {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.025, 1000);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 0.8;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            this.renderer.setSize(w, h);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        });

        this.setupLights();

        this.splicer = new Splicer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.rightFiber = new Fiber();
        this.leftFiber = new Fiber();

        this.camera.position.x = 0.5;
        this.camera.position.y = 1;
        this.camera.position.z = 0.5;

        this.renderer.setClearColor(0xe0e0e0, 1);

        this.elements = [];
        this.models = [];
        this.mouseHandler = new MouseHandler(this);
    }

    addElement(element) {
        this.elements.push(element);
    }

    addModel(model) {
        this.models.push(model);
        this.scene.add(model);
    }

    async initialize() {
        await this.splicer.load();
        await this.leftFiber.load();
        await this.rightFiber.load();

        this.rightFiber.model.position.x = 0.2;
        this.rightFiber.model.position.y = 0.0528;

        this.leftFiber.setDirection("left");

        this.leftFiber.model.position.x = -0.2;
        this.leftFiber.model.position.y = 0.0528;

        this.splicer.model.position.y = -0.07;

        this.splicer.addToApplication(this);
        this.rightFiber.addToApplication(this);
        this.leftFiber.addToApplication(this);
    }

    getElementByObject(obj) {
        if (!obj) return null;

        for (const element of this.elements) {
            if (element.objects[obj.name] === obj) {
                return element;
            }
        }

        return null;
    }

    setupLights() {
        this.scene.add(new THREE.AmbientLight("white", 3));

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

            this.scene.add(light);
        }
    }

    update() {
        this.controls.update();
        this.splicer.update();
        this.rightFiber.update(this);
        this.leftFiber.update(this);
        this.mouseHandler.update(this);
    }

    animate() {
        // We do it this way to keep `this` bound
        const animateFunc = () => {
            this.update();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(animateFunc);
        };

        animateFunc();
    }
}
