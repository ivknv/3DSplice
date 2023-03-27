import InteractiveElement from "./InteractiveElement";
import * as THREE from "three";
import {clamp} from "./common";

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
    }

    onClick(application, event) {
        if (!this.held) {
            this.originalPosition.copy(this.left.position);

            this.mouseDownPoint = this.projectMouseOntoFiber(
                application.mouseHandler.mouseDownPosition, application.camera);
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

    update(application) {
        if (!this.held) return;

        const projected = this.projectMouseOntoFiber(
            application.mouseHandler.position, application.camera);

        const delta = projected.y - this.mouseDownPoint.y;
        const position = clamp(this.originalPosition.y + delta, 0.052, 0.15);
        this.left.position.y = position;
        this.right.position.y = position;

        const t = clamp((0.055 - this.left.position.y) / (0.055 - 0.052), 0, 1);

        const rotation = (90 + 3 * t) * (Math.PI / 180);

        this.left.rotation.z = rotation;
        this.right.rotation.z = rotation;
    }

    onFocusLoss(application) {
        this.held = false;
    }
}
