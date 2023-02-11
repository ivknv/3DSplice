import SplicerElement from "./SplicerElement";
import AnimationActionController from "./AnimationActionController";

export default class AnimatedSplicerElement extends SplicerElement {
    constructor(splicer, objectNames, animationName) {
        super(splicer, objectNames);

        this.animationActionController = AnimationActionController.fromAnimationName(
            splicer, animationName);
    }

    onClick(splicer, event) {
        this.animationActionController.toggle();
    }
};
