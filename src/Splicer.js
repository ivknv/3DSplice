import * as THREE from "three";
import AnimatedSplicerElement from "./AnimatedSplicerElement";
import InteractiveElement from "./InteractiveElement";
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

        this.animationActionController.onCompleted = () => {
            Application.state.onLidOpened();
        };

        this.animationActionController.onReset = () => {
            Application.state.onLidClosed();
        };
    }

    isOpen() {
        return this.animationState === "completed";
    }

    isClosed() {
        return this.animationState === "initial";
    }

    onClick(event) {
        if ((this.isClosed() && Application.state.canOpenLid()) ||
            (this.isOpen() && Application.state.canCloseLid())) {
            super.onClick(event);
        }

        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.isClosed() ? "Открыть крышку" : "Закрыть крышку";
    }

    set tooltip(value) {}
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

        this.animationActionController.onCompleted = () => {
            Application.state.onClampBarsUp();
        };

        this.animationActionController.onReset = () => {
            Application.state.onClampBarsDown();
        }
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
    }

    isUp() {
        return this.animationState === "completed";
    }

    isDown() {
        return this.animationState === "initial";
    }

    onAnimationCompleted() {
        Application.state.onFiberClampsUp();
    }

    onAnimationReset() {
        Application.state.onFiberClampsDown();
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
        super(splicer.model, splicer.animations, splicer.mixer, ["Cube113", "Cube113_1"], "Rotate Screen");

        this.dependencies = {
            screenBearing: "initial"
        };

        this.tooltip = "Повернуть экран";
    }

    setVideo(texture) {
        const screenObject = Object.values(this.objects).find(x => { return x.name === "Cube113_1"; });

        screenObject.material.map = texture;
        screenObject.material.color.set(0xFFFFFF);
    }

    setInitialScreen() {
        Application.videoElement.currentTime = 0;
    }

    startSpliceAnimation() {
        Application.videoElement.play();
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

        this.animationActionController.onCompleted = () => {
            Application.state.onMainHeaterLidOpened();
        };

        this.animationActionController.onReset = () => {
            Application.state.onMainHeaterLidClosed();
        };
    }

    checkDependencies() {
        if (!super.checkDependencies()) return false;

        if (this.isClosed()) {
            return Application.state.canOpenMainHeaterLid();
        } else if (this.isOpen()) {
            return Application.state.canCloseMainHeaterLid();
        }

        return false;
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

        this.animationActionController.onCompleted = () => {
            Application.state.onHeaterSideLidsOpened();
        };

        this.animationActionController.onReset = () => {
            Application.state.onHeaterSideLidsClosed();
        };
    }

    checkDependencies() {
        if (!super.checkDependencies()) return false;

        if (this.isClosed()) {
            return Application.state.canOpenHeaterSideLids();
        } else if (this.isOpen()) {
            return Application.state.canCloseHeaterSideLids();
        }

        return false;
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

    onClick(event) {
        Application.state.onSetPressed();
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

    onClick(event) {
        Application.state.onHeatPressed();
    }
}

class PowerSwitchElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer.model, splicer.animations, splicer.mixer, ["Cube050"], "Power On (DC)");
    }

    isOn() {
        return this.animationState === "completed";
    }

    isOff() {
        return this.animationState === "initial";
    }

    get tooltip() {
        return this.isOn() ? "Выключить сварочный аппарат" : "Включить сварочный аппарат";
    }

    set tooltip(value) {
        return;
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
            heatButton: new HeatButtonElement(this),
            powerSwitch: new PowerSwitchElement(this)
        };
    }

    update() {
        super.update();
        this.mixer.update(Application.clockDelta * 6);
    }
}
