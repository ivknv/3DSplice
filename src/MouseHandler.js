import * as THREE from "three";
import Application from "./Application";

const DRAG_THRESHOLD = 2048;

/**
 * Класс, ответственный за отслеживание событий мыши (или сенсорного экрана).
 * @property {THREE.Vector2}             position       - Текущие координаты мыши в пространстве Three.js
 * @property {THREE.Vector2}             positionPx     - Текущие координаты мыши без преоьразования
 * @property {(InteractiveElement|null)} hoveredElement - Текущий элемент под курсором мыши
 * @property {(InteractiveElement|null)} focusedElement - Текущий выбранный элемент
 * @property {function}                  hoverFilter    - Позволяет определить, какие элементы
 *     могут реагировать на наведение. Функция должна принмать элемент и возвращать true, если
 *     элемент может реагировать на наведение мыши, иначе - false
 */
export default class MouseHandler {
    /** Создает экземпляр MouseHandler */
    constructor() {
        // Position in Three.js space
        this.position = new THREE.Vector2(Infinity, Infinity);

        // Position in pixels based purely on event.clientX and event.clientY
        this.positionPx = this.position.clone();

        this.mouseDownPosition = this.position.clone();
        this.mouseDownSelection = null;
        this.root = Application.renderer.domElement;
        this.hoveredElement = null;
        this.focusedElement = null;
        this.raycaster = new THREE.Raycaster();

        // Used to determine what elements can be hovered
        this.hoverFilter = function(element) { return true; };

        this.root.addEventListener("pointermove", event => {
            this.updateMousePosition(event.clientX, event.clientY);
        });

        this.root.addEventListener("mousedown", event => {
            this.updateMousePosition(event.clientX, event.clientY);
            this.updateHover();
            this.mouseDownSelection = this.hoveredElement;
            this.mouseDownPosition.copy(this.position);
        });

        this.root.addEventListener("mouseup", event => {
            let selection = this.hoveredElement;

            if (selection === null) {
                if (this.focusedElement) {
                    if (this.focusedElement.active) {
                        this.focusedElement.onFocusLoss();
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
                selection.onClick(event);
            }

            if (selection !== this.focusedElement && this.focusedElement) {
                if (this.focusedElement.active) {
                    this.focusedElement.onFocusLoss();
                }
            }
            this.focusedElement = selection;
        });
    }

    /**
     * Обновляет текущие координаты мыши
     * @param {number} x - X-координата мыши в окне
     * @param {number} y - Y-координата мыши в окне
     */
    updateMousePosition(x, y) {
        const ratio = Application.renderer.getPixelRatio();
        const w = this.root.width / ratio;
        const h = this.root.height / ratio;

        this.position.x = x / w * 2 - 1;
        this.position.y = -y / h * 2 + 1;
        this.positionPx.x = x;
        this.positionPx.y = y;
    }

    /**
     * Задает hoverFilter.
     * @param {function} filter - Фильтр наведения мыши
     */
    setHoverFilter(filter) {
        this.hoverFilter = filter;
    }

    /** Сбрасывает hoverFilter */
    resetHoverFilter() {
        this.hoverFilter = function(element) { return true; };
    }

    /**
     * Позволяет определить, если ли элемент под курсором мыши.
     * @return {boolean}
     */
    isHovering() {
        return this.hoveredElement !== null;
    }

    /**
     * Проверяет, находится ли элемент под курсором.
     * @return {boolean}
     */
    isCurrentlyHovered(element) {
        return element === this.hoveredElement;
    }

    /** Обновляет текущий элемент под мышью */
    updateHover() {
        this.raycaster.setFromCamera(this.position, Application.camera);

        const intersection = this.raycaster.intersectObjects(Application.models);
        const obj = intersection.length ? intersection[0].object : null;
        let element = Application.getElementByObject(obj);

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

        if (element && !element.active || !this.hoverFilter(element)) {
            element = null;
        }

        this.hoveredElement = element;

        if (element !== null) {
            element.highlight();
            this.root.style.cursor = "pointer";
        }

        this.updateTooltip();
    }

    /** Обновляет текстовую подсказку над элементом */
    updateTooltip() {
        const tooltip = Application.tooltipElement;
        const element = this.hoveredElement;

        if (element !== null && element.tooltip) {
            tooltip.innerText = element.tooltip;
            tooltip.style.display = "inline-block";
            tooltip.style.opacity = 1;
            tooltip.style.left = Math.floor(this.positionPx.x + 16) + "px";
            tooltip.style.top = Math.floor(this.positionPx.y + 16) + "px";
        } else {
            tooltip.style.opacity = 0;
        }
    }

    /** Обновляет состояние объекта */
    update()
    {
        this.updateHover();
    }

    addToApplication() {
        Application.addObject(this);
    }

    removeFromApplication() {
        Application.removeObject(this);
    }
}
