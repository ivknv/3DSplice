import * as THREE from "three";

const DRAG_THRESHOLD = 2048;

export default class MouseHandler {
    constructor(application) {
        this.position = new THREE.Vector2(Infinity, Infinity);
        this.mouseDownPosition = this.position.clone();
        this.mouseDownSelection = null;
        this.root = application.renderer.domElement;
        this.hoveredElement = null;
        this.focusedElement = null;
        this.raycaster = new THREE.Raycaster();

        this.root.addEventListener("pointermove", event => {
            this.position.x = event.clientX / this.root.width * 2 - 1;
            this.position.y = -event.clientY / this.root.height * 2 + 1;
        });

        this.root.addEventListener("mousedown", event => {
            this.mouseDownSelection = this.hoveredElement;
            this.mouseDownPosition.copy(this.position);
        });

        this.root.addEventListener("mouseup", event => {
            const selection = this.hoveredElement;

            if (selection === null) {
                if (this.focusedElement) {
                    this.focusedElement.onFocusLoss(this);
                    this.focusedElement = null;
                }
                return;
            }

            const resolution = this.root.width * this.root.width + this.root.height * this.root.height;
            const offset = this.position.distanceToSquared(this.mouseDownPosition) * resolution;

            if (offset > DRAG_THRESHOLD) return;

            selection.onClick(application, event);

            if (selection !== this.focusedElement && this.focusedElement) {
                this.focusedElement.onFocusLoss(this);
            }
            this.focusedElement = selection;
        });
    }

    isHovering() {
        return this.hoveredElement !== null;
    }

    isCurrentlyHovered(element) {
        return element === this.hoveredElement;
    }

    updateHover(application) {
        this.raycaster.setFromCamera(this.position, application.camera);

        const intersection = this.raycaster.intersectObjects(application.models);
        const obj = intersection.length ? intersection[0].object : null;
        const element = application.getElementByObject(obj);

        if (this.isCurrentlyHovered(element)) return;

        if (this.isHovering()) {
            this.hoveredElement.clearHighlight();
        }

        this.hoveredElement = element;

        if (element !== null) {
            element.highlight();
        }
    }

    update(application)
    {
        this.updateHover(application);
    }
}
