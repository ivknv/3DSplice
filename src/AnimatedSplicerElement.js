import SplicerElement from "./SplicerElement";
import AnimationActionController from "./AnimationActionController";

export default class AnimatedSplicerElement extends SplicerElement {
    constructor(splicer, objectNames, animationName) {
        super(splicer, objectNames);

        this.animationActionController = AnimationActionController.fromAnimationName(
            splicer, animationName);
        this.dependencies = {};
    }

    get animationState() {
        return this.animationActionController.state;
    }

    checkDependencies(splicer) {
        for (const dependency in this.dependencies) {
            const state = splicer.elements[dependency].animationState;
            if (state != this.dependencies[dependency]) return false;
        }

        return true;
    }

    onClick(splicer, event) {
        if (this.checkDependencies(splicer)) {
            this.animationActionController.toggle();
        }
    }
};
