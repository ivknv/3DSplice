import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import AnimatedSplicerElement from "./AnimatedSplicerElement";
import SplicerElement from "./SplicerElement";
import MouseHandler from "./MouseHandler";
import Model from "./Model.js";

class LidElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Splice_Lid", "Cube057", "Cube058", "Cube059"], "Open Lid");

        this.dependencies = {
            clampBars: "initial",
            fiberClamps: "initial",
            screenBearing: "initial"
        }
    }
}

class ClampBarsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, [
            "Fiber_Clamp_Bar", "Fiber_Clamp_Handle", "Fiber_Clamp_Bar_End",
            "Fiber_Clamp_Presser_Leg", "Cube068", "Cube068_1", "Screw010"
        ], "Lift Up Clamp Bar");

        this.dependencies = {
            lid: "completed",
            fiberClamps: "initial"
        }
    }
}

class FiberClampsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, [
            "Cube054_1", "Cube054_2", "Fiber_Cladding_Clamp_(outer)",
        ], "Lift Up Clamp");

        this.dependencies = {
            lid: "completed",
            clampBars: "completed"
        }
    }
}

class ScreenElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Screen"], "Rotate Screen");

        this.dependencies = {
            screenBearing: "initial"
        }
    }
}

class ScreenBearingElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer, ["Cube108", "Cube108_1", "Screen_Hinge", "Screen_Hinge001"], "Rotate Screen Bearing");

        this.dependencies = {
            screen: "completed",
            lid: "initial"
        }
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

        this.mouseHandler = new MouseHandler(this, rootElement);
    }

    getElementByObjectName(objectName) {
        for (const elementName in this.elements) {
            const element = this.elements[elementName];

            if (objectName in element.objects) return element;
        }

        return null;
    }

    load() {
        return new Promise((resolve, reject) => {
            this.loader.parse(Model, "", gltf => {
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
                resolve();
            }, reject);
        });
    }

    update() {
        this.mouseHandler.update(this);
        this.mixer.update(1 / 10.0);
    }
}
