import Application from "./Application";
import FusedFiber from "./FusedFiber";

/**
 * Данный класс позволяет определять поведение приложения в зависимости от текущего состояния.
 * Каждое отдельное состояние приложения может быть представлено отдельным
 * классом, наследующимся от ApplicationState.
 *
 * @property {string} name - Имя состояния
 */
export default class ApplicationState {
    /**
     * Создает экземпляр ApplicationState
     * @param {string} name - Имя состояния
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Позволяет контролировать, можно включить сварочный аппарат
     * @return {boolean} true, если можно
     */
    canTurnOn() {
        return false;
    }

    /**
     * Позволяет контролиорвать, можно выключить сварочный аппарат
     * @return {boolean} true, если можно
     */
    canTurnOff() {
        return false;
    }

    /** Вызывается при включении сварочного аппарата */
    onPowerOn() {}

    /** Вызывается при правильном размещении левого волокна */
    onLeftFiberPlaced() {}

    /** Вызывается при правильном размещении правого волокна */
    onRightFiberPlaced() {}

    /** Вызывается при извлечении левого волокна или если оно расположено неправильно */
    onLeftFiberRemoved() {}

    /** Вызывается при извлечении правого волокна или если оно расположено неправильно */
    onRightFiberRemoved() {}

    /** Вызывается, когда сваренное волокно извлечено из сварочного аппарата */
    onFiberRemoved() {}

    /** Вызывается, когда крышка сварочного аппарата открыта */
    onLidOpened() {}

    /** Вызывается, когда крышка сварочного аппарата закрыта */
    onLidClosed() {}

    /**
     * Позволяет контролировать, можно ли открывать крышку сварочного аппарата
     * @return {boolean} можно ли открыть крышку
     */
    canOpenLid() {
        return Application.splicer.children.lid.isClosed();
    }

    /**
     * Позволяет контролировать, можно ли закрывать крышку сварочного аппарата
     * @return {boolean} можно ли закрыть крышку
     */
    canCloseLid() {
        return Application.splicer.children.lid.isOpen();
    }

    /** Вызывается, когда левый зажим волокна опущен */
    onLeftFiberClampDown() {}

    /** Вызывается, когда левый зажим волокна поднят */
    onLeftFiberClampUp() {}

    /** Вызывается, когда правый зажим волокна опущен */
    onRightFiberClampDown() {}

    /** Вызывается, когда правый зажим волокна поднят */
    onRightFiberClampUp() {}

    /** Вызывается, когда левый зажим оболочки волокна опущен */
    onLeftFiberCladdingClampDown() {}

    /** Вызывается, когда левый зажим оболочки волокна поднят */
    onLeftFiberCladdingClampUp() {}

    /** Вызывается, когда правый зажим оболочки волокна опущен */
    onRightFiberCladdingClampDown() {}

    /** Вызывается, когда правый зажим оболочки волокна поднят */
    onRightFiberCladdingClampUp() {}

    /** Вызывается, когда нажата кнопка SET */
    onSetPressed() {}

    /** Вызывается после завершения процесса сварки */
    onSpliceCompleted() {}

    /** Вызывается после правильного размещения гильзы КДЗС */
    onSpliceProtectionPlaced() {}

    /**
     * Вызывается, если гильза КДЗС была перемещена слишком далеко от центра
     * сварного соединения
     */
    onSpliceProtectionRemoved() {}

    /** Вызывается, когда ОВ помещено в нагреватель */
    onFiberPlacedInHeater() {}

    /** Вызывается, когда ОВ извлечено из нагревателя */
    onFiberRemovedFromHeater() {}

    /** Вызывается, когда крышка нагревателя открыта */
    onMainHeaterLidOpened() {}

    /** Вызывается, когда крышка нагревателя закрыта */
    onMainHeaterLidClosed() {}

    /** Вызывается, когда зажимы нагревателя подняты */
    onHeaterClampsOpened() {}

    /** Вызывается, когда зажимы нагревателя опущены */
    onHeaterClampsClosed() {}

    /**
     * Позволяет контролировать, можно ли перемещать гильзу КДЗС
     * @return {boolean} можно ли перемещать гильзу КДЗС
     */
    canPlaceSpliceProtection() {
        return false;
    }

