import Application from "./Application";

/** Кнопка для скрытия экрана помощи
 *
 * @property {HTMLElement} domElement - HTML-элемент кнопки
 */
export default class HideHelpButton {
    constructor() {
        this.domElement = document.getElementById("hide-help-button");
        this.onClick = () => {
            Application.help.hide();
        };

        this.domElement.addEventListener("click", this.onClick);
    }

    /** Удаляет все обработчики событий. */
    dispose() {
        this.domElement.removeEventListener("click", this.onClick);
    }
}
