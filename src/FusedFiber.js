import InteractiveElement from "./InteractiveElement";
import * as THREE from "three";
import {clamp} from "./common";
import AnimationActionController from "./AnimationActionController";
import Application from "./Application";

function makeKeyframeTracks(model, offsetY, offsetZ, targetAngle) {
    const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1), targetAngle);

    return [
        new THREE.VectorKeyframeTrack(
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
            THREE.InterpolateLinear),
        new THREE.QuaternionKeyframeTrack(
            ".quaternion",
            [0, 2],
            [
                model.quaternion.x,
                model.quaternion.y,
                model.quaternion.z,
                model.quaternion.w,
                targetQuaternion.x,
                targetQuaternion.y,
                targetQuaternion.z,
                targetQuaternion.w,

            ],
            THREE.InterpolateLinear)
    ];
}

export default class FusedFiber extends InteractiveElement {
    constructor(leftFiber, rightFiber) {
        const model = new THREE.Group();
        model.add(leftFiber.model);
        model.add(rightFiber.model);
        super(model, ["Cylinder_1", "Cylinder_2", "Cylinder_3"]);

        this.held = false;

        this.left = leftFiber.model;
        this.right = rightFiber.model;

        this.originalPosition = new THREE.Vector3();
        this.mouseDownPoint = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.mixerLeft = new THREE.AnimationMixer(this.left);
        this.mixerRight = new THREE.AnimationMixer(this.right);

        const keyframesLeft = makeKeyframeTracks(this.left, 0.1, 0.0525, -0.5 * Math.PI);
        const keyframesRight = makeKeyframeTracks(this.right, 0.1, 0.0525, 0.5 * Math.PI);

        this.liftAnimationLeft = new THREE.AnimationClip("Lift Fiber", 2, keyframesLeft);
        this.liftAnimationRight = new THREE.AnimationClip("Lift Fiber", 2, keyframesRight);

        this.animationActionControllerLeft = new AnimationActionController(this.mixerLeft, this.liftAnimationLeft, this);
        this.animationActionControllerRight = new AnimationActionController(this.mixerRight, this.liftAnimationRight, this);

        this.tooltip = "Переместить волокно";

        this.minY = 0.04;
        this.maxY = 0.17;
    }

    isClickable() {
        if (!Application.splicer.children.mainHeaterLid.isOpen()) return false;
        if (!Application.splicer.children.heaterSideLids.isOpen()) return false;
        if (!Application.spliceProtectionCase.isCentered()) return false;

        return true;
    }

    onClick(event) {
        if (!this.held) {
            if (!this.isClickable()) return;

            this.originalPosition.copy(this.left.position);

            this.mouseDownPoint = this.projectMouseOntoFiber(
                Application.mouseHandler.mouseDownPosition, Application.camera);
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

    update() {
        this.mixerLeft.update(Application.clockDelta);
        this.mixerRight.update(Application.clockDelta);

        if (!this.held) return;

        const projected = this.projectMouseOntoFiber(
            Application.mouseHandler.position, Application.camera);

        const delta = projected.y - this.mouseDownPoint.y;
        const position = clamp(this.originalPosition.y + delta, this.minY, this.maxY);
        this.left.position.y = position;
        this.right.position.y = position;
    }

    onFocusLoss() {
        this.held = false;
    }
}
