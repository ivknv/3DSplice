import * as THREE from "three";
import AnimatedSplicerElement from "./AnimatedSplicerElement";
import InteractiveElement from "./InteractiveElement";
import Application from "./Application";
import Video from "./Video";
import powerOnVideo from "./videos/power_on.mp4";
import spliceVideo from "./videos/splice.mp4";

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

    /**
     * Позволяет определить, открыта ли крышка
     * @return {boolean} true, если крышка полностью открыта, иначе false
     */
    isOpen() {
        return this.animationState === "completed";
    }

    /**
     * Позволяет определить, закрыта ли крышка
     * @return {boolean} true, если крышка полностью закрыта, иначе false
     */
    isClosed() {
        return this.animationState === "initial";
    }

    onClick() {
        if (!this.checkDependencies()) return;

        if (this.isClosed() && Application.state.canOpenLid()) {
            super.onClick();
            Application.splicer.revealElectrode();
        } else if (this.isOpen() && Application.state.canCloseLid()) {
            super.onClick();
            Application.splicer.hideElectrode();
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

    /**
     * Позволяет определить, поднят ли зажим оболочки волокна
     * @return {boolean} true, если зажим оболочки волокна полностью поднят, иначе false
     */
    isUp() {
        return this.animationState === "completed";
    }

    /**
     * Позволяет определить, опущен ли зажим оболочки волокна
     * @return {boolean} true, если зажим оболочки волокна полностью опущен, иначе false
     */
    isDown() {
        return this.animationState === "initial";
    }

    onClick() {
        super.onClick();
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

    /**
     * Позволяет определить, поднят ли зажим волокна
     * @return {boolean} true, если зажим волокна полностью поднят, иначе false
     */
    isUp() {
        return this.animationState === "completed";
    }

    /**
     * Позволяет определить, опущен ли зажим волокна
     * @return {boolean} true, если зажим волокна полностью опущен, иначе false
     */
    isDown() {
        return this.animationState === "initial";
    }

    onClick() {
        super.onClick();
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

        this.powerOnVideo = new Video(powerOnVideo);
        this.spliceVideo = new Video(spliceVideo);
        this.setVideo(this.powerOnVideo.texture);
    }

    /**
     * Задать видео, используемое в качестве текстуры экрана
     * @param {THREE.VideoTexture} texture - Видео-текстура Three.js
     */
    setVideo(texture) {
        let screenObject = null;
        for (const object of this.objects) {
            if (object.name === "Cube113_1") {
                screenObject = object;
                break;
            }
        }

        screenObject.material.map = texture;
        screenObject.material.color.set(0x888888);
        screenObject.material.reflectivity = 0.1;
        screenObject.material.needsUpdate = true;
    }

    /**
     * Переводит экран в начальное состояние
     */
    setInitialScreen() {
        this.setVideo(this.spliceVideo.texture);
        this.spliceVideo.seek(0);
    }

    /**
     * Начинает показ фрагмента видео с процессом сварки
     */
    startSpliceAnimation() {
        this.setVideo(this.spliceVideo.texture);
        this.spliceVideo.play();
    }

    stopSpliceAnimation() {
        this.setVideo(this.spliceVideo.texture);
        this.spliceVideo.seek(0);
        this.spliceVideo.pause();
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

    onClick() {
        super.onClick();
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

    /**
     * Позволяет определить, открыта ли крышка нагревателя
     * @return {boolean} true, если крышка нагревателя полностью открыта, иначе false
     */
    isOpen() {
        return this.animationState === "completed";
    }

    /**
     * Позволяет определить, закрыта ли крышка нагревателя
     * @return {boolean} true, если крышка нагревателя полностью закрыта, иначе false
     */
    isClosed() {
        return this.animationState === "initial";
    }

    onClick() {
        super.onClick();
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
class HeaterClampsElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(
            splicer.model,
            splicer.animations,
            splicer.mixer,
            ["Cube016"],
            "Lift Up Heating Chamber Side Lid");

        this.animationActionController.onCompleted = () => {
            Application.state.onHeaterClampsOpened();
        };

        this.animationActionController.onReset = () => {
            Application.state.onHeaterClampsClosed();
        };
    }

    checkDependencies() {
        if (!super.checkDependencies()) return false;

        if (this.isDown()) {
            return Application.state.canLiftHeaterClamps();
        } else if (this.isUp()) {
            return Application.state.canLowerHeaterClamps();
        }

        return false;
    }

    /**
     * Позволяет определить, открыты ли зажимы нагревателя
     * @return {boolean} true, если зажимы нагревателя полностью открыты, иначе false
     */
    isUp() {
        return this.animationState === "completed";
    }

    /**
     * Позволяет определить, закрыты ли зажимы нагревателя
     * @return {boolean} true, если зажимы нагревателя полностью закрыты, иначе false
     */
    isDown() {
        return this.animationState === "initial";
    }

    onClick() {
        super.onClick();
        Application.mouseHandler.updateTooltip();
    }

    get tooltip() {
        return this.isDown() ? "Открыть крышку нагревателя" : "Закрыть крышку нагревателя";
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

    onClick() {
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

    onClick() {
        Application.state.onHeatPressed();
    }
}

/** Переключатель питания */
class PowerSwitchElement extends AnimatedSplicerElement {
    constructor(splicer) {
        super(splicer.model, splicer.animations, splicer.mixer, ["Cube050"], "Power On (AC)");

        this.animationActionController.onCompleted = () => {
            Application.splicer.children.screen.powerOnVideo.play();
        };
    }

    /**
     * Позволяет определить, находится ли переключатель в положении "Включено"
     * @return {boolean} true, если "Включено", иначе false
     */
    isOn() {
        return this.animationState === "completed";
    }

    /**
     * Позволяет определить, находится ли переключатель в положении "Выключено"
     * @return {boolean} true, если "Выключено", иначе false
     */
    isOff() {
        return this.animationState === "initial";
    }

    get tooltip() {
        return this.isOn() ? "Выключить сварочный аппарат" : "Включить сварочный аппарат";
    }

    set tooltip(value) {}

    checkDependencies() {
        if (!super.checkDependencies()) return false;

        return this.isOff();
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

    /** Останавливает работу индикатора */
    dispose() {
        this.stopFlashing();
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
        this.model.material.color.set(this.initialColor);
    }
}

/**
 * Корневой интерактивый элемент сварочного аппарата
 *
 * @property {THREE.AnimationClip[]}          animations - Набор анимаций сварочного аппарата
 * @property {THREE.AnimationMixer}           mixer - Экземпляр THREE.AnimationMixer
 * @property {HeaterIndicator}                heaterIndicator - Индикатор нагревателя
 * @property {LidElement}                     children.lid - Крышка сварочного аппарата
 * @property {LeftFiberCladdingClampElement}  children.leftFiberCladdingClamp - Левый зажим оболочки волокна
 * @property {RightFiberCladdingClampElement} children.rightFiberCladdingClamp - Правый зажим оболочки волокна
 * @property {LeftFiberClampElement}          children.leftFiberClamp - Левый зажим волокна
 * @property {RightFiberClampElement}         children.rightFiberClamp - Правый зажим волокна
 * @property {ScreenElement}                  children.Screen - Экран сварочного аппарата
 * @property {ScreenBearingElement}           children.screenBearing - Крепление экрана
 * @property {HeaterMainLidElement}           children.mainHeaterLid - Крышка нагревателя
 * @property {HeaterClampsElement}            children.heaterClamps - Зажимы нагревателя
 * @property {SetButtonElement}               children.setButton - Кнопка SET
 * @property {ResetButtonElement}             children.resetButton - Кнопка RESET
 * @property {HeatButton}                     children.heatButton - Кнопка HEAT
 * @property {PowerSwitchElement}             children.powerSwitch - Переключатель питания
 */
export default class Splicer extends InteractiveElement {
    /**
     * Создает экземпляр Splicer.
     * @param {THREE.Object3D}        model      - 3D-модель сварочного аппарата
     * @param {THREE.AnimationClip[]} animations - Набор анимаций сварочного аппарата
     */
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
            heaterClamps: new HeaterClampsElement(this),
            setButton: new SetButtonElement(this),
            resetButton: new ResetButtonElement(this),
            heatButton: new HeatButtonElement(this),
            powerSwitch: new PowerSwitchElement(this)
        };

        const makeAction = (clipName) => {
            const clip = THREE.AnimationClip.findByName(animations, clipName);

            const action = this.mixer.clipAction(clip);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

            return action;
        };

        this._revealElectrodeAction1 = makeAction("Reveal Electrode 1");
        this._revealElectrodeAction2 = makeAction("Reveal Electrode 2");

        this._onPowerOn = () => {
            Application.state.onPowerOn();
        };

        this._onSpliceFinished = () => {
            Application.spliceProcess.finish();
        };

        this.children.screen.powerOnVideo.domElement.addEventListener("ended", this._onPowerOn);
        this.children.screen.spliceVideo.domElement.addEventListener("ended", this._onSpliceFinished);
    }

    _playAction(action, timeScale) {
        action.timeScale = timeScale ?? 1;
        action.reset();
        if (action.timeScale < 0) {
            action.time = 2;
        }
        action.play();
    }

    revealElectrode() {
        this._playAction(this._revealElectrodeAction1);
        this._playAction(this._revealElectrodeAction2);
    }

    hideElectrode() {
        this._playAction(this._revealElectrodeAction1, -1);
        this._playAction(this._revealElectrodeAction2, -1);
    }

    update() {
        super.update();
        this.mixer.update(Application.clockDelta * 6);
    }

    dispose() {
        super.dispose();
        this.heaterIndicator.dispose();
        this.powerOnVideo.domElement.removeEventListener("ended", this._onPowerOn);
        this.spliceVideo.domElement.removeEventListener("ended", this._onSpliceVideo);
    }
}
