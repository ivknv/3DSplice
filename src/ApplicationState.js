import Application from "./Application";
import FusedFiber from "./FusedFiber";

export default class ApplicationState {
    constructor(name) {
        this.name = name;
    }

    onLeftFiberPlaced() {}
    onRightFiberPlaced() {}

    onLeftFiberRemoved() {}
    onRightFiberRemoved() {}

    onFiberRemoved() {}

    onLidOpened() {}
    onLidClosed() {}

    canOpenLid() {
        return Application.splicer.children.lid.isClosed();
    }

    canCloseLid() {
        return Application.splicer.children.lid.isOpen();
    }

    onLeftFiberClampDown() {}
    onLeftFiberClampUp() {}

    onRightFiberClampDown() {}
    onRightFiberClampUp() {}

    onLeftClampBarDown() {}
    onRightClampBarDown() {}

    onLeftClampBarUp() {}
    onRightClampBarUp() {}

    onSetPressed() {}
    onSpliceCompleted() {}
    onSpliceProtectionPlaced() {}
    onSpliceProtectionRemoved() {}

    onFiberPlacedInHeater() {}
    onFiberRemovedFromHeater() {}

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

    onLidOpened() { _instructToLiftClamps(); }

    onLidClosed() {
        if (Application.fibersPlaced) {
            Application.setInstructionText("Нажмите кнопку SET");
            Application.changeState(new ReadyToSpliceState());
        } else {
            Application.setInstructionText("Откройте крышку сварочного аппарата");
        }
    }

    onLeftClampBarUp() { _instructToLiftClamps(); }
    onRightClampBarUp() { _instructToLiftClamps(); }

    onLeftClampBarDown() {
        if (Application.fibersPlaced) {
            if (Application.splicer.children.rightClampBar.isDown()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
            } else {
                Application.setInstructionText("Опустите зажимы с правой стороны");
            }
        } else {
            _instructToLiftClamps();
        }
    }

    onRightClampBarDown() {
        if (Application.fibersPlaced) {
            if (Application.splicer.children.leftClampBar.isDown()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
            } else {
                Application.setInstructionText("Опустите зажимы с левой стороны");
            }
        } else {
            _instructToLiftClamps();
        }
    }

