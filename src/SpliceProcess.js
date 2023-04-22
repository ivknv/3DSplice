import Application from "./Application";

export default class SpliceProcess {
    constructor(screen) {
        this.active = false;
        this.video = screen.spliceVideo;
        this.screen = screen;
        this.onVideoEnded = () => {
            this.reset();
            Application.state.onSpliceCompleted();
        };

        this.video.domElement.addEventListener("ended", this.onVideoEnded);
    }

    dispose() {
        this.video.domElement.removeEventListener("ended", this.onVideoEnded);
    }

    start() {
        this.active = true;
        this.screen.startSpliceAnimation();
    }

    reset() {
        this.video.seek(0);
        this.video.pause();
        this.active = false;
    }
}
