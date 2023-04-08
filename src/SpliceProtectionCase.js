import * as THREE from "three";
import InteractiveElement from "./InteractiveElement";
import AnimationActionController from "./AnimationActionController";
import Application from "./Application";
import {clamp} from "./common";
import * as Colors from "./colors";

/** Интерактивный элемент гильзы КДЗС. */
export default class SpliceProtectionCase extends InteractiveElement {
    /**
     * Создает экземпляр SpliceProtectionCase.
     * @param {THREE.Object3D} model - 3D-модель гильзы КДЗС
     * @param {THREE.AnimationClip[]} animations - набор анимаций
     */
    constructor(model, animations) {
        const group = new THREE.Group();
        group.add(model);
        super(group, ["Cube", "Cylinder001"]);

        this.originalPosition = new THREE.Vector3();
        this.mouseDownPoint = new THREE.Vector3();
        this.held = false;
        this.raycaster = new THREE.Raycaster();
        this.delta = 0;

        this.mixer = new THREE.AnimationMixer(model);
        this.animationActionController = AnimationActionController.fromAnimationName(
            animations, this.mixer, "Shrink");

        this.tooltip = "Переместить гильзу КДЗС";

        this.animationActionController.onCompleted = () => {
            Application.state.onHeatingCompleted();
        };

        this.padding = model.getObjectByName("Cube").clone();
        this.padding.visible = false;
        this.padding.scale.x = 1;
        this.padding.scale.y = 3;
        this.padding.scale.z = 6;

        this.objects.add(this.padding);

        group.add(this.padding);
    }

    setPosition(x, y, z) {
        this.model.position.set(x, y, z);
        this.originalPosition.set(x, y, z);
    }

    isCentered() {
        return Math.abs(this.model.position.x) < 0.004;
    }

    checkPlacement() {
        Application.state.spliceProtectionPlaced = this.isCentered();
    }

    onClick(event) {
        if (!this.held) {
            if (!Application.state.canPlaceSpliceProtection()) return;

            this.highlightColor = Colors.HIGHLIGHT_ACTIVE;

            Application.mouseHandler.setHoverFilter(element => {
                return element === this;
            });

            this.originalPosition.copy(this.model.position);

            this.mouseDownPoint = this.projectMouseOntoModel(
                Application.mouseHandler.mouseDownPosition, Application.camera);
        } else {
            this.highlightColor = Colors.HIGHLIGHT;
            Application.mouseHandler.resetHoverFilter();
            this.syncWithMouse();
            this.updateRotation();
            this.checkPlacement();
        }

        this.held = !this.held;
    }

    projectMouseOntoModel(mousePosition, camera) {
        this.raycaster.setFromCamera(mousePosition, camera);

        const projected = this.raycaster.ray.origin.clone();

        const distToPlane = this.model.position.y - this.raycaster.ray.origin.y;
        const t = distToPlane / this.raycaster.ray.direction.y;
        const offset = this.raycaster.ray.direction.clone().multiplyScalar(t);

        projected.add(offset);

        return projected;
    }

    updateRotation() {
        const x = -this.delta - (this.originalPosition.x - Application.rightFiber.model.position.x);
        const maxX = Application.state === "initial" ?
            -Application.rightFiber.getTipPosition().x + Application.rightFiber.model.position.x - 0.03 :
            -Application.rightFiber.getTipPosition().x + Application.rightFiber.model.position.x + 0.1;
        const minX = 0.07;
        const newPosition = new THREE.Vector3(0, clamp(x, minX, maxX, 0));
        newPosition.applyAxisAngle(new THREE.Vector3(0, 0, 1), Application.rightFiber.model.rotation.z);
        this.model.rotation.z = -Math.PI * 0.5 + Application.rightFiber.model.rotation.z;
        this.model.position.x = newPosition.x + Application.rightFiber.model.position.x;
        this.model.position.y = newPosition.y + 0.0008 + Application.rightFiber.model.position.y;
        this.model.position.z = newPosition.z + Application.rightFiber.model.position.z;
    }

    syncWithMouse() {
        const projected = this.projectMouseOntoModel(
            Application.mouseHandler.position, Application.camera);

        this.delta = projected.x - this.mouseDownPoint.x;
    }

    update() {
        super.update();

        this.mixer.update(Application.clockDelta / 5);

        if (this.held) this.syncWithMouse();
        this.updateRotation();
    }

    onFocusLoss() {
        this.highlightColor = Colors.HIGHLIGHT;
        Application.mouseHandler.resetHoverFilter();

        if (this.held) {
            this.syncWithMouse();
            this.updateRotation();
            this.checkPlacement();
        }

        this.held = false;
    }

    /** Запускает анимацию термоусадки */
    shrink() {
        this.animationActionController.playForward();
    }
}
