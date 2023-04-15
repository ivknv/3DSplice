import Application from "./Application";

export default class SpliceProcess {
    constructor() {
        this.active = false;
        this.videoElement = Application.videoElement;
        this.onVideoEnded = () => {
            this.reset();
            Application.state.onSpliceCompleted();
        };

        this.videoElement.addEventListener("ended", this.onVideoEnded);
    }

    dispose() {
        this.videoElement.removeEventListener("ended", this.onVideoEnded);
    }

    start() {
        this.active = true;
        this.videoElement.currentTime = 0;
        this.videoElement.play();

        // placeholder for now
        setTimeout(function() {
            Application.state.onSpliceCompleted();
        }, 5000);
    }

    reset() {
        this.videoElement.currentTime = 0;
        this.videoElement.pause();
        this.active = false;
    }
}
