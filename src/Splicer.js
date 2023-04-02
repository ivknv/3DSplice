import * as THREE from "three";
import AnimatedSplicerElement from "./AnimatedSplicerElement";
import InteractiveElement from "./InteractiveElement";
import Application from "./Application";

/** Крышка сварочного аппарата */
class LidElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            ["Splice_Lid", "Cube057", "Cube058", "Cube059"], "Open Lid");

        this.dependencies = {
            leftFiberCladdingClamp: "initial",
            rightFiberCladdingClamp: "initial",
            leftFiberClamp: "initial",
            rightFiberClamp: "initial",
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

/** Зажим оболочки волокна */
class FiberCladdingClampElement extends AnimatedSplicerElement {
    constructor(splicer, objectNames, animationName) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            objectNames,
            animationName);

        this.dependencies = {
            lid: "completed",
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
        return this.isDown() ? "Поднять зажим" : "Опустить зажим";
    }

    set tooltip(value) {
        return;
    }
}

/** Левый зажим оболочки волокна */
class LeftFiberCladdingClampElement extends FiberCladdingClampElement {
    constructor(splicer) {
        super(
            splicer,
            [
                "Fiber_Clamp_Bar001", "Fiber_Clamp_Handle001", "Fiber_Clamp_Bar_End001",
                "Fiber_Clamp_Presser_Leg001", "Cube068_2", "Cube017", "Screw004"
            ],
            "Lift Up Left Fiber Clamp Bar");

        this.dependencies.leftFiberClamp = "initial";

        this.animationActionController.onCompleted = () => {
            Application.state.onLeftFiberCladdingClampUp();
        };

        this.animationActionController.onReset = () => {
            Application.state.onLeftFiberCladdingClampDown();
        };
    }
}

/** Правый зажим оболочки волокна */
class RightFiberCladdingClampElement extends FiberCladdingClampElement {
    constructor(splicer) {
        super(
            splicer,
            [
                "Fiber_Clamp_Bar", "Fiber_Clamp_Handle", "Fiber_Clamp_Bar_End",
                "Fiber_Clamp_Presser_Leg", "Cube068", "Cube068_1", "Screw010"
            ],
            "Lift Up Right Fiber Clamp Bar");

        this.dependencies.rightFiberClamp = "initial";

        this.animationActionController.onCompleted = () => {
            Application.state.onRightFiberCladdingClampUp();
        };

        this.animationActionController.onReset = () => {
            Application.state.onRightFiberCladdingClampDown();
        };
    }
}

/** Зажим волокна */
class FiberClampElement extends AnimatedSplicerElement {
    constructor(splicer, objectNames, animationName) {
        super(splicer.model, splicer.animations, splicer.mixer, objectNames, animationName);

        this.dependencies = {
            lid: "completed",
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
        return this.isDown() ? "Поднять зажим" : "Опустить зажим";
    }

    set tooltip(value) {
        return;
    }
}

/** Левый зажим волокна */
class LeftFiberClampElement extends FiberClampElement {
    constructor(splicer) {
        super(
            splicer,
            ["Cube019_1", "Cube019_2", "Fiber_Cladding_Clamp_(outer)001"],
            "Lift Up Left Fiber Clamp");

        this.dependencies.leftFiberCladdingClamp = "completed";

        this.animationActionController.onCompleted = () => {
            Application.state.onLeftFiberClampUp();
        };

        this.animationActionController.onReset = () => {
            Application.state.onLeftFiberClampDown();
        };
    }
}

/** Правый зажим волокна */
class RightFiberClampElement extends FiberClampElement {
    constructor(splicer) {
        super(
            splicer,
            ["Cube054_1", "Cube054_2", "Fiber_Cladding_Clamp_(outer)"],
            "Lift Up Right Fiber Clamp");

        this.dependencies.rightFiberCladdingClamp = "completed";

        this.animationActionController.onCompleted = () => {
            Application.state.onRightFiberClampUp();
        };

        this.animationActionController.onReset = () => {
            Application.state.onRightFiberClampDown();
        };
    }
}

/** Экран */
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

/** Крепление экрана */
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

/** Крышка нагревателя */
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

/** Зажимы нагревателя */
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

/** Кнопка SET */
class SetButtonElement extends InteractiveElement {
    constructor(splicer) {
        super(splicer.model, ["Cube135", "Cube135_1"]);

        this.tooltip = "Произвести сварку";
    }

    onClick(event) {
        Application.state.onSetPressed();
    }
}

/** Кнопка RESET */
class ResetButtonElement extends InteractiveElement {
    constructor(splicer) {
        super(splicer.model, ["Cube136", "Cube136_1"]);
    }
}

/** Кнопка HEAT */
class HeatButtonElement extends InteractiveElement {
    constructor(splicer) {
        super(splicer.model, ["Cube137", "Cube137_1"]);

        this.tooltip = "Включить нагреватель";
    }

    onClick(event) {
        Application.state.onHeatPressed();
    }
}

/** Переключатель питания */
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

/** Индикатор нагревателя */
class HeaterIndicator {
    constructor(model) {
        this.model = model;
        this.initialColor = model.material.color.clone();
        this.activeColor = new THREE.Color("orange");
        this.intervalId = null;
        this.flashing = false;
    }

    /** Включить мигание */
    startFlashing() {
        if (this.intervalId !== null) this.stopFlashing();

        this.intervalId = setInterval(() => {
            const color = this.flashing ? this.initialColor : this.activeColor;
            this.model.material.color.set(color);
            this.flashing = !this.flashing;
        }, 1000);
    }

    /** Остановить мигание */
    stopFlashing() {
        clearInterval(this.intervalId);
        this._intervalId = null;
    }
}

/** Корневой интерактивый элемент сварочного аппарата */
export default class Splicer extends InteractiveElement {
    constructor(model, animations) {
        super(model, []);

        this.animations = animations;
        this.mixer = new THREE.AnimationMixer(this.model);
        this.heaterIndicator = new HeaterIndicator(model.getObjectByName("HeaterIndicator"));

        this.children = {
            lid: new LidElement(this),
            leftFiberCladdingClamp: new LeftFiberCladdingClampElement(this),
            rightFiberCladdingClamp: new RightFiberCladdingClampElement(this),
            leftFiberClamp: new LeftFiberClampElement(this),
            rightFiberClamp: new RightFiberClampElement(this),
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
