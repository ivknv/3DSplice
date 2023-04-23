import Application from "./Application";

export default class HeatingProcess {
    constructor() {
        this.active = false;
    }

    start() {
        this.active = true;
        Application.splicer.heaterIndicator.startFlashing();
        Application.spliceProtectionCase.shrink();
    }

    finish() {
        Application.splicer.heaterIndicator.stopFlashing();
        this.active = false;
        Application.state.onHeatingCompleted();
    }
}
