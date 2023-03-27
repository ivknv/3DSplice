import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import MouseHandler from "./MouseHandler";
import Splicer from "./Splicer";
import Fiber from "./Fiber";
import SpliceProtectionCase from "./SpliceProtectionCase";
import SpliceProtectionCaseModel from "./SpliceProtectionCaseModel";
import Model from "./Model";
import FiberModel from "./FiberModel";
import {parseGLTF} from "./gltf";

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

        this.state = "initial";

        this.splicerAnimations = null;
        this.splicerModel = null;
        this.fiberModel = null;
        this.spliceProtectionCaseModel = null;

        this.splicer = null;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.rightFiber = null;
        this.leftFiber = null;

        this.camera.position.x = 0.5;
        this.camera.position.y = 1;
        this.camera.position.z = 0.5;

        this.renderer.setClearColor(0xe0e0e0, 1);

        this.elements = [];
        this.models = [];
        this.mouseHandler = new MouseHandler(this);

        this.spliceProtectionCase = null;
        this.fusedFiber = null;

        this.objects = [];

        this.addObject(this.mouseHandler);
        this.addObject(this.controls);
    }

    addObject(object) {
        this.objects.push(object);
    }

    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index > -1) this.objects.splice(index, 1);
    }

    addElement(element) {
        this.elements.push(element);
    }

    removeElement(element) {
        const index = this.elements.indexOf(element);
        if (index > -1) this.elements.splice(index, 1);
    }

    addModel(model) {
        this.models.push(model);
        this.scene.add(model);
    }

    removeModel(model) {
        const index = this.models.indexOf(model);
        if (index > -1) this.models.splice(index, 1);

        this.scene.remove(model);
    }

    async initialize() {
        const splicerGLTF = await parseGLTF(Model);
        this.splicerModel = splicerGLTF.scene.children[0];
        this.splicerAnimations = splicerGLTF.animations;
        this.fiberModel = (await parseGLTF(FiberModel)).scene.children[0];
        this.spliceProtectionCaseModel = (await parseGLTF(SpliceProtectionCaseModel)).scene.children[0];

        this.splicer = new Splicer(this.splicerModel, this.splicerAnimations);
        this.leftFiber = new Fiber(this.fiberModel.clone(), "left");
        this.rightFiber = new Fiber(this.fiberModel.clone(), "right");
        this.spliceProtectionCase = new SpliceProtectionCase(this.spliceProtectionCaseModel);

        this.spliceProtectionCase.setPosition(0.098, 0.0527, 0.0008);

        this.rightFiber.setTipPosition(0.07, 0.052, 0.001);
        this.leftFiber.setTipPosition(-0.07, 0.052, 0.001);

        this.splicer.model.position.y = -0.07;

        this.splicer.addToApplication(this);
        this.rightFiber.addToApplication(this);
        this.leftFiber.addToApplication(this);
        this.spliceProtectionCase.addToApplication(this);
    }

    getElementByObject(obj) {
        if (!obj) return null;

        const predicate = x => {
            for (const uuid in x.objects) {
                if (x.objects[uuid] === obj) return true;
            }

            return false;
        };

        for (const element of this.elements) {
            if (predicate(element)) return element;

            const result = element.findElement(predicate);
            if (result) return result;
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
        for (const object of this.objects) {
            object.update(this);
        }

        for (const element of this.elements) {
            element.update(this);
        }
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
