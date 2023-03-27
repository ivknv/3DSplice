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
            const ratio = application.renderer.getPixelRatio();
            const w = this.root.width / ratio;
            const h = this.root.height / ratio;
            this.position.x = event.clientX / w * 2 - 1;
            this.position.y = -event.clientY / h * 2 + 1;
        });

        this.root.addEventListener("mousedown", event => {
            this.mouseDownSelection = this.hoveredElement;
            this.mouseDownPosition.copy(this.position);
        });

        this.root.addEventListener("mouseup", event => {
            let selection = this.hoveredElement;

            if (selection === null) {
                if (this.focusedElement) {
                    if (this.focusedElement.active) {
                        this.focusedElement.onFocusLoss(this);
                    }
                    this.focusedElement = null;
                }
                return;
            }

            const resolution = this.root.width * this.root.width + this.root.height * this.root.height;
            const offset = this.position.distanceToSquared(this.mouseDownPosition) * resolution;

            if (offset > DRAG_THRESHOLD) return;

            if (!selection.active) {
                selection = null;
            }

            if (selection) {
                selection.onClick(application, event);
            }

            if (selection !== this.focusedElement && this.focusedElement) {
                if (this.focusedElement.active) {
                    this.focusedElement.onFocusLoss(this);
                }
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
        let element = application.getElementByObject(obj);

        if (this.isCurrentlyHovered(element)) {
            if (element && !element.active) {
                element.clearHighlight();
                this.root.style.cursor = "auto";
                this.hoveredElement = null;
            }
            return;
        }

        if (this.isHovering()) {
            this.hoveredElement.clearHighlight();
            this.root.style.cursor = "auto";
        }

        if (element && !element.active) {
            element = null;
        }

        this.hoveredElement = element;

        if (element !== null) {
            element.highlight();
            this.root.style.cursor = "pointer";
        }
    }

    update(application)
    {
        this.updateHover(application);
    }

    addToApplication(application) {
        application.addObject(this);
    }

    removeFromApplication(application) {
        application.removeObject(this);
    }
}
