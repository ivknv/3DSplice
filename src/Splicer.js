import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import Model from "./static/fujikura_fsm-30s.glb";
import AnimatedSplicerElement from "./AnimatedSplicerElement";
import SplicerElement from "./SplicerElement";
import MouseHandler from "./MouseHandler";

class LidElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Splice_Lid", "Cube057", "Cube058", "Cube059"], "Open Lid");
    }
}

class ClampBarsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, [
            "Fiber_Clamp_Bar", "Fiber_Clamp_Handle", "Fiber_Clamp_Bar_End",
            "Fiber_Clamp_Presser_Leg", "Cube068", "Cube068_1", "Screw010"
        ], "Lift Up Clamp Bar");
    }
}

class FiberClampsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, [
            "Cube054_1", "Cube054_2", "Fiber_Cladding_Clamp_(outer)",
        ], "Lift Up Clamp");
    }
}

class ScreenElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Screen"], "Rotate Screen");
    }
}

class ScreenBearingElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Cube108", "Cube108_1", "Screen_Hinge", "Screen_Hinge001"], "Rotate Screen Bearing");
    }
}

class HeaterMainLidElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Heater_Lid", "Cube014"], "Open Heating Chamber Lid");
    }
}

class HeaterSideLidsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Cube016"], "Lift Up Heating Chamber Side Lid");
    }
}

class SetButtonElement extends SplicerElement {
    constructor(splicer) {
        super(splicer, ["Cube135", "Cube135_1"]);
    }
};

class ResetButtonElement extends SplicerElement {
    constructor(splicer) {
        super(splicer, ["Cube136", "Cube136_1"]);
    }
};

class HeatButtonElement extends SplicerElement {
    constructor(splicer) {
        super(splicer, ["Cube137", "Cube137_1"]);
    }
};

export default class Splicer {
    constructor(camera, rootElement) {
        this.model = null;
        this.animations = null;
        this.mixer = null;
        this.loader = new GLTFLoader();
        this.camera = camera;
        this.elements = {};

        this.mouseHandler = new MouseHandler(rootElement);
    }

    getElementByObjectName(objectName) {
        for (const elementName in this.elements) {
            const element = this.elements[elementName];

            if (objectName in element.objects) return element;
        }

        return null;
    }

    async load() {
        const gltf = await this.loader.loadAsync(Model);
        this.model = gltf.scene.children[0];
        this.animations = gltf.animations;
        this.mixer = new THREE.AnimationMixer(this.model);
        this.elements = {
            lid: new LidElement(this),
            clampBars: new ClampBarsElement(this),
            fiberClamps: new FiberClampsElement(this),
            screen: new ScreenElement(this),
            screenBearing: new ScreenBearingElement(this),
            mainHeaterLid: new HeaterMainLidElement(this),
            heaterSideLids: new HeaterSideLidsElement(this),
            setButton: new SetButtonElement(this),
            resetButton: new ResetButtonElement(this),
            heatButton: new HeatButtonElement(this)
        };
    }

    update() {
        this.mouseHandler.update(this);
        this.mixer.update(1 / 30.0);
    }
}