    onLeftFiberClampUp() {
        if (!Application.leftFiberPlaced) {
            Application.setInstructionText("Поместите левое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceLeftFiberState());
        } else {
            Application.setInstructionText("Опустите зажимы с левой стороны");
            Application.changeState(new LeftFiberPlacedState());
        }
    }

    onRightFiberClampUp() {
        if (!Application.leftFiberPlaced) {
            Application.setInstructionText("Поместите правое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceRightFiberState());
        } else {
            Application.setInstructionText("Опустите зажимы с правой стороны");
            Application.changeState(new RightFiberPlacedState());
        }
    }
}

export class CanPlaceLeftFiberState extends ApplicationState {
    constructor() {
        super("can_place_left_fiber");
    }

    onLeftFiberPlaced() {
        Application.setInstructionText("Опустите зажимы с левой стороны");
        Application.changeState(new LeftFiberPlacedState());
    }

    onLeftFiberClampDown() {
        Application.setInstructionText("Поднимите зажимы для волокна");
        Application.changeState(new InitialState());
    }
}

export class CanPlaceRightFiberState extends ApplicationState {
    constructor() {
        super("can_place_right_fiber");
    }

    onRightFiberPlaced() {
        Application.setInstructionText("Опустите зажимы с правой стороны");
        Application.changeState(new RightFiberPlacedState());
    }

    onRightFiberClampDown() {
        Application.setInstructionText("Поднимите зажимы для волокна");
        Application.changeState(new InitialState());
    }
}

export class RightFiberPlacedState extends ApplicationState {
    constructor() {
        super("right_fiber_placed");
    }

    onRightFiberRemoved() {
        Application.setInstructionText("Поместите правое волокно в сварочный аппарат");
        Application.changeState(new CanPlaceRightFiberState());
    }

    onRightFiberClampDown() {
        Application.setInstructionText("Опустите зажимы с правой стороны");
    }

    onRightClampBarDown() {
        if (Application.fibersPlaced) {
            if (Application.splicer.children.lid.checkDependencies()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
                Application.changeState(new FibersPlacedState());
            } else {
                Application.setInstructionText("Опустите зажимы с левой стороны");
                Application.changeState(new LeftFiberPlacedState());
            }
        } else if (Application.splicer.children.leftFiberClamp.isUp()) {
            Application.setInstructionText("Поместите левое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceLeftFiberState());
        } else {
            Application.setInstructionText("Поднимите зажимы с левой стороны");
            Application.changeState(new InitialState());
        }
    }
}

export class LeftFiberPlacedState extends ApplicationState {
    constructor() {
        super("left_fiber_placed");
    }

    onLeftFiberRemoved() {
        Application.setInstructionText("Поместите левое волокно в сварочный аппарат");
        Application.changeState(new CanPlaceLeftFiberState());
    }

    onLeftClampBarDown() {
        if (Application.fibersPlaced) {
            if (Application.splicer.children.lid.checkDependencies()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
                Application.changeState(new FibersPlacedState());
            } else {
                Application.setInstructionText("Опустите зажимы с правой стороны");
                Application.changeState(new RightFiberPlacedState());
            }
        } else if (Application.splicer.children.rightFiberClamp.isUp()) {
            Application.setInstructionText("Поместите правое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceRightFiberState());
        } else {
            Application.setInstructionText("Поднимите зажимы с правой стороны");
            Application.changeState(new InitialState());
        }
    }
}

export class FibersPlacedState extends ApplicationState {
    constructor() {
        super("fibers_placed");
    }

    onLeftClampBarUp() {
        Application.setInstructionText("Опустите зажимы с левой стороны");
        Application.changeState(new LeftFiberPlacedState());
    }

    onRightClampBarUp() {
        Application.setInstructionText("Опустите зажимы с правой стороны");
        Application.changeState(new RightFiberPlacedState());
    }

    onLeftClampBarDown() {
        if (Application.splicer.children.rightClampBar.isDown()) {
            Application.setInstructionText("Закройте крышку сварочного аппарата");
        } else {
            Application.setInstructionText("Опустите зажимы с правой стороны");
        }
    }

    onRightClampBarDown() {
        if (Application.splicer.children.leftClampBar.isDown()) {
            Application.setInstructionText("Закройте крышку сварочного аппарата");
        } else {
            Application.setInstructionText("Опустите зажимы с левой стороны");
        }
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

    onLeftFiberClampUp() {
        if (Application.splicer.children.rightFiberClamp.isUp()) {
            this._onFiberClampsUp()
        }
    }

    onRightFiberClampUp() {
        if (Application.splicer.children.leftFiberClamp.isUp()) {
            this._onFiberClampsUp()
        }
    }

    _onFiberClampsUp() {
        Application.fusedFiber.animationActionControllerLeft.playForward();
        Application.fusedFiber.animationActionControllerRight.playForward();
    }

    onFiberRemoved() {
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
        Application.fusedFiber.addPadding();

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

    onFiberPlacedInHeater() {
        Application.setInstructionText("Закройте крышку нагревателя");
    }

    onFiberRemovedFromHeater() {
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
        Application.changeState(new ReadyToPlaceFiberInHeaterState());
    }

    onMainHeaterLidOpened() {
        this._onHeaterLidsOpened();
    }

    onHeaterSideLidsOpened() {
        this._onHeaterLidsOpened();
    }

    onHeatPressed() {
        Application.setInstructionText("Дождитесь завершения работы нагревателя");
        Application.splicer.heaterIndicator.startFlashing();
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
        Application.splicer.heaterIndicator.stopFlashing();
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

    onFiberPlacedInHeater() {
        Application.setInstructionText("Волокно можно извлечь");
    }

    onFiberRemovedFromHeater() {
        Application.setInstructionText("");
    }
}
