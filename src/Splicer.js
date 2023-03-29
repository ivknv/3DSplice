import * as THREE from "three";
import AnimatedSplicerElement from "./AnimatedSplicerElement";
import InteractiveElement from "./InteractiveElement";
import FusedFiber from "./FusedFiber";
import Application from "./Application";

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
        };

        this.onOpened = function() {};
        this.onClosed = function() {};

        this.animationActionController.onCompleted = () => {
            this.onOpened();
        };

        this.animationActionController.onReset = () => {
            this.onClosed();
        };
    }

    isOpen() {
        return this.animationState === "completed";
    }

    isClosed() {
        return this.animationState === "initial";
    }

    onClick(event) {
        super.onClick(event);
        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.animationState == "initial" ? "Открыть крышку" : "Закрыть крышку";
    }

    set tooltip(value) {
        return;
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
        };

        this.onLifted = function() {};
        this.onLowered = function() {};

        this.animationActionController.onCompleted = () => {
            this.onLifted();
        };
        this.animationActionController.onReset = () => {
            this.onLowered();
        };
    }

    isUp() {
        return this.animationState === "completed";
    }

    isDown() {
        return this.animationState === "initial";
    }

    onClick(event) {
        super.onClick(event);
        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.isDown() ? "Поднять зажимы" : "Опустить зажимы";
    }

    set tooltip(value) {
        return;
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
        };

        this.onLifted = function() {};
        this.onLowered = function() {};
    }

    isUp() {
        return this.animationState === "completed";
    }

    isDown() {
        return this.animationState === "initial";
    }

    onAnimationCompleted() {
        this.onLifted();
        if (!Application.fusedFiber) return;
        Application.fusedFiber.animationActionControllerLeft.toggle();
        Application.fusedFiber.animationActionControllerRight.toggle();
    }

    onAnimationReset() {
        this.onLowered();
    }
s
    onClick(event) {
        super.onClick(event);
        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.isDown() ? "Поднять зажимы" : "Опустить зажимы";
    }

    set tooltip(value) {
        return;
    }
}

class ScreenElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer.model, splicer.animations, splicer.mixer, ["Screen"], "Rotate Screen");

        this.dependencies = {
            screenBearing: "initial"
        };

        this.tooltip = "Повернуть экран";
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
        };
    }

    onClick(event) {
        super.onClick(event);
        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.animationState == "initial" ? "Сложить экран" : "Вернуть экран";
    }

    set tooltip(value) {
        return;
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

    checkDependencies() {
        if (!super.checkDependencies()) return false;
        if (Application.state === "heating_in_progress") return false;

        if (Application.leftFiber.model.position.z < 0.05) return true;

        return Application.leftFiber.model.position.y < 0.041 || Application.leftFiber.model.position.y > 0.068;
    }

    isOpen() {
        return this.animationState === "completed";
    }

    isClosed() {
        return this.animationState === "initial";
    }

    onClick(event) {
        super.onClick(event);
        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.isClosed() ? "Открыть крышку нагревателя" : "Закрыть крышку нагревателя";
    }

    set tooltip(value) {
        return;
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

    checkDependencies() {
        if (!super.checkDependencies()) return false;
        if (Application.state === "heating_in_progress") return false;

        if (Application.leftFiber.model.position.z < 0.05) return true;

        return Application.leftFiber.model.position.y < 0.041 || Application.leftFiber.model.position.y > 0.068;
    }

    isOpen() {
        return this.animationState === "completed";
    }

    isClosed() {
        return this.animationState === "initial";
    }

    onClick(event) {
        super.onClick(event);
        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.isClosed() ? "Открыть крышку нагревателя" : "Закрыть крышку нагревателя";
    }

    set tooltip(value) {
        return;
    }
}

class SetButtonElement extends InteractiveElement {
    constructor(splicer) {
        super(splicer.model, ["Cube135", "Cube135_1"]);

        this.tooltip = "Произвести сварку";
    }

    isClickable() {
        // Don't do anything until the lid is closed
        if (Application.splicer.children.lid.animationState != "initial") return false;

        // Check that the distance between the fibers is small enough
        if (!Application.fibersPlaced) return false;

        return true;
    }

    onClick(event) {
        if (!this.isClickable()) return;

        const leftFiber = Application.leftFiber;
        const rightFiber = Application.rightFiber;

        // Move fibers together (and fuse them)
        leftFiber.setTipPosition(0.0003);
        rightFiber.setTipPosition(-0.0003);

        leftFiber.removeFromApplication();
        rightFiber.removeFromApplication();

        leftFiber.active = false;
        rightFiber.active = false;

        const fiber = new FusedFiber(leftFiber, rightFiber);

        fiber.addToApplication();
        Application.fusedFiber = fiber;

        Application.state = "splice_completed";

        // A simple hack to make sure spliceProtectionCase is always updated after the fibers
        Application.spliceProtectionCase.removeFromApplication();
        Application.spliceProtectionCase.addToApplication();

        Application.setInstructionText("Достаньте волокно из сварочного аппарата");
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

        this.tooltip = "Включить нагреватель";
    }

    isClickable() {
        if (Application.state != "splice_completed") return false;
        if (Application.splicer.children.mainHeaterLid.isOpen()) return false;
        if (Application.splicer.children.heaterSideLids.isOpen()) return false;

        return true;
    }

    onClick(event) {
        if (!this.isClickable()) return;

        // TODO: replace spliceProtectionCase.model with the shrunk version
        Application.spliceProtectionCase.animationActionController.onCompleted = () => {
            Application.state = "heating_completed";
        };
        Application.state = "heating_in_progress";
        Application.spliceProtectionCase.shrink();
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

    update() {
        super.update();
        this.mixer.update(Application.clockDelta * 6);
    }
}
