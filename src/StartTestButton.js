import Application from "./Application";

export default class StartTestButton {
    constructor() {
        this.domElement = document.createElement("button");
        this.domElement.style.opacity = "0";
        this.domElement.style.pointerEvents = "none";
        this.domElement.classList.add("blue-button");
        this.domElement.classList.add("blue-button-centered");
        this.domElement.innerText = "Приступить к тесту";
        this.domElement.style.position = "absolute";
        this.domElement.style.left = "0";
        this.domElement.style.right = "0";
        this.domElement.style.bottom = "40px";
        this.domElement.style.zIndex = "20";
    }
    
    dispose() {}
    
    show() {
        this.domElement.style.opacity = "1";
        this.domElement.style.pointerEvents = "auto";
    }
    
    hide() {
        this.domElement.style.opacity = "0";
        this.domElement.style.pointerEvents = "none";
    }
}