    /**
     * Позволяет контролировать, можно ли открывать крышку нагревателя
     * @return {boolean} можно ли открывать крышку нагревателя
     */
    canOpenMainHeaterLid() {
        return Application.splicer.children.mainHeaterLid.isClosed();
    }

    /**
     * Позволяет контролировать, можно ли закрывать крышку нагревателя
     * @return {boolean} можно ли закрывать крышку нагревателя
     * */
    canCloseMainHeaterLid() {
        return Application.splicer.children.mainHeaterLid.isOpen();
    }

    /**
     * Позволяет контролировать, можно ли поднимать зажимы нагревателя
     * @return {boolean} можно ли поднимать зажимы нагревателя
     */
    canLiftHeaterClamps() {
        return Application.splicer.children.heaterClamps.isDown();
    }

    /**
     * Позволяет контролировать, можно ли опускать зажимы нагревателя
     * @return {boolean} можно ли опускать зажимы нагревателя
     */
    canLowerHeaterClamps() {
        return Application.splicer.children.heaterClamps.isUp();
    }

    /**
     * Позволяет контролировать, можно ли помещать ОВ в нагреватель
     * @return {boolean} можно ли помещать ОВ в нагреватель
     */
    canPlaceFiberInHeater() {
        return false;
    }

    /** Вызывается при нажатии на кнопку HEAT */
    onHeatPressed() {}

    /** Вызывается после завершения процесса термоусадки гильзы КДЗС */
    onHeatingCompleted() {}
}

/** Исходное состояние */
export class InitialState extends ApplicationState {
    /**
     * Создает экземпляр InitialState.
     */
    constructor() {
        super("initial")
    }

    canTurnOn() {
        return true;
    }

    canOpenLid() {
        return false;
    }

    onPowerOn() {
        Application.changeState(new SplicerOnState());
        Application.instructions.setText("Откройте крышку сварочного аппарата");
    }
}

function _instructToLiftClamps() {
    Application.instructions.setText("Поднимите зажимы для волокна");
}

/** Состояние, в котором сварочный аппарат включен */
export class SplicerOnState extends ApplicationState {
    /**
     * Создает экземпляр SplicerOnState.
     */
    constructor() {
        super("splicer_on");
    }

    onLidOpened() { _instructToLiftClamps(); }

    onLidClosed() {
        if (Application.spliceProcess.fibersPlaced) {
            Application.instructions.setText("Нажмите кнопку SET");
            Application.changeState(new ReadyToSpliceState());
        } else {
            Application.instructions.setText("Откройте крышку сварочного аппарата");
        }
    }

    onLeftFiberCladdingClampUp() { _instructToLiftClamps(); }
    onRightFiberCladdingClampUp() { _instructToLiftClamps(); }

    onLeftFiberCladdingClampDown() {
        if (Application.spliceProcess.fibersPlaced) {
            if (Application.splicer.children.rightFiberCladdingClamp.isDown()) {
                Application.instructions.setText("Закройте крышку сварочного аппарата");
            } else {
                Application.instructions.setText("Опустите зажимы с правой стороны");
            }
        } else {
            _instructToLiftClamps();
        }
    }

    onRightFiberCladdingClampDown() {
        if (Application.spliceProcess.fibersPlaced) {
            if (Application.splicer.children.leftFiberCladdingClamp.isDown()) {
                Application.instructions.setText("Закройте крышку сварочного аппарата");
            } else {
                Application.instructions.setText("Опустите зажимы с левой стороны");
            }
        } else {
            _instructToLiftClamps();
        }
    }

