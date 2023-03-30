import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import MouseHandler from "./MouseHandler";
import Splicer from "./Splicer";
import Fiber from "./Fiber";
import SpliceProtectionCase from "./SpliceProtectionCase";
import {parseGLTF} from "./gltf";
import {clamp} from "./common";
import Stats from "stats.js";
import {InitialState} from "./ApplicationState";
import * as Colors from "./colors";

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

        this.state = new InitialState();

        this._leftFiberPlaced = false;
        this._rightFiberPlaced = false;
        this._spliceProtectionPlaced = false;

        this.splicerAnimations = null;
        this.splicerModel = null;
        this.fiberModel = null;
        this.spliceProtectionCaseModel = null;

        this.splicer = null;
        this.controls = null;
        this.rightFiber = null;
        this.leftFiber = null;

        this.camera.position.x = 0.5;
        this.camera.position.y = 1;
        this.camera.position.z = 0.5;

        this.renderer.setClearColor(Colors.CLEAR, 1);

        this.elements = [];
        this.models = [];
        this.mouseHandler = null;

        this.spliceProtectionCase = null;
        this.fusedFiber = null;

        this.instructionsElement = null;
        this.tooltipElement = null;
        this.videoElement = null;

        this.objects = [];

        this.renderer.domElement.style.opacity = 0;
        this.renderer.domElement.style.transition = "opacity 1.5s";
    }

    get leftFiberPlaced() {
        return this._leftFiberPlaced;
    }

    set leftFiberPlaced(value) {
        const oldValue = this._leftFiberPlaced;

        if (oldValue !== value) {
            this._leftFiberPlaced = value;

            if (this.fibersPlaced) {
                this.state.onFibersPlaced();
            } else {
                this.state.onFibersRemoved();
            }
        }
    }

    get rightFiberPlaced() {
        return this._rightFiberPlaced;
    }

    set rightFiberPlaced(value) {
        const oldValue = this._rightFiberPlaced;

        if (oldValue !== value) {
            this._rightFiberPlaced = value;

            if (this.fibersPlaced) {
                this.state.onFibersPlaced();
            } else {
                this.state.onFibersRemoved();
            }
        }
    }

    get fibersPlaced() {
        return this.leftFiberPlaced && this.rightFiberPlaced;
    }

    get spliceProtectionPlaced() {
        return this._spliceProtectionPlaced;
    }

    set spliceProtectionPlaced(value) {
        const oldValue = this._spliceProtectionPlaced;

        if (oldValue !== value) {
            this._spliceProtectionPlaced = value;

            if (value) {
                this.state.onSpliceProtectionPlaced();
            } else {
                this.state.onSpliceProtectionRemoved();
            }
        }
    }

    changeState(newState) {
        console.log("Changing state: " + this.state.name + " -> " + newState.name);
        this.state = newState;
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
        this.instructionsElement = document.querySelector("#instructions");
        this.tooltipElement = document.querySelector("#tooltip");

        this.videoElement = document.querySelector("#screen-video");

        document.querySelector("#start-button").addEventListener("click", () => {
            this.instructionsElement.style.display = "block";
            const facade = document.querySelector("#facade");
            const splashScreen = document.querySelector("#splash-screen");

            facade.style.pointerEvents = "none";
            facade.style.opacity = 0;
            splashScreen.style.opacity = 0;
            splashScreen.style.pointerEvents = "none";
        });

        this.mouseHandler = new MouseHandler();

        this.videoTexture = new THREE.VideoTexture(this.videoElement);
        this.videoTexture.flipY = false;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.addObject(this.controls);
        this.addObject(this.mouseHandler);

        const Model = (await import("./Model")).default;
        const FiberModel = (await import("./FiberModel")).default;
        const SpliceProtectionCaseModel = (await import("./SpliceProtectionCaseModel")).default;

        const splicerGLTF = await parseGLTF(Model);
        this.splicerModel = splicerGLTF.scene.children[0];
        this.splicerAnimations = splicerGLTF.animations;
        this.fiberModel = (await parseGLTF(FiberModel)).scene.children[0];
        this.spliceProtectionCaseModel = (await parseGLTF(SpliceProtectionCaseModel)).scene.children[0];

        this.renderer.domElement.style.opacity = 1;

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

        this.setInstructionText("Откройте крышку сварочного аппарата");

        this.splicer.children.screen.setVideo(this.videoTexture);

        Application.stats.domElement.style.right = "0px";
        Application.stats.domElement.style.removeProperty("left");

        Application.renderer.domElement.style.position = "absolute";
        Application.renderer.domElement.style.zIndex = "1";
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
