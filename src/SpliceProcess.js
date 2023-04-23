import Application from "./Application";

/**
 * Класс, позволяющий управлять процессом сварки.
 *
 * @property {boolean} fibersPlaced - Флаг, указывающий на то, что оба волокна были (правильно) размещены
 * @property {boolean} active       - Флаг, указывающий на то, что сварка в процессе
 */
export default class SpliceProcess {
    constructor() {
        this.active = false;
    }

    dispose() {}

    start() {
        if (!this.fibersPlaced) return;

        this.active = true;
        Application.splicer.children.screen.startSpliceAnimation();
    }

    finish() {
        Application.splicer.children.screen.stopSpliceAnimation();

        this.active = false;
        Application.state.onSpliceCompleted();
    }

    get fibersPlaced() {
        return Application.leftFiber.placed && Application.rightFiber.placed;
    }
}
