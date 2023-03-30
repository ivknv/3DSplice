import Application from "./Application";
import FusedFiber from "./FusedFiber";

export default class ApplicationState {
    constructor(name) {
        this.name = name;
    }

    onFibersPlaced() {}
    onFibersRemoved() {}

    onLidOpened() {}
    onLidClosed() {}

    canOpenLid() {
        return Application.splicer.children.lid.isClosed();
    }

    canCloseLid() {
        return Application.splicer.children.lid.isOpen();
    }

    onFiberClampsDown() {}
    onFiberClampsUp() {}
    onClampBarsDown() {}
    onClampBarsUp() {}

    onSetPressed() {}
    onSpliceCompleted() {}
    onSpliceProtectionPlaced() {}
    onSpliceProtectionRemoved() {}
    onFiberPlacedInHeater() {}

    onMainHeaterLidOpened() {}
    onMainHeaterLidClosed() {}

    onHeaterSideLidsOpened() {}
    onHeaterSideLidsClosed() {}

    canPlaceSpliceProtection() {
        return false;
    }

    canOpenMainHeaterLid() {
        return Application.splicer.children.mainHeaterLid.isClosed();
    }

    canCloseMainHeaterLid() {
        return Application.splicer.children.mainHeaterLid.isOpen();
    }

    canOpenHeaterSideLids() {
        return Application.splicer.children.heaterSideLids.isClosed();
    }

    canCloseHeaterSideLids() {
        return Application.splicer.children.heaterSideLids.isOpen();
    }

    canPlaceFiberInHeater() {
        return false;
    }

    onHeatPressed() {}
    onHeatingCompleted() {}
}

function _instructToLiftClamps() {
    Application.setInstructionText("Поднимите зажимы для волокна");
}

export class InitialState extends ApplicationState {
    constructor() {
        super("initial");
    }

    onFibersPlaced() {
        Application.setInstructionText("Опустите зажимы");
        Application.changeState(new FibersPlacedState());
    }

    onLidOpened() { _instructToLiftClamps(); }

    onLidClosed() {
        Application.setInstructionText("Откройте крышку сварочного аппарата");
    }

    onClampBarsUp() { _instructToLiftClamps(); }
    onClampBarsDown() { _instructToLiftClamps(); }
    onFiberClampsDown() { _instructToLiftClamps(); }

    onFiberClampsUp() {
        Application.setInstructionText("Поместите волокна в сварочный аппарат");
    }
}

export class FibersPlacedState extends ApplicationState {
    constructor() {
        super("fibers_placed");
    }

    onFibersRemoved() {
        Application.setInstructionText("Поместите волокна в сварочный аппарат");
        Application.changeState(new InitialState());
    }

    onClampBarsDown() {
        Application.setInstructionText("Закройте крышку сварочного аппарата");
    }

    onFiberClampsDown() {
        Application.setInstructionText("Опустите зажимы");
    }

    onLidClosed() {
        Application.setInstructionText("Нажмите на кнопку SET");
        Application.changeState(new ReadyToSpliceState());
    }
}

export class ReadyToSpliceState extends ApplicationState {
    constructor() {
        super("ready_to_splice");
    }

    onLidOpened() {
        Application.setInstructionText("Закройте крышку сварочного аппарата");
        Application.changeState(new FibersPlacedState());
    }

    onSetPressed() {
        Application.setInstructionText("Дождитесь завершения сварки");
        Application.changeState(new SpliceInProgressState());

        Application.splicer.children.screen.startSpliceAnimation();

        setTimeout(function() {
            Application.state.onSpliceCompleted();
        }, 5000);
    }
}

export class SpliceInProgressState extends ApplicationState {
    constructor() {
        super("splice_in_progress");
    }

    canOpenLid() {
        return false;
    }

    onSpliceCompleted() {
        const leftFiber = Application.leftFiber;
        const rightFiber = Application.rightFiber;

        // Move fibers together (and fuse them)
        leftFiber.setTipPosition(0.0003);
        rightFiber.setTipPosition(-0.0003);

        leftFiber.removeFromApplication();
        rightFiber.removeFromApplication();

        leftFiber.active = false;
        rightFiber.active = false;

        const fiber = new FusedFiber(leftFiber, rightFiber);

        fiber.addToApplication();
        Application.fusedFiber = fiber;

        // A simple hack to make sure spliceProtectionCase is always updated after the fibers
        Application.spliceProtectionCase.removeFromApplication();
        Application.spliceProtectionCase.addToApplication();

        Application.setInstructionText("Извлеките волокно из сварочного аппарата");
        Application.changeState(new SpliceCompletedState());
    }
}

export class SpliceCompletedState extends ApplicationState {
    constructor() {
        super("splice_completed");
    }

    onLidOpened() {
        Application.setInstructionText("Поднимите зажимы для волокна");
    }

    onLidClosed() {
        Application.setInstructionText("Извлеките волокно из сварочного аппарата");
    }

    onFiberClampsUp() {
        Application.fusedFiber.animationActionControllerLeft.playForward();
        Application.fusedFiber.animationActionControllerRight.playForward();
    }

    onFibersRemoved() {
        Application.setInstructionText("Разместите гильзу КДЗС в центре места сварки");
        Application.changeState(new ReadyToPlaceSpliceProtection());
    }
}

export class ReadyToPlaceSpliceProtection extends ApplicationState {
    constructor() {
        super("ready_to_place_splice_protection");
    }

