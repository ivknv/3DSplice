import * as THREE from "three";
import AnimatedSplicerElement from "./AnimatedSplicerElement";
import InteractiveElement from "./InteractiveElement";
import FusedFiber from "./FusedFiber";

class LidElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            ["Splice_Lid", "Cube057", "Cube058", "Cube059"], "Open Lid");

        this.dependencies = {
            clampBars: "initial",
            fiberClamps: "initial",
            screenBearing: "initial"
        }
    }
}

class ClampBarsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            [
                "Fiber_Clamp_Bar", "Fiber_Clamp_Handle", "Fiber_Clamp_Bar_End",
                "Fiber_Clamp_Presser_Leg", "Cube068", "Cube068_1", "Screw010"
            ],
            "Lift Up Clamp Bar");

        this.dependencies = {
            lid: "completed",
            fiberClamps: "initial"
        }
    }
}

class FiberClampsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            [
                "Cube054_1", "Cube054_2", "Fiber_Cladding_Clamp_(outer)",
            ],
            "Lift Up Clamp");

        this.dependencies = {
            lid: "completed",
            clampBars: "completed"
        }
    }
}

class ScreenElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer.model, splicer.animations, splicer.mixer, ["Screen"], "Rotate Screen");

        this.dependencies = {
            screenBearing: "initial"
        }
    }
}

class ScreenBearingElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            ["Cube108", "Cube108_1", "Screen_Hinge", "Screen_Hinge001"],
            "Rotate Screen Bearing");

        this.dependencies = {
            screen: "completed",
            lid: "initial"
        }
    }
}

class HeaterMainLidElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            ["Heater_Lid", "Cube014"],
            "Open Heating Chamber Lid");
    }
}

class HeaterSideLidsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            ["Cube016"],
            "Lift Up Heating Chamber Side Lid");
    }
}

class SetButtonElement extends InteractiveElement {
    constructor(splicer) {
        super(splicer.model, ["Cube135", "Cube135_1"]);
    }

    onClick(application, event) {
        // Don't do anything until the lid is closed
        if (application.splicer.children.lid.animationState != "initial") return;

        const leftFiber = application.leftFiber;
        const rightFiber = application.rightFiber;

        // Check that the distances between the fibers are small enough
        if (Math.abs(leftFiber.getTipPosition().x - leftFiber.maxX) > 0.0015) return;
        if (Math.abs(rightFiber.getTipPosition().x - rightFiber.minX) > 0.0015) return;

        // Move fibers together (and fuse them)
        leftFiber.setTipPosition(0.0003);
        rightFiber.setTipPosition(-0.0003);

        leftFiber.removeFromApplication(application);
        rightFiber.removeFromApplication(application);

        leftFiber.active = false;
        rightFiber.active = false;

        const fiber = new FusedFiber(leftFiber, rightFiber);

        application.addElement(fiber);
        application.addModel(fiber.model);
        application.fusedFiber = fiber;

        application.state = "splice_completed"
    }
}

class ResetButtonElement extends InteractiveElement {
    constructor(splicer) {
        super(splicer.model, ["Cube136", "Cube136_1"]);
    }
}

class HeatButtonElement extends InteractiveElement {
    constructor(splicer) {
        super(splicer.model, ["Cube137", "Cube137_1"]);
    }
}

export default class Splicer extends InteractiveElement {
    constructor(model, animations) {
        super(model, []);

        this.animations = animations;
        this.mixer = new THREE.AnimationMixer(this.model);
        this.children = {
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

    update(application) {
        super.update(application);
        this.mixer.update(1 / 10.0);
    }
}
