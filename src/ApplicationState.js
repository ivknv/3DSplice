import Application from "./Application";
import FusedFiber from "./FusedFiber";

/**
 * Данный класс позволяет определять поведение приложения в зависимости от текущего состояния.
 * Каждое отдельное состояние приложения может быть представлено отдельным
 * классом, наследующимся от ApplicationState.
 *
 * @property {string} name - Имя состояния
 * @property {boolean} leftFiberPlaced - Флаг, указывающий на то, что левое волокно было (правильно) размещено
 * @property {boolean} rightFiberPlaced - Флаг, указывающий на то, что правое волокно было (правильно) размещено
 * @property {boolean} fibersPlaced - Флаг, указывающий на то, что оба волокна были (правильно) размещены
 * @property {boolean} fiberPlacedInHeater - Флаг, указывающий на то, что волокно было помещено в нагреватель
 * @property {boolean} spliceProtectionPlaced - Флаг, указывающий на то, была размещена гильза КДЗС (в центре места сварки)
 */
export default class ApplicationState {
    /**
     * Создает экземпляр ApplicationState
     * @param {string} name - Имя состояния
     * @param {ApplicationState} [previousState] - Предыдущее состояние
     */
    constructor(name, previousState) {
        this.name = name;

        this._leftFiberPlaced = previousState?.leftFiberPlaced || false;
        this._rightFiberPlaced = previousState?.rightFiberPlaced || false;
        this._fiberPlacedInHeater = previousState?.fiberPlacedInHeater || false;
        this._spliceProtectionPlaced = previousState?.spliceProtectionPlaced || false;
    }

    get leftFiberPlaced() {
        return this._leftFiberPlaced;
    }

    set leftFiberPlaced(value) {
        const oldValue = this._leftFiberPlaced;

        if (oldValue !== value) {
            this._leftFiberPlaced = value;

            if (value) {
                this.onLeftFiberPlaced();
            } else {
                this.onLeftFiberRemoved();
            }
        }
    }

    get rightFiberPlaced() {
        return this._rightFiberPlaced;
    }

    set rightFiberPlaced(value) {
        const oldValue = this._rightFiberPlaced;

        if (oldValue !== value) {
            this._rightFiberPlaced = value;

            if (value) {
                this.onRightFiberPlaced();
            } else {
                this.onRightFiberRemoved();
            }
        }
    }

    get fibersPlaced() {
        return this.leftFiberPlaced && this.rightFiberPlaced;
    }

    get fiberPlacedInHeater() {
        return this._fiberPlacedInHeater;
    }

    set fiberPlacedInHeater(value) {
        const oldValue = this._fiberPlacedInHeater;

        if (oldValue !== value) {
            this._fiberPlacedInHeater = value;

            if (value) {
                this.onFiberPlacedInHeater();
            } else {
                this.onFiberRemovedFromHeater();
            }
        }
    }

    get spliceProtectionPlaced() {
        return this._spliceProtectionPlaced;
    }

