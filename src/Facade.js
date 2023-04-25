/**
 * "Заслон" для основных элементов приложения.
 *
 * @property {HTMLElement} domElement - HTML-элемент
 */
export default class Facade {
    constructor() {
        this.domElement = document.getElementById("facade");
    }

    /** Показывает заслон. */
    show() {
        this.domElement.style.opacity = "";
        this.domElement.style.pointerEvents = "auto";
    }

    /** Скрывает заслон. */
    hide() {
        this.domElement.style.opacity = "0";
        this.domElement.style.pointerEvents = "none";
    }
}
