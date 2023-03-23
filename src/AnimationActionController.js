import * as THREE from "three";

export default class AnimationActionController {
    constructor(mixer, animation) {
        this.state = "initial";
        this.animation = animation;
        this.action = mixer.clipAction(this.animation);
        this.action.clampWhenFinished = true;
        this.action.loop = THREE.LoopOnce;

        mixer.addEventListener("finished", (event) => {
            if (event.action !== this.action) return;

            if (this.state == "playing_forward") {
                this.state = "completed";
            } else if (this.state == "playing_back") {
                this.state = "initial";
            }
        });
    }

    static fromAnimationName(animations, mixer, name) {
        const animation = THREE.AnimationClip.findByName(animations, name);

        return new AnimationActionController(mixer, animation);
    }

    toggle() {
        if (this.canPlayForward()) {
            this.playForward();
        } else {
            this.playBack();
        }
    }

    canPlayForward() {
        return this.state == "initial" || this.state == "playing_back";
    }

    canPlayBack() {
        return this.state != "initial" || this.state == "playing_forward";
    }

    playForward() {
        if (this.canPlayForward()) {
            this.action.timeScale = 1;

            if (this.state != "playing_back") this.action.reset();

            this.state = "playing_forward";
            this.action.play();
        }
    }

    playBack() {
        if (this.canPlayBack()) {
            this.action.timeScale = -1;

            if (this.state == "completed") {
                this.action.reset();
                this.action.time = this.animation.duration;
            }

            this.state = "playing_back";
            this.action.play();
        }
    }
}
