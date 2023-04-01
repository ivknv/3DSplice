import {Vector3, Raycaster, Box3, Group} from "three";
import InteractiveElement from "./InteractiveElement";
import Application from "./Application";
import {clamp} from "./common";
import * as Colors from "./colors";

export default class Fiber extends InteractiveElement {
    constructor(model, direction) {
        const group = new Group();
        group.add(model);
        model.rotation.z = 0;

        super(group, ["Cylinder_1", "Cylinder_2", "Cylinder_3"]);

        this.originalPosition = new Vector3();
        this.mouseDownPoint = new Vector3();
        this.held = false;
        this.raycaster = new Raycaster();
        this.direction = null;
        this.minX = 0;
        this.maxX = 0;

        // Create an invisible big cylinder to make it easier to click on the fiber
        this.padding = model.getObjectByName("Cylinder_1").clone();
        this.padding.visible = false;
        this.padding.scale.x = 3;
        this.padding.scale.y = 4;
        this.padding.scale.z = 8;
        this.model.rotation.z = -Math.PI * 0.5;

        this.addPadding();

        this.boundingBox = new Box3().setFromObject(this.model);

        this.setDirection(direction);

        this.tooltip = "Переместить волокно";
    }

    addPadding() {
        this.model.add(this.padding);
        this.objects[this.padding.uuid] = this.padding;
    }

    removePadding() {
        this.model.remove(this.padding);
        delete this.objects[this.padding.uuid];
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
        let clampElement = null;

        if (this.direction === "left") {
            clampElement = Application.splicer.children.leftFiberClamp;
        } else {
            clampElement = Application.splicer.children.rightFiberClamp;
        }

        return clampElement.isUp();
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

        if (this.held) this.syncWithMouse();

        this.updateRotation();
    }

    syncWithMouse() {
        const projected = this.projectMouseOntoFiber(
            Application.mouseHandler.position, Application.camera);

        const delta = projected.x - this.mouseDownPoint.x;

        this.setTipPosition(
            clamp(this.originalPosition.x + delta, this.minX, this.maxX),
            this.model.position.y,
            this.model.position.z);
    }

    onFocusLoss() {
        Application.mouseHandler.resetHoverFilter();
        this.highlightColor = Colors.HIGHLIGHT;

        if (this.held) {
            this.syncWithMouse();
            this.checkPlacement();
        }

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
