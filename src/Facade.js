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
        this.domElement.classList.remove("facade-hidden");
    }

    /** Скрывает заслон. */
    hide() {
        this.domElement.classList.add("facade-hidden");
    }
}
