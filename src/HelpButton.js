import Application from "./Application";

/** Кнопка для показания экрана помощи
 *
 * @property {HTMLElement} domElement - HTML-элемент кнопки
 */
export default class HelpButton {
    constructor() {
        this.domElement = document.getElementById("help-button");
        this.onClick = () => {
            Application.help.show();
        };

        this.domElement.addEventListener("click", this.onClick);
    }

    /** Удаляет все обработчики событий. */
    dispose() {
        this.domElement.removeEventListener("click", this.onClick);
    }

    /** Показывает кнопку. */
    show() {
        this.domElement.classList.remove("help-button-hidden");
    }

    /** Скрывает кнопку. */
    hide() {
        this.domElement.classList.add("help-button-hidden");
    }
}
