import * as THREE from "three";

const DRAG_THRESHOLD = 2048;

export default class MouseHandler {
    constructor(splicer, rootElement) {
        this.position = new THREE.Vector2(Infinity, Infinity);
        this.mouseDownPosition = this.position.clone();
        this.mouseDownSelection = null;
        this.root = rootElement;
        this.hoveredElement = null;
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

            if (selection === null) return;

            const resolution = this.root.width * this.root.width + this.root.height * this.root.height;
            const offset = this.position.distanceToSquared(this.mouseDownPosition) * resolution;

            if (offset > DRAG_THRESHOLD) return;

            selection.onClick(splicer, event);
        });
    }

    isHovering() {
        return this.hoveredElement !== null;
    }

    isCurrentlyHovered(element) {
        return element === this.hoveredElement;
    }

    updateHover(splicer) {
        this.raycaster.setFromCamera(this.position, splicer.camera);

        const intersection = this.raycaster.intersectObjects(splicer.model.children);
        const obj = intersection.length ? intersection[0].object : null;
        const element = splicer.getElementByObjectName(obj?.name);

        if (this.isCurrentlyHovered(element)) return;

        if (this.isHovering()) {
            this.hoveredElement.clearHighlight();
        }

        this.hoveredElement = element;

        if (element !== null) {
            element.highlight();
        }
    }

    update(splicer)
    {
        this.updateHover(splicer);
    }
}
