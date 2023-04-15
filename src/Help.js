import Application from "./Application";

/** Экрана помощи
 *
 * @property {HTMLElement} domElement - HTML-элемент экрана помощи
 */
export default class Help {
    constructor() {
        this.domElement = document.getElementById("help");
        this.hideButton = new HideHelpButton();
    }

    /** Удаляет все обработчики событий. */
    dispose() {
        this.hideElement.dispose();
    }

    /** Показывает экран помощи. */
    show() {
        Application.facade.show();
        Application.splashScreen.obscure();
        Application.helpButton.hide();

        this.domElement.classList.remove("help-hidden");
    }

    /** Скрывает экран помощи. */
    hide() {
        this.domElement.classList.add("help-hidden");
        Application.splashScreen.show();
        Application.helpButton.show();

        if (Application.splashScreen.isHidden()) {
            Application.facade.hide();
        }
    }
}

/** Кнопка для скрытия экрана помощи
 *
 * @property {HTMLElement} domElement - HTML-элемент кнопки
 */
class HideHelpButton {
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
