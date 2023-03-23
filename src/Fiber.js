import {Vector3, Raycaster} from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import FiberModel from "./FiberModel";
import InteractiveElement from "./InteractiveElement";

function clamp(x, a, b) {
    return Math.max(Math.min(x, b), a);
}

class FiberElement extends InteractiveElement {
    constructor(fiber) {
        super(fiber.model, ["Cylinder_1", "Cylinder_2", "Cylinder_3"]);

        this.originalPosition = new Vector3();
        this.mouseDownPoint = new Vector3();
        this.held = false;
        this.model = fiber.model;
        this.raycaster = new Raycaster();
        this.direction = null;
        this.minX = 0;
        this.maxX = 0;

        this.setDirection("right");
    }

    setDirection(direction) {
        this.direction = direction;

        if (this.direction === "right") {
            this.minX = 0.187;
            this.maxX = 0.3;
            this.model.rotation.y = 0;
        } else {
            this.maxX = -0.187;
            this.minX = -0.3;
            this.model.rotation.y = Math.PI;
        }
    }

    onClick(application, event) {
        if (!this.held) {
            if (application.splicer.elements.fiberClamps.animationState != "completed") {
                return;
            }

            this.originalPosition.copy(this.model.position);

            this.mouseDownPoint = this.projectMouseOntoFiber(
                application.mouseHandler.mouseDownPosition, application.camera);
        }

        this.held = !this.held;
    }

    projectMouseOntoFiber(mousePosition, camera) {
        this.raycaster.setFromCamera(mousePosition, camera);

        const projected = this.raycaster.ray.origin.clone();

        const distToPlane = this.model.position.y - this.raycaster.ray.origin.y;
        const t = distToPlane / this.raycaster.ray.direction.y;
        const offset = this.raycaster.ray.direction.clone().multiplyScalar(t);

        projected.add(offset);

        return projected;
    }

    updateRotation() {
        let t = (this.maxX - this.model.position.x) / (this.maxX - this.minX);
        if (this.direction === "left") {
            t = 1 - t;
        }

        this.model.rotation.z = (90 + 3 * t) * (Math.PI / 180);
    }

    update(application) {
        if (!this.held) {
            this.updateRotation();
            return;
        }

        const projected = this.projectMouseOntoFiber(
            application.mouseHandler.position, application.camera);

        const delta = projected.x - this.mouseDownPoint.x;

        this.model.position.x = clamp(this.originalPosition.x + delta, this.minX, this.maxX);
        this.updateRotation();
    }

    onFocusLoss(application) {
        this.held = false;
    }
}

export default class Fiber {
    constructor() {
        this.loader = new GLTFLoader();
        this.model = null;
        this.element = null;
    }

    get direction() {
        return this.element?.direction;
    }

    setDirection(direction) {
        this.element.setDirection(direction);
    }

    load() {
        return new Promise((resolve, reject) => {
            this.loader.parse(FiberModel, "", gltf => {
                this.model = gltf.scene.children[0];
                this.element = new FiberElement(this);

                resolve();
            }, reject);
        });
    }

    addToApplication(application) {
        application.addModel(this.model);
        application.addElement(this.element);
    }

    update(application) {
        this.element.update(application);
    }
}
