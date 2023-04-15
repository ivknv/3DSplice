/**
 * Экран, показывающийся при первоначальной загрузке приложения
 *
 * @property {HTMLElement} domElement - HTML-элемент экрана
 */
export default class SplashScreen {
    constructor() {
        this.domElement = document.getElementById("splash-screen");
    }

    /** Показывает экран. */
    show() {
        this.domElement.classList.remove("splash-screen-obscured");
    }

    /** Скрывает экран. */
    hide() {
        this.domElement.classList.add("splash-screen-hidden");
    }

    /** Делает экран невидимым (не то же самое, что скрытие). */
    obscure() {
        this.domElement.classList.add("splash-screen-obscured");
    }

    /**
     * Проверяет, был ли скрыт экран.
     * @return {boolean} признак скрытия экрана
     */
    isHidden() {
        return this.domElement.classList.contains("splash-screen-hidden");
    }
}