    onLeftFiberClampUp() {
        if (!Application.leftFiber.placed) {
            Application.instructions.setText("Поместите левое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceLeftFiberState());
        } else {
            Application.instructions.setText("Опустите зажимы с левой стороны");
            Application.changeState(new LeftFiberPlacedState());
        }
    }

    onRightFiberClampUp() {
        if (!Application.rightFiber.placed) {
            Application.instructions.setText("Поместите правое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceRightFiberState());
        } else {
            Application.instructions.setText("Опустите зажимы с правой стороны");
            Application.changeState(new RightFiberPlacedState());
        }
    }
}

/** Состояние, в котором можно разместить левое волокно */
export class CanPlaceLeftFiberState extends ApplicationState {
    /**
     * Создает экземпляр CanPlaceLeftFiberState.
     */
    constructor() {
        super("can_place_left_fiber");
    }

    onLeftFiberPlaced() {
        Application.instructions.setText("Опустите зажимы с левой стороны");
        Application.changeState(new LeftFiberPlacedState());
    }

    onLeftFiberClampDown() {
        Application.instructions.setText("Поднимите зажимы для волокна");
        Application.changeState(new SplicerOnState());
    }
}

/** Состояние, в котором можно разместить правое волокно */
export class CanPlaceRightFiberState extends ApplicationState {
    /**
     * Создает экземпляр CanPlaceRightFiberState.
     */
    constructor() {
        super("can_place_right_fiber");
    }

    onRightFiberPlaced() {
        Application.instructions.setText("Опустите зажимы с правой стороны");
        Application.changeState(new RightFiberPlacedState());
    }

    onRightFiberClampDown() {
        Application.instructions.setText("Поднимите зажимы для волокна");
        Application.changeState(new SplicerOnState());
    }
}

/** Состояние, в котором правое волокно правильно расположено */
export class RightFiberPlacedState extends ApplicationState {
    /**
     * Создает экземпляр RightFiberPlacedState.
     */
    constructor() {
        super("right_fiber_placed");
    }

    onRightFiberRemoved() {
        Application.instructions.setText("Поместите правое волокно в сварочный аппарат");
        Application.changeState(new CanPlaceRightFiberState());
    }

    onRightFiberCladdingClampDown() {
        if (Application.spliceProcess.fibersPlaced) {
            if (Application.splicer.children.lid.checkDependencies()) {
                Application.instructions.setText("Закройте крышку сварочного аппарата");
                Application.changeState(new FibersPlacedState());
            } else {
                Application.instructions.setText("Опустите зажимы с левой стороны");
                Application.changeState(new LeftFiberPlacedState());
            }
        } else if (Application.splicer.children.leftFiberClamp.isUp()) {
            Application.instructions.setText("Поместите левое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceLeftFiberState());
        } else {
            Application.instructions.setText("Поднимите зажимы с левой стороны");
            Application.changeState(new SplicerOnState());
        }
    }
}

/** Состояние, в котором левое волокно правильно расположено */
export class LeftFiberPlacedState extends ApplicationState {
    /**
     * Создает экземпляр LeftFiberPlacedState.
     */
    constructor() {
        super("left_fiber_placed");
    }

    onLeftFiberRemoved() {
        Application.instructions.setText("Поместите левое волокно в сварочный аппарат");
        Application.changeState(new CanPlaceLeftFiberState());
    }

    onLeftFiberCladdingClampDown() {
        if (Application.spliceProcess.fibersPlaced) {
            if (Application.splicer.children.lid.checkDependencies()) {
                Application.instructions.setText("Закройте крышку сварочного аппарата");
                Application.changeState(new FibersPlacedState());
            } else {
                Application.instructions.setText("Опустите зажимы с правой стороны");
                Application.changeState(new RightFiberPlacedState());
            }
        } else if (Application.splicer.children.rightFiberClamp.isUp()) {
            Application.instructions.setText("Поместите правое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceRightFiberState());
        } else {
            Application.instructions.setText("Поднимите зажимы с правой стороны");
            Application.changeState(new SplicerOnState());
        }
    }
}

/** Состояние, в котором оба волокна правильно расположены */
export class FibersPlacedState extends ApplicationState {
    /**
     * Создает экземпляр FibersPlacedState.
     */
    constructor() {
        super("fibers_placed");
    }

    onLeftFiberCladdingClampUp() {
        Application.instructions.setText("Опустите зажимы с левой стороны");
        Application.changeState(new LeftFiberPlacedState());
    }

    onRightFiberCladdingClampUp() {
        Application.instructions.setText("Опустите зажимы с правой стороны");
        Application.changeState(new RightFiberPlacedState());
    }

    onLeftFiberCladdingClampDown() {
        if (Application.splicer.children.rightFiberCladdingClamp.isDown()) {
            Application.instructions.setText("Закройте крышку сварочного аппарата");
        } else {
            Application.instructions.setText("Опустите зажимы с правой стороны");
        }
    }

    onRightFiberCladdingClampDown() {
        if (Application.splicer.children.leftFiberCladdingClamp.isDown()) {
            Application.instructions.setText("Закройте крышку сварочного аппарата");
        } else {
            Application.instructions.setText("Опустите зажимы с левой стороны");
        }
    }

    onLidClosed() {
        Application.instructions.setText("Нажмите на кнопку SET");
        Application.changeState(new ReadyToSpliceState());
    }
}

/** Состояние, в котором можно начать процесс сварки */
export class ReadyToSpliceState extends ApplicationState {
    /**
     * Создает экземпляр ReadyToSpliceState.
     */
    constructor() {
        super("ready_to_splice");
    }

    onLidOpened() {
        Application.instructions.setText("Закройте крышку сварочного аппарата");
        Application.changeState(new FibersPlacedState());
    }

    onSetPressed() {
        Application.instructions.setText("Дождитесь завершения сварки");
        Application.changeState(new SpliceInProgressState());

        Application.spliceProcess.start();
    }
}

/** Состояние, в котором производится сварка */
export class SpliceInProgressState extends ApplicationState {
    /**
     * Создает экземпляр SpliceInProgressState.
     */
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

        Application.instructions.setText("Извлеките волокно из сварочного аппарата");
        Application.changeState(new SpliceCompletedState());
    }
}

/** Состояние, в котором сварка завершена */
export class SpliceCompletedState extends ApplicationState {
    /**
     * Создает экземпляр SpliceCompletedState.
     */
    constructor() {
        super("splice_completed");
    }

    onLidOpened() {
        Application.instructions.setText("Поднимите зажимы для волокна");
    }

    onLidClosed() {
        Application.instructions.setText("Извлеките волокно из сварочного аппарата");
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
        Application.instructions.setText("Разместите гильзу КДЗС в центре места сварки");
        Application.changeState(new ReadyToPlaceSpliceProtection(this));
    }
}

/** Состояние, в котором можно разместить гильзу КДЗС */
export class ReadyToPlaceSpliceProtection extends ApplicationState {
    /**
     * Создает экземпляр ReadyToPlaceSpliceProtection.
     */
    constructor() {
        super("ready_to_place_splice_protection");
    }

    onSpliceProtectionPlaced() {
        Application.instructions.setText("Поместите волокно с КДЗС в нагреватель");
        Application.fusedFiber.addPadding();

        if (Application.splicer.children.mainHeaterLid.isOpen() && Application.splicer.children.heaterClamps.isUp()) {
            Application.changeState(new ReadyToPlaceFiberInHeaterState());
        } else {
            Application.changeState(new SpliceProtectionPlacedState());
        }
    }

    onSpliceProtectionRemoved() {
        Application.instructions.setText("Разместите гильзу КДЗС в центре места сварки");
    }

    canPlaceSpliceProtection() {
        return true;
    }
}

function _instructToOpenHeater() {
    Application.instructions.setText("Откройте крышку нагревателя");
}

/** Состояние, в котором гильза КДЗС размещена в центре места сварки */
export class SpliceProtectionPlacedState extends ApplicationState {
    /**
     * Создает экземпляр SpliceProtectionPlacedState.
     */
    constructor() {
        super("splice_protection_placed");
    }

    onMainHeaterLidClosed() {
        _instructToOpenHeater();
    }

    onHeaterClampsClosed() {
        _instructToOpenHeater();
    }

    onMainHeaterLidOpened() {
        if (Application.splicer.children.heaterClamps.isUp()) {
            this._onHeaterLidsOpened();
        }
    }

    onHeaterClampsOpened() {
        if (Application.splicer.children.mainHeaterLid.isOpen()) {
            this._onHeaterLidsOpened();
        }
    }

    _onHeaterLidsOpened() {
        Application.instructions.setText("Поместите волокно с КДЗС в нагреватель");
        Application.changeState(new ReadyToPlaceFiberInHeaterState());
    }
}

/** Состояние, в котором можно поместить волокно в нагреватель */
export class ReadyToPlaceFiberInHeaterState extends ApplicationState {
    /**
     * Создает экземпляр ReadyToPlaceFiberInHeaterState.
     */
    constructor() {
        super("ready_to_place_fiber_in_heater");
    }

    canPlaceFiberInHeater() {
        if (!Application.splicer.children.mainHeaterLid.isOpen()) return false;
        if (!Application.splicer.children.heaterClamps.isUp()) return false;

        return true;
    }

    onFiberPlacedInHeater() {
        Application.instructions.setText("Закройте крышку нагревателя");
    }

    onFiberRemovedFromHeater() {
        Application.instructions.setText("Поместите волокно с КДЗС в нагреватель");
    }

    _onHeaterLidsClosed() {
        Application.instructions.setText("Нажмите на кнопку HEAT");
        Application.changeState(new ReadyToHeatState());
    }

    _canInteractWithHeaterLid() {
        return Application.leftFiber.model.position.y < 0.05;
    }

    canLiftHeaterClamps() {
        return false;
    }

    canLowerHeaterClamps() {
        if (!super.canLowerHeaterClamps()) return false;
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
        if (Application.splicer.children.heaterClamps.isDown()) {
            this._onHeaterLidsClosed();
        } else {
            Application.instructions.setText("Закройте крышку нагревателя");
        }
    }

    onHeaterClampsClosed() {
        if (Application.splicer.children.mainHeaterLid.isClosed()) {
            this._onHeaterLidsClosed();
        } else {
            Application.instructions.setText("Закройте крышку нагревателя");
        }
    }
}

/** Состояние, в котором можно включить нагреватель */
export class ReadyToHeatState extends ApplicationState {
    /**
     * Создает экземпляр ReadyToHeatState.
     */
    constructor() {
        super("ready_to_heat");
    }

    _onHeaterLidsOpened() {
        Application.instructions.setText("Закройте крышку нагревателя");
        Application.changeState(new ReadyToPlaceFiberInHeaterState());
    }

    onMainHeaterLidOpened() {
        this._onHeaterLidsOpened();
    }

    onHeaterClampsOpened() {
        this._onHeaterLidsOpened();
    }

    onHeatPressed() {
        Application.instructions.setText("Дождитесь завершения работы нагревателя");
        Application.changeState(new HeatingInProgressState());
        Application.heatingProcess.start();
    }
}

/** Состояние, в котором нагреватель работает */
export class HeatingInProgressState extends ApplicationState {
    /**
     * Создает экземпляр HeatingInProgressState.
     */
    constructor() {
        super("heating_in_progress");
    }

    canOpenMainHeaterLid() {
        return false;
    }

    canLiftHeaterClamps() {
        return false;
    }

    onHeatingCompleted() {
        Application.splicer.heaterIndicator.stopFlashing();
        Application.instructions.setText("Волокно можно извлечь");
        Application.changeState(new HeatingCompletedState());
    }
}

/** Состояние, в котором нагреватель завершил работу */
export class HeatingCompletedState extends ApplicationState {
    /**
     * Создает экземпляр HeatingCompletedState.
     */
    constructor() {
        super("heating_completed");
    }

    canPlaceFiberInHeater() {
        if (!Application.splicer.children.mainHeaterLid.isOpen()) return false;
        if (!Application.splicer.children.heaterClamps.isUp()) return false;

        return true;
    }

    _canInteractWithHeaterLid() {
        return Application.leftFiber.model.position.y < 0.05 || Application.leftFiber.model.position.y > 0.068;
    }

    canLiftHeaterClamps() {
        if (!super.canLiftHeaterClamps()) return false;
        return this._canInteractWithHeaterLid();
    }

    canLowerHeaterClamps() {
        if (!super.canLowerHeaterClamps()) return false;
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
        Application.instructions.setText("Волокно можно извлечь");
    }

    onFiberRemovedFromHeater() {
        Application.instructions.setText("");
    }
}
