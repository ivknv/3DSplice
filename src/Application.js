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
import {clamp} from "./common";
import Stats from "stats.js";

function parseURLHashParameters() {
    const q = window.location.hash.substring(1);
    const keyValuePairs = q.split(";");

    const parameters = new Map();

    for (const keyValuePair of keyValuePairs) {
        const [key, value] = keyValuePair.split(":");
        parameters[key] = value;
    }

    return parameters;
}

export class ApplicationClass {
    constructor() {
        this.stats = new Stats();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.025, 1000);

        const hashParameters = parseURLHashParameters();

        this.statsEnabled = hashParameters["stats"] === "true";

        if (!this.statsEnabled) {
            this.stats.domElement.style.display = "none";
        }

        const rendererParameters = {
            antialias: hashParameters["antialias"] !== "false",
            depth: hashParameters["depth"] !== "false",
            stencil: hashParameters["stencil"] !== "false",
            preserveDrawingBuffer: hashParameters["preserveDrawingBuffer"] !== "false"
        };

        if (["highp", "mediump", "lowp"].indexOf(hashParameters["precision"]) !== -1) {
            rendererParameters.precision = hashParameters["precision"];
        }

        if (["high-performance", "low-power", "default"].indexOf(hashParameters["powerPreference"]) !== -1) {
            rendererParameters.powerPreference = hashParameters["powerPreference"];
        }

        const pixelRatio = parseFloat(hashParameters["pixelRatio"] || window.devicePixelRatio);

        this.renderer = new THREE.WebGLRenderer(rendererParameters);
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 0.8;
        this.renderer.physicallyCorrectLights = hashParameters["physicallyCorrectLights"] !== "false";
        this.renderer.localClippingEnabled = hashParameters["localClippingEnabled"] === "true";
        this.renderer.setPixelRatio(clamp(pixelRatio, 0.1, window.devicePixelRatio));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.clock = new THREE.Clock();
        this.clockDelta = 0;

        window.addEventListener("resize", () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            this.renderer.setSize(w, h);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        });

        const enabledLights = (hashParameters["lights"] || "left,right,back,front").split(",");

        this.setupLights(enabledLights);

        this.state = "initial";
        this.leftFiberPlaced = false;
        this.rightFiberPlaced = false;
        this.spliceCompleted = false;
        this.spliceProtectionPlaced = false;
        this.heatingCompleted = false;

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
        this.mouseHandler = null;

        this.spliceProtectionCase = null;
        this.fusedFiber = null;

        this.instructionsElement = document.querySelector("#instructions");

        this.objects = [];

        this.tooltipElement = null;
    }

    get fibersPlaced() {
        return this.leftFiberPlaced && this.rightFiberPlaced;
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

    setInstructionText(text) {
        this.instructionsElement.innerText = text;
    }

    async initialize() {
        this.mouseHandler = new MouseHandler();

        this.addObject(this.mouseHandler);
        this.addObject(this.controls);

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

        this.splicer.addToApplication();
        this.rightFiber.addToApplication();
        this.leftFiber.addToApplication();
        this.spliceProtectionCase.addToApplication();

        this.stats.showPanel(0);

        this.tooltipElement = document.querySelector("#tooltip");

        this.setInstructionText("Откройте крышку сварочного аппарата");

        this.splicer.children.lid.onOpened = () => {
            if (this.state === "initial" || this.state === "splice_completed") {
                this.setInstructionText("Поднимите зажимы для волокна");
            }
        };

        this.splicer.children.lid.onClosed = () => {
            if (this.state === "initial" && this.fibersPlaced) {
                this.setInstructionText("Нажмите кнопку SET");
            } else if (this.state === "initial" || this.state === "splice_completed") {
                this.setInstructionText("Откройте крышку сварочного аппарата");
            }
        };

        this.splicer.children.fiberClamps.onLifted = () => {
            if (this.state === "initial") {
                this.setInstructionText("Поместите волокна в сварочный аппарат");
            } else if (this.state === "splice_completed") {
                this.setInstructionText("Расположите гильзу КДЗС в центре места сварки");
            }
        };

        this.splicer.children.fiberClamps.onLowered = () => {
            if (this.state === "initial") {
                this.setInstructionText("Опустите зажимы");
            }
        };

        this.splicer.children.clampBars.onLowered = () => {
            if (this.state === "initial") {
                this.setInstructionText("Закройте крышку сварочного аппарата");
            }
        };
    }

    changeState(newState) {
        if (newState === this.state) return;

        const oldState = this.state;

        this.state = newState;
        this.onStateChanged(oldState, newState);
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

    setupLights(enabledLights) {
        this.scene.add(new THREE.AmbientLight("white", 3));

        enabledLights = enabledLights || ["back", "front", "left", "right"];

        const directionalLights = {
            back: {
                position: new THREE.Vector3(0, 100, -100),
                intensity: 10
            }, // back
            right: {
                position: new THREE.Vector3(100, 100, -100),
                intensity: 10
            }, // right
            left: {
                position: new THREE.Vector3(-100, 100, -100),
                intensity: 10
            }, // left
            front: {
                position: new THREE.Vector3(0, 20, 100),
                intensity: 10
            } // front
        };

        for (const direction of enabledLights) {
            const directionalLight = directionalLights[direction];
            if (!directionalLight) continue;

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
            this.stats.begin();
            this.clockDelta = this.clock.getDelta();

            this.update();
            this.renderer.render(this.scene, this.camera);

            this.stats.end();

            requestAnimationFrame(animateFunc);
        };

        animateFunc();
    }
}

const Application = new ApplicationClass();
export default Application;
