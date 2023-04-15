import Application from "./Application";

/** Кнопка "Начать"
 *
 * @property {HTMLElement} domElement - HTML-элемент кнопки
 */
export default class StartButton {
    constructor() {
        this.domElement = document.getElementById("start-button");
        this.onClick = () => {
            Application.instructions.show();
            Application.facade.hide();
            Application.splashScreen.hide();
        };

        this.domElement.addEventListener("click", this.onClick);
    }

    /** Удаляет все обработчики событий. */
    dispose() {
        this.domElement.removeEventListener("click", this.onClick);
    }

    /** Показывает кнопку. */
    show() {
        this.domElement.classList.remove("start-button-hidden");
    }

    /** Скрывает кнопку. */
    hide() {
        this.domElement.classList.add("start-button-hidden");
    }
}