    onSpliceProtectionPlaced() {
        Application.setInstructionText("Поместите волокно с КДЗС в нагреватель");

        if (Application.splicer.children.mainHeaterLid.isOpen() && Application.splicer.children.heaterSideLids.isOpen()) {
            Application.changeState(new ReadyToPlaceFiberInHeaterState());
        } else {
            Application.changeState(new SpliceProtectionPlacedState());
        }
    }

    onSpliceProtectionRemoved() {
        Application.setInstructionText("Разместите гильзу КДЗС в центре места сварки");
    }

    canPlaceSpliceProtection() {
        return true;
    }
}

function _instructToOpenHeater() {
    Application.setInstructionText("Откройте крышку нагревателя");
}

export class SpliceProtectionPlacedState extends ApplicationState {
    constructor() {
        super("splice_protection_placed");
    }

    onMainHeaterLidClosed() {
        _instructToOpenHeater();
    }

    onHeaterSideLidsClosed() {
        _instructToOpenHeater();
    }

    onMainHeaterLidOpened() {
        if (Application.splicer.children.heaterSideLids.isOpen()) {
            this._onHeaterLidsOpened();
        }
    }

    onHeaterSideLidsOpened() {
        if (Application.splicer.children.mainHeaterLid.isOpen()) {
            this._onHeaterLidsOpened();
        }
    }

    _onHeaterLidsOpened() {
        Application.setInstructionText("Поместите волокно с КДЗС в нагреватель");
        Application.changeState(new ReadyToPlaceFiberInHeaterState());
    }
}

export class ReadyToPlaceFiberInHeaterState extends ApplicationState {
    constructor() {
        super("ready_to_place_fiber_in_heater");
    }

    canPlaceFiberInHeater() {
        if (!Application.splicer.children.mainHeaterLid.isOpen()) return false;
        if (!Application.splicer.children.heaterSideLids.isOpen()) return false;

        return true;
    }

    onFibersPlaced() {
        Application.setInstructionText("Закройте крышку нагревателя");
    }

    onFibersRemoved() {
        Application.setInstructionText("Поместите волокно с КДЗС в нагреватель");
    }

    _onHeaterLidsClosed() {
        Application.setInstructionText("Нажмите на кнопку HEAT");
        Application.changeState(new ReadyToHeatState());
    }

    _canInteractWithHeaterLid() {
        return Application.leftFiber.model.position.y < 0.05;
    }

    canOpenHeaterSideLids() {
        return false;
    }

    canCloseHeaterSideLids() {
        if (!super.canCloseHeaterSideLids()) return false;
        return this._canInteractWithHeaterLid();
    }

    canOpenMainHeaterLid() {
        return false;
    }

    canCloseMainHeaterLid() {
        if (!super.canCloseMainHeaterLid()) return false;
        return this._canInteractWithHeaterLid();
    }

    onMainHeaterLidClosed() {
        if (Application.splicer.children.heaterSideLids.isClosed()) {
            this._onHeaterLidsClosed();
        } else {
            Application.setInstructionText("Закройте крышку нагревателя");
        }
    }

    onHeaterSideLidsClosed() {
        if (Application.splicer.children.mainHeaterLid.isClosed()) {
            this._onHeaterLidsClosed();
        } else {
            Application.setInstructionText("Закройте крышку нагревателя");
        }
    }
}

export class ReadyToHeatState extends ApplicationState {
    constructor() {
        super("ready_to_heat");
    }

    _onHeaterLidsOpened() {
        Application.setInstructionText("Закройте крышку нагревателя");
        Application.changeState(new ReadyToHeatState());
    }

    onMainHeaterLidOpened() {
        this._onHeaterLidsOpened();
    }

    onHeaterSideLidsOpened() {
        this._onHeaterLidsOpened();
    }

    onHeatPressed() {
        Application.setInstructionText("Дождитесь завершения работы нагревателя");
        Application.changeState(new HeatingInProgressState());
        Application.spliceProtectionCase.shrink();
    }
}

export class HeatingInProgressState extends ApplicationState {
    constructor() {
        super("heating_in_progress");
    }

    canOpenMainHeaterLid() {
        return false;
    }

    canOpenHeaterSideLids() {
        return false;
    }

    onHeatingCompleted() {
        Application.setInstructionText("Волокно можно извлечь");
        Application.changeState(new HeatingCompletedState());
    }
}

export class HeatingCompletedState extends ApplicationState {
    constructor() {
        super("heating_completed");
    }

    canPlaceFiberInHeater() {
        if (!Application.splicer.children.mainHeaterLid.isOpen()) return false;
        if (!Application.splicer.children.heaterSideLids.isOpen()) return false;

        return true;
    }

    _canInteractWithHeaterLid() {
        return Application.leftFiber.model.position.y < 0.05 || Application.leftFiber.model.position.y > 0.068;
    }

    canOpenHeaterSideLids() {
        if (!super.canOpenHeaterSideLids()) return false;
        return this._canInteractWithHeaterLid();
    }

    canCloseHeaterSideLids() {
        if (!super.canCloseHeaterSideLids()) return false;
        return this._canInteractWithHeaterLid();
    }

    canOpenMainHeaterLid() {
        if (!super.canOpenMainHeaterLid()) return false;
        return this._canInteractWithHeaterLid();
    }

    canCloseMainHeaterLid() {
        if (!super.canCloseMainHeaterLid()) return false;
        return this._canInteractWithHeaterLid();
    }

    onFibersPlaced() {
        Application.setInstructionText("Волокно можно извлечь");
    }

    onFibersRemoved() {
        Application.setInstructionText("");
    }
}
