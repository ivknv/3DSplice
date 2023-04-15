/**
 * Класс для управления отображаемыми инструкциями.
 *
 * @property {HTMLElement} domElement - HTML-элемент
 */
export default class Instructions {
    constructor() {
        this.domElement = document.createElement("section");
        this.domElement.id = "instructions";
    }

    /**
     * Задать текст инструкций.
     *
     * @property {string} text - Текст инструкций
     */
    setText(text) {
        this.domElement.innerText = text;
    }

    /** Сделать инструкции видимыми. */
    show() {
        this.domElement.style.display = "block";
    }

    /** Скрыть инструкции. */
    hide() {
        this.domElement.style.display = "none";
    }
}
