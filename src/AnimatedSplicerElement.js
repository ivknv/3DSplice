import InteractiveElement from "./InteractiveElement";
import AnimationActionController from "./AnimationActionController";

export default class AnimatedInteractiveElement extends InteractiveElement {
    constructor(model, animations, mixer, objectNames, animationName) {
        super(model, objectNames);

        this.animationActionController = AnimationActionController.fromAnimationName(
            animations, mixer, animationName);
        this.dependencies = {};
    }

    get animationState() {
        return this.animationActionController.state;
    }

    checkDependencies(application) {
        for (const dependency in this.dependencies) {
            const state = application.splicer.elements[dependency].animationState;
            if (state != this.dependencies[dependency]) return false;
        }

        return true;
    }

    onClick(application, event) {
        if (this.checkDependencies(application)) {
            this.animationActionController.toggle();
        }
    }
};
