import {Vector3, Raycaster, Box3} from "three";
import InteractiveElement from "./InteractiveElement";
import Application from "./Application";
import {clamp} from "./common";
import * as Colors from "./colors";

export default class Fiber extends InteractiveElement {
    constructor(model, direction) {
        super(model, ["Cylinder_1", "Cylinder_2", "Cylinder_3"]);

        this.originalPosition = new Vector3();
        this.mouseDownPoint = new Vector3();
        this.held = false;
        this.raycaster = new Raycaster();
        this.direction = null;
        this.minX = 0;
        this.maxX = 0;

        this.boundingBox = new Box3().setFromObject(this.model);

        this.setDirection(direction);

        this.tooltip = "Переместить волокно";
    }

    setDirection(direction) {
        this.direction = direction;

        if (this.direction === "right") {
            this.minX = 0.002;
            this.maxX = 0.07;
            this.model.rotation.y = 0;
        } else {
            this.maxX = -0.002;
            this.minX = -0.07;
            this.model.rotation.y = Math.PI;
        }

        return this;
    }

    checkPlacement() {
        const tolerance = 0.0015;

        if (this.direction === "left") {
            Application.leftFiberPlaced = Math.abs(this.getTipPosition().x - this.maxX) < tolerance;
        } else {
            Application.rightFiberPlaced = Math.abs(this.getTipPosition().x - this.minX) < tolerance;
        }
    }

    isClickable() {
        return Application.splicer.children.fiberClamps.isUp();
    }

    onClick(event) {
        if (!this.held) {
            if (!this.isClickable()) return;

            this.highlightColor = Colors.HIGHLIGHT_ACTIVE;

            Application.mouseHandler.setHoverFilter(element => {
                return element === this;
            });

            this.originalPosition.copy(this.getTipPosition());

            this.mouseDownPoint = this.projectMouseOntoFiber(
                Application.mouseHandler.mouseDownPosition, Application.camera);
        } else {
            Application.mouseHandler.resetHoverFilter();
            this.checkPlacement();
            this.highlightColor = Colors.HIGHLIGHT;
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
        let t = (this.maxX - this.getTipPosition().x) / (this.maxX - this.minX);
        if (this.direction === "left") {
            t = 1 - t;
        }

        this.model.rotation.z = (90 + 3 * t) * (Math.PI / 180);
    }

    update() {
        if (!this.active) return;

        if (!this.held) {
            this.updateRotation();
            return;
        }

        const projected = this.projectMouseOntoFiber(
            Application.mouseHandler.position, Application.camera);

        const delta = projected.x - this.mouseDownPoint.x;

        this.setTipPosition(
            clamp(this.originalPosition.x + delta, this.minX, this.maxX),
            this.model.position.y,
            this.model.position.z);
        this.updateRotation();
    }

    onFocusLoss() {
        Application.mouseHandler.resetHoverFilter();
        this.highlightColor = Colors.HIGHLIGHT;
        this.checkPlacement();
        this.held = false;
    }

    getTipPosition() {
        const multiplier = this.direction == "right" ? 1 : -1;
        return this.model.position.clone().setComponent(0, this.model.position.x - this.boundingBox.max.x * multiplier);
    }

    setTipPosition(x, y, z) {
        const multiplier = this.direction == "right" ? 1 : -1;
        this.model.position.x = this.boundingBox.max.x * multiplier + x;

        if (y !== undefined) this.model.position.y = y;
        if (z !== undefined) this.model.position.z = z;

        return this;
    }
}