    set spliceProtectionPlaced(value) {
        const oldValue = this._spliceProtectionPlaced;

        if (oldValue !== value) {
            this._spliceProtectionPlaced = value;

            if (value) {
                this.onSpliceProtectionPlaced();
            } else {
                this.onSpliceProtectionRemoved();
            }
        }
    }

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

function _instructToLiftClamps() {
    Application.setInstructionText("Поднимите зажимы для волокна");
}

/** Исходное состояние */
export class InitialState extends ApplicationState {
    /**
     * Создает экземпляр InitialState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("initial", previousState);
    }

    onLidOpened() { _instructToLiftClamps(); }

    onLidClosed() {
        if (this.fibersPlaced) {
            Application.setInstructionText("Нажмите кнопку SET");
            Application.changeState(new ReadyToSpliceState(this));
        } else {
            Application.setInstructionText("Откройте крышку сварочного аппарата");
        }
    }

    onLeftFiberCladdingClampUp() { _instructToLiftClamps(); }
    onRightFiberCladdingClampUp() { _instructToLiftClamps(); }

    onLeftFiberCladdingClampDown() {
        if (this.fibersPlaced) {
            if (Application.splicer.children.rightFiberCladdingClamp.isDown()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
            } else {
                Application.setInstructionText("Опустите зажимы с правой стороны");
            }
        } else {
            _instructToLiftClamps();
        }
    }

    onRightFiberCladdingClampDown() {
        if (this.fibersPlaced) {
            if (Application.splicer.children.leftFiberCladdingClamp.isDown()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
            } else {
                Application.setInstructionText("Опустите зажимы с левой стороны");
            }
        } else {
            _instructToLiftClamps();
        }
    }

    onLeftFiberClampUp() {
        if (!this.leftFiberPlaced) {
            Application.setInstructionText("Поместите левое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceLeftFiberState(this));
        } else {
            Application.setInstructionText("Опустите зажимы с левой стороны");
            Application.changeState(new LeftFiberPlacedState(this));
        }
    }

    onRightFiberClampUp() {
        if (!this.leftFiberPlaced) {
            Application.setInstructionText("Поместите правое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceRightFiberState(this));
        } else {
            Application.setInstructionText("Опустите зажимы с правой стороны");
            Application.changeState(new RightFiberPlacedState(this));
        }
    }
}

/** Состояние, в котором можно разместить левое волокно */
export class CanPlaceLeftFiberState extends ApplicationState {
    /**
     * Создает экземпляр CanPlaceLeftFiberState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("can_place_left_fiber", previousState);
    }

    onLeftFiberPlaced() {
        Application.setInstructionText("Опустите зажимы с левой стороны");
        Application.changeState(new LeftFiberPlacedState(this));
    }

    onLeftFiberClampDown() {
        Application.setInstructionText("Поднимите зажимы для волокна");
        Application.changeState(new InitialState(this));
    }
}

/** Состояние, в котором можно разместить правое волокно */
export class CanPlaceRightFiberState extends ApplicationState {
    /**
     * Создает экземпляр CanPlaceRightFiberState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("can_place_right_fiber", previousState);
    }

    onRightFiberPlaced() {
        Application.setInstructionText("Опустите зажимы с правой стороны");
        Application.changeState(new RightFiberPlacedState(this));
    }

    onRightFiberClampDown() {
        Application.setInstructionText("Поднимите зажимы для волокна");
        Application.changeState(new InitialState(this));
    }
}

/** Состояние, в котором правое волокно правильно расположено */
export class RightFiberPlacedState extends ApplicationState {
    /**
     * Создает экземпляр RightFiberPlacedState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("right_fiber_placed", previousState);
    }

    onRightFiberRemoved() {
        Application.setInstructionText("Поместите правое волокно в сварочный аппарат");
        Application.changeState(new CanPlaceRightFiberState(this));
    }

    onRightFiberClampDown() {
        Application.setInstructionText("Опустите зажимы с правой стороны");
    }

    onRightFiberCladdingClampDown() {
        if (this.fibersPlaced) {
            if (Application.splicer.children.lid.checkDependencies()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
                Application.changeState(new FibersPlacedState(this));
            } else {
                Application.setInstructionText("Опустите зажимы с левой стороны");
                Application.changeState(new LeftFiberPlacedState(this));
            }
        } else if (Application.splicer.children.leftFiberClamp.isUp()) {
            Application.setInstructionText("Поместите левое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceLeftFiberState(this));
        } else {
            Application.setInstructionText("Поднимите зажимы с левой стороны");
            Application.changeState(new InitialState(this));
        }
    }
}

/** Состояние, в котором левое волокно правильно расположено */
export class LeftFiberPlacedState extends ApplicationState {
    /**
     * Создает экземпляр LeftFiberPlacedState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("left_fiber_placed", previousState);
    }

    onLeftFiberRemoved() {
        Application.setInstructionText("Поместите левое волокно в сварочный аппарат");
        Application.changeState(new CanPlaceLeftFiberState(this));
    }

    onLeftFiberCladdingClampDown() {
        if (this.fibersPlaced) {
            if (Application.splicer.children.lid.checkDependencies()) {
                Application.setInstructionText("Закройте крышку сварочного аппарата");
                Application.changeState(new FibersPlacedState(this));
            } else {
                Application.setInstructionText("Опустите зажимы с правой стороны");
                Application.changeState(new RightFiberPlacedState(this));
            }
        } else if (Application.splicer.children.rightFiberClamp.isUp()) {
            Application.setInstructionText("Поместите правое волокно в сварочный аппарат");
            Application.changeState(new CanPlaceRightFiberState(this));
        } else {
            Application.setInstructionText("Поднимите зажимы с правой стороны");
            Application.changeState(new InitialState(this));
        }
    }
}

/** Состояние, в котором оба волокна правильно расположены */
export class FibersPlacedState extends ApplicationState {
    /**
     * Создает экземпляр FibersPlacedState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("fibers_placed", previousState);
    }

    onLeftFiberCladdingClampUp() {
        Application.setInstructionText("Опустите зажимы с левой стороны");
        Application.changeState(new LeftFiberPlacedState(this));
    }

    onRightFiberCladdingClampUp() {
        Application.setInstructionText("Опустите зажимы с правой стороны");
        Application.changeState(new RightFiberPlacedState(this));
    }

    onLeftFiberCladdingClampDown() {
        if (Application.splicer.children.rightFiberCladdingClamp.isDown()) {
            Application.setInstructionText("Закройте крышку сварочного аппарата");
        } else {
            Application.setInstructionText("Опустите зажимы с правой стороны");
        }
    }

    onRightFiberCladdingClampDown() {
        if (Application.splicer.children.leftFiberCladdingClamp.isDown()) {
            Application.setInstructionText("Закройте крышку сварочного аппарата");
        } else {
            Application.setInstructionText("Опустите зажимы с левой стороны");
        }
    }

    onLidClosed() {
        Application.setInstructionText("Нажмите на кнопку SET");
        Application.changeState(new ReadyToSpliceState(this));
    }
}

/** Состояние, в котором можно начать процесс сварки */
export class ReadyToSpliceState extends ApplicationState {
    /**
     * Создает экземпляр ReadyToSpliceState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("ready_to_splice", previousState);
    }

    onLidOpened() {
        Application.setInstructionText("Закройте крышку сварочного аппарата");
        Application.changeState(new FibersPlacedState(this));
    }

    onSetPressed() {
        Application.setInstructionText("Дождитесь завершения сварки");
        Application.changeState(new SpliceInProgressState(this));

        Application.spliceProcess.start();
    }
}

/** Состояние, в котором производится сварка */
export class SpliceInProgressState extends ApplicationState {
    /**
     * Создает экземпляр SpliceInProgressState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("splice_in_progress", previousState);
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
        Application.changeState(new SpliceCompletedState(this));
    }
}

/** Состояние, в котором сварка завершена */
export class SpliceCompletedState extends ApplicationState {
    /**
     * Создает экземпляр SpliceCompletedState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("splice_completed", previousState);
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
        Application.changeState(new ReadyToPlaceSpliceProtection(this));
    }
}

/** Состояние, в котором можно разместить гильзу КДЗС */
export class ReadyToPlaceSpliceProtection extends ApplicationState {
    /**
     * Создает экземпляр ReadyToPlaceSpliceProtection.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("ready_to_place_splice_protection", previousState);
    }

    onSpliceProtectionPlaced() {
        Application.setInstructionText("Поместите волокно с КДЗС в нагреватель");
        Application.fusedFiber.addPadding();

        if (Application.splicer.children.mainHeaterLid.isOpen() && Application.splicer.children.heaterClamps.isUp()) {
            Application.changeState(new ReadyToPlaceFiberInHeaterState(this));
        } else {
            Application.changeState(new SpliceProtectionPlacedState(this));
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

/** Состояние, в котором гильза КДЗС размещена в центре места сварки */
export class SpliceProtectionPlacedState extends ApplicationState {
    /**
     * Создает экземпляр SpliceProtectionPlacedState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("splice_protection_placed", previousState);
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
        Application.setInstructionText("Поместите волокно с КДЗС в нагреватель");
        Application.changeState(new ReadyToPlaceFiberInHeaterState(this));
    }
}

/** Состояние, в котором можно поместить волокно в нагреватель */
export class ReadyToPlaceFiberInHeaterState extends ApplicationState {
    /**
     * Создает экземпляр ReadyToPlaceFiberInHeaterState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("ready_to_place_fiber_in_heater", previousState);
    }

    canPlaceFiberInHeater() {
        if (!Application.splicer.children.mainHeaterLid.isOpen()) return false;
        if (!Application.splicer.children.heaterClamps.isUp()) return false;

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
        Application.changeState(new ReadyToHeatState(this));
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
            Application.setInstructionText("Закройте крышку нагревателя");
        }
    }

    onHeaterClampsClosed() {
        if (Application.splicer.children.mainHeaterLid.isClosed()) {
            this._onHeaterLidsClosed();
        } else {
            Application.setInstructionText("Закройте крышку нагревателя");
        }
    }
}

/** Состояние, в котором можно включить нагреватель */
export class ReadyToHeatState extends ApplicationState {
    /**
     * Создает экземпляр ReadyToHeatState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("ready_to_heat", previousState);
    }

    _onHeaterLidsOpened() {
        Application.setInstructionText("Закройте крышку нагревателя");
        Application.changeState(new ReadyToPlaceFiberInHeaterState(this));
    }

    onMainHeaterLidOpened() {
        this._onHeaterLidsOpened();
    }

    onHeaterClampsOpened() {
        this._onHeaterLidsOpened();
    }

    onHeatPressed() {
        Application.setInstructionText("Дождитесь завершения работы нагревателя");
        Application.splicer.heaterIndicator.startFlashing();
        Application.changeState(new HeatingInProgressState(this));
        Application.spliceProtectionCase.shrink();
    }
}

/** Состояние, в котором нагреватель работает */
export class HeatingInProgressState extends ApplicationState {
    /**
     * Создает экземпляр HeatingInProgressState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("heating_in_progress", previousState);
    }

    canOpenMainHeaterLid() {
        return false;
    }

    canLiftHeaterClamps() {
        return false;
    }

    onHeatingCompleted() {
        Application.splicer.heaterIndicator.stopFlashing();
        Application.setInstructionText("Волокно можно извлечь");
        Application.changeState(new HeatingCompletedState(this));
    }
}

/** Состояние, в котором нагреватель завершил работу */
export class HeatingCompletedState extends ApplicationState {
    /**
     * Создает экземпляр HeatingCompletedState.
     * @param {ApplicationState} [previousState] - Предыдущее состояние приложения
     */
    constructor(previousState) {
        super("heating_completed", previousState);
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
        Application.setInstructionText("Волокно можно извлечь");
    }

    onFiberRemovedFromHeater() {
        Application.setInstructionText("");
    }
}
