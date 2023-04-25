import Application from "./Application";

export default class TheoryScreen {
    constructor() {
        this.domElement = document.getElementById("theory");
        this.finishButton = new FinishButton();
    }

    dispose() {
        this.finishButton.dispose();
    }

    show() {
        this.domElement.style.opacity = "";
        this.domElement.style.pointerEvents = "auto";
        this.domElement.scroll(0, 0);
    }

    hide() {
        this.domElement.style.opacity = "0";
        this.domElement.style.pointerEvents = "none";
    }
}

class FinishButton {
    constructor() {
        this.domElement = document.getElementById("finish-theory-button");
        this.onClick = () => {
            Application.instructions.show();
            Application.theoryScreen.hide();
            Application.facade.hide();
            Application.helpButton.show();
        };

        this.domElement.addEventListener("click", this.onClick);
    }

    /** Удаляет все обработчики событий. */
    dispose() {
        this.domElement.removeEventListener("click", this.onClick);
    }
}
