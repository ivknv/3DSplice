import Application from "./Application";

export default class SpliceProcess {
    constructor() {
        this.active = false;

        Application.videoElement.addEventListener("ended", () => {
            this.reset();
            Application.state.onSpliceCompleted();
        });
    }

    start() {
        this.active = true;
        Application.videoElement.currentTime = 0;
        Application.videoElement.play();

        // placeholder for now
        setTimeout(function() {
            Application.state.onSpliceCompleted();
        }, 5000);
    }

    reset() {
        Application.videoElement.currentTime = 0;
        Application.videoElement.pause();
        this.active = false;
    }
}
