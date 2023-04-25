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
        this.domElement.style.opacity = "";
        this.domElement.style.pointerEvents = "auto";
        this.domElement.dataset.hidden = "false";
    }

    /** Скрывает экран. */
    hide() {
        this.domElement.style.opacity = "0";
        this.domElement.style.pointerEvents = "none";
        this.domElement.dataset.hidden = "true";
    }

    /** Делает экран невидимым (не то же самое, что скрытие). */
    obscure() {
        this.domElement.style.opacity = "0";
        this.domElement.style.pointerEvents = "none";
        this.domElement.dataset.hidden = "false";
    }

    /**
     * Проверяет, был ли скрыт экран.
     * @return {boolean} признак скрытия экрана
     */
    isHidden() {
        return this.domElement.dataset.hidden === "true";
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
            Application.splashScreen.hide();
            Application.helpButton.hide();
            Application.theoryScreen.show();
        };

        this.domElement.addEventListener("click", this.onClick);
    }

    /** Удаляет все обработчики событий. */
    dispose() {
        this.domElement.removeEventListener("click", this.onClick);
    }
}
