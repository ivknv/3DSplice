import AnimatedInteractiveElement from "./AnimatedInteractiveElement";
import Application from "./Application";

export default class AnimatedSplicerElement extends AnimatedInteractiveElement {
    constructor(model, animations, mixer, objectNames, animationName) {
        super(model, animations, mixer, objectNames, animationName);

        this.dependencies = {};
    }

    checkDependencies() {
        for (const dependency in this.dependencies) {
            const state = Application.splicer.children[dependency].animationState;
            if (state != this.dependencies[dependency]) return false;
        }

        return true;
    }
};