import Application from "./Application";

/** Экрана помощи
 *
 * @property {HTMLElement} domElement - HTML-элемент экрана помощи
 */
export default class Help {
    constructor() {
        this.domElement = document.getElementById("help");
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
