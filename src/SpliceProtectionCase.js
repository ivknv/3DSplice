import {Vector3, Raycaster} from "three";
import InteractiveElement from "./InteractiveElement";
import {clamp} from "./common";

export default class SpliceProtectionCase extends InteractiveElement {
    constructor(model) {
        super(model, ["Cube", "Cylinder001"]);

        this.originalPosition = new Vector3();
        this.mouseDownPoint = new Vector3();
        this.held = false;
        this.raycaster = new Raycaster();
        this.delta = 0;
    }

    setPosition(x, y, z) {
        this.model.position.set(x, y, z);
        this.originalPosition.set(x, y, z);
    }

    onClick(application, event) {
        if (!this.held) {
            if (application.splicer.children.fiberClamps.animationState != "completed") {
                if (application.state === "initial") return;
            }

            this.originalPosition.copy(this.model.position);

            this.mouseDownPoint = this.projectMouseOntoModel(
                application.mouseHandler.mouseDownPosition, application.camera);
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

    updateRotation(application) {
        const x = -this.delta - (this.originalPosition.x - application.rightFiber.model.position.x);
        const maxX = application.state === "initial" ? 
            -application.rightFiber.getTipPosition().x + application.rightFiber.model.position.x - 0.03 :
            -application.rightFiber.getTipPosition().x + application.rightFiber.model.position.x + 0.1;
        const minX = 0.07;
        const newPosition = new Vector3(0, clamp(x, minX, maxX, 0));
        newPosition.applyAxisAngle(new Vector3(0, 0, 1), application.rightFiber.model.rotation.z);
        this.model.rotation.z = -Math.PI * 0.5 + application.rightFiber.model.rotation.z;
        this.model.position.x = newPosition.x + application.rightFiber.model.position.x;
        this.model.position.y = newPosition.y + 0.001 + application.rightFiber.model.position.y;
        this.model.position.z = newPosition.z + application.rightFiber.model.position.z;
    }

    update(application) {
        if (!this.held) {
            this.updateRotation(application);
            return;
        }

        const projected = this.projectMouseOntoModel(
            application.mouseHandler.position, application.camera);

        this.delta = projected.x - this.mouseDownPoint.x;
        this.updateRotation(application);
    }

    onFocusLoss(application) {
        this.held = false;
    }
}
