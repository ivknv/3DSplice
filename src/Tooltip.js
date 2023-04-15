/**
 * Класс для отображения и управления текстовыми подсказками.
 * 
 * @property {HTMLElement} domElement - HTML-элемент
 */
export default class Tooltip {
    constructor() {
        this.domElement = document.createElement("span");
        this.domElement.id = "tooltip";
    }

    /**
     * Задать текст подсказки.
     *
     * @property {string} text - Текст подсказки
     */
    setText(text) {
        this.domElement.innerText = text;
    }

    /** Сделать подсказку видимой. */
    show() {
        this.domElement.style.display = "inline-block";
        this.domElement.style.opacity = 1;
    }

    /**
     * Задать расположение подсказки.
     *
     * @param {number} x - x-координата расположения (в пикселях)
     * @param {number} y - y-координата расположения (в пикселях)
     */
    setPosition(x, y) {
        this.domElement.style.left = Math.floor(x) + "px";
        this.domElement.style.top = Math.floor(y) + "px";
    }

    /** Скрыть текстовую подсказку. */
    hide() {
        this.domElement.style.opacity = 0;
    }
}
