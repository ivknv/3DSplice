import InteractiveElement from "./InteractiveElement";
import AnimationActionController from "./AnimationActionController";

export default class AnimatedSplicerElement extends InteractiveElement {
    constructor(model, animations, mixer, objectNames, animationName) {
        super(model, objectNames);

        this.animationActionController = AnimationActionController.fromAnimationName(
            animations, mixer, animationName);
        this.animationActionController.onCompleted = () => {
            this.onAnimationCompleted();
        };
        this.animationActionController.onReset = () => {
            this.onAnimationReset();
        }
    }

    get animationState() {
        return this.animationActionController.state;
    }

    checkDependencies() {
        return true;
    }

    onClick(event) {
        if (this.checkDependencies()) {
            this.animationActionController.toggle();
        }
    }

    onAnimationCompleted() {}
    onAnimationReset() {}
};
