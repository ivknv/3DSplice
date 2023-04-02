import InteractiveElement from "./InteractiveElement";
import * as THREE from "three";
import {clamp} from "./common";
import AnimationActionController from "./AnimationActionController";
import Application from "./Application";
import * as Colors from "./colors";

function makeKeyframeTrack(model, offsetY, offsetZ) {
    return new THREE.VectorKeyframeTrack(
        ".position",
        [0, 2],
        [
            model.position.x,
            model.position.y,
            model.position.z,
            model.position.x,
            model.position.y + offsetY,
            model.position.z + offsetZ
        ],
        THREE.InterpolateLinear);
}

/**
 * Интерактивный элемент волокна, полученного в результате сварки.
 */
export default class FusedFiber extends InteractiveElement {
    /**
     * Создает объект FusedFiber.
     * @param {Fiber} leftFiber  - Левое волокно
     * @param {Fiber} rightFiber - Правое волокно
     */
    constructor(leftFiber, rightFiber) {
        const model = new THREE.Group();
        model.add(leftFiber.model);
        model.add(rightFiber.model);

        super(model, ["Cylinder_1", "Cylinder_2", "Cylinder_3"]);

        this.held = false;

        this.left = leftFiber.model;
        this.leftPadding = leftFiber.padding;
        this.right = rightFiber.model;
        this.rightPadding = rightFiber.padding;

        this.originalPosition = new THREE.Vector3();
        this.mouseDownPoint = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.mixerLeft = new THREE.AnimationMixer(this.left);
        this.mixerRight = new THREE.AnimationMixer(this.right);

        const keyframesLeft = makeKeyframeTrack(this.left, 0.1, 0.0525);
        const keyframesRight = makeKeyframeTrack(this.right, 0.1, 0.0525);

        this.liftAnimationLeft = new THREE.AnimationClip("Lift Fiber", 2, [keyframesLeft]);
        this.liftAnimationRight = new THREE.AnimationClip("Lift Fiber", 2, [keyframesRight]);

        this.animationActionControllerLeft = new AnimationActionController(this.mixerLeft, this.liftAnimationLeft);
        this.animationActionControllerRight = new AnimationActionController(this.mixerRight, this.liftAnimationRight);

        this.tooltip = "Переместить волокно";

        this.initialAngleLeft = this.left.rotation.z;
        this.initialAngleRight = this.right.rotation.z;

        this.minY = 0.04;
        this.maxY = 0.17;

        this.animationActionControllerLeft.onCompleted = () => {
            Application.state.onFiberRemoved();
        };

        this.animationActionControllerRight.onCompleted = () => {
            Application.state.onFiberRemoved();
        };
    }

    checkPlacement() {
        Application.fiberPlacedInHeater = this.left.position.y > 0.0399 && this.left.position.y < 0.043;
    }

    addPadding() {
        this.objects[this.leftPadding.uuid] = this.leftPadding;
        this.objects[this.rightPadding.uuid] = this.rightPadding;
    }

    removePadding() {
        delete this.objects[this.leftPadding.uuid];
        delete this.objects[this.rightPadding.uuid];
    }

    onClick(event) {
        if (!this.held) {
            if (this.animationActionControllerLeft.state !== "completed") return;
            if (this.animationActionControllerRight.state !== "completed") return;

            if (!Application.state.canPlaceFiberInHeater()) return;

            this.highlightColor = Colors.HIGHLIGHT_ACTIVE;

            Application.mouseHandler.setHoverFilter(element => {
                return element === this;
            });

            this.originalPosition.copy(this.left.position);

            this.mouseDownPoint = this.projectMouseOntoFiber(
                Application.mouseHandler.mouseDownPosition, Application.camera);
        } else {
            this.highlightColor = Colors.HIGHLIGHT;
            Application.mouseHandler.resetHoverFilter();
            this.checkPlacement();
        }

        this.held = !this.held;
    }

    projectMouseOntoFiber(mousePosition, camera) {
        this.raycaster.setFromCamera(mousePosition, camera);

        const projected = this.raycaster.ray.origin.clone();

        const distToPlane = this.left.position.z - this.raycaster.ray.origin.z;
        const t = distToPlane / this.raycaster.ray.direction.z;

        const offset = this.raycaster.ray.direction.clone().multiplyScalar(t);

        projected.add(offset);

        return projected;
    }

    updateRotation() {
        const t = this.animationActionControllerLeft.action.time / this.liftAnimationLeft.duration;

        const deltaLeft = this.initialAngleLeft - 0.5 * Math.PI;
        const deltaRight = this.initialAngleRight - 0.5 * Math.PI;

        this.left.rotation.z = this.initialAngleLeft - deltaLeft * t;
        this.right.rotation.z = this.initialAngleRight - deltaRight * t;
    }

    syncWithMouse() {
        const projected = this.projectMouseOntoFiber(
            Application.mouseHandler.position, Application.camera);

        const delta = projected.y - this.mouseDownPoint.y;
        const position = clamp(this.originalPosition.y + delta, this.minY, this.maxY);
        this.left.position.y = position;
        this.right.position.y = position;
    }

    update() {
        this.mixerLeft.update(Application.clockDelta);
        this.mixerRight.update(Application.clockDelta);

        if (this.held) this.syncWithMouse();
        this.updateRotation();
    }

    onFocusLoss() {
        this.highlightColor = Colors.HIGHLIGHT;
        Application.mouseHandler.resetHoverFilter();

        if (this.held) {
            this.syncWithMouse();
            this.checkPlacement();
        }

        this.held = false;
    }
}
