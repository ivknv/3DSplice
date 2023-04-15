import Application from "./Application";

/**
 * Экран, показывающийся при первоначальной загрузке приложения
 *
 * @property {HTMLElement} domElement - HTML-элемент экрана
 */
export default class SplashScreen {
    constructor() {
        this.domElement = document.getElementById("splash-screen");
        this.startButton = new StartButton();
    }

    /** Удаляет все обработчики событий. */
    dispose() {
        this.startButton.dispose();
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

/** Кнопка "Начать"
 *
 * @property {HTMLElement} domElement - HTML-элемент кнопки
 */
class StartButton {
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
