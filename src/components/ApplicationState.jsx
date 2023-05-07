import React, {useEffect} from "react";
import {useApp} from "../App";

export default function ApplicationState(props) {
    const app = useApp();

    useEffect(() => {
        const state = {
            name: props.name,

            /**
             * Позволяет контролировать, можно ли включить сварочный аппарат
             * @return {boolean} true, если можно
             */
            canTurnOn() {
                if (props.canTurnOn) return props.canTurnOn();
                return false;
            },

            /**
             * Позволяет контролиорвать, можно ли выключить сварочный аппарат
             * @return {boolean} true, если можно
             */
            canTurnOff() {
                if (props.canTurnOff) return props.canTurnOff();
                return false;
            },

            /** Вызывается при включении сварочного аппарата */
            onPowerOn() {
                if (props.onPowerOn) props.onPowerOn();
            },

            /** Вызывается при правильном размещении левого волокна */
            onLeftFiberPlaced() {
                if (props.onLeftFiberPlaced) props.onLeftFiberPlaced();
            },

            /** Вызывается при правильном размещении правого волокна */
            onRightFiberPlaced() {
                if (props.onRightFiberPlaced) props.onRightFiberPlaced();
            },

            /** Вызывается при извлечении левого волокна или если оно расположено неправильно */
            onLeftFiberRemoved() {
                if (props.onLeftFiberRemoved) props.onLeftFiberRemoved();
            },

            /** Вызывается при извлечении правого волокна или если оно расположено неправильно */
            onRightFiberRemoved() {
                if (props.onRightFiberRemoved) props.onRightFiberRemoved();
            },

            /** Вызывается, когда сваренное волокно извлечено из сварочного аппарата */
            onFiberRemoved() {
                if (props.onFiberRemoved) props.onFiberRemoved();
            },

            /** Вызывается, когда крышка сварочного аппарата открыта */
            onLidOpened() {
                if (props.onLidOpened) props.onLidOpened();
            },

            /** Вызывается, когда крышка сварочного аппарата закрыта */
            onLidClosed() {
                if (props.onLidClosed) props.onLidClosed();
            },

            /**
             * Позволяет контролировать, можно ли открывать крышку сварочного аппарата
             * @return {boolean} можно ли открыть крышку
             */
            canOpenLid() {
                if (props.canOpenLid) return props.canOpenLid();

                return app.splicer.children.lid.isClosed();
            },

            /**
             * Позволяет контролировать, можно ли закрывать крышку сварочного аппарата
             * @return {boolean} можно ли закрыть крышку
             */
            canCloseLid() {
                if (props.canCloseLid) return props.canCloseLid();

                return app.splicer.children.lid.isOpen();
            },

            /** Вызывается, когда левый зажим волокна опущен */
            onLeftFiberClampDown() {
                if (props.onLeftFiberClampDown) props.onLeftFiberClampDown();
            },

            /** Вызывается, когда левый зажим волокна поднят */
            onLeftFiberClampUp() {
                if (props.onLeftFiberClampUp) props.onLeftFiberClampUp();
            },

            /** Вызывается, когда правый зажим волокна опущен */
            onRightFiberClampDown() {
                if (props.onRightFiberClampDown) props.onRightFiberClampDown();
            },

            /** Вызывается, когда правый зажим волокна поднят */
            onRightFiberClampUp() {
                if (props.onRightFiberClampUp) props.onRightFiberClampUp();
            },

            /** Вызывается, когда левый зажим оболочки волокна опущен */
            onLeftFiberCladdingClampDown() {
                if (props.onLeftFiberCladdingClampDown) props.onLeftFiberCladdingClampDown();
            },

            /** Вызывается, когда левый зажим оболочки волокна поднят */
            onLeftFiberCladdingClampUp() {
                if (props.onLeftFiberCladdingClampUp) props.onLeftFiberCladdingClampUp();
            },

            /** Вызывается, когда правый зажим оболочки волокна опущен */
            onRightFiberCladdingClampDown() {
                if (props.onRightFiberCladdingClampDown) props.onRightFiberCladdingClampDown();
            },

            /** Вызывается, когда правый зажим оболочки волокна поднят */
            onRightFiberCladdingClampUp() {
                if (props.onRightFiberCladdingClampUp) props.onRightFiberCladdingClampUp();
            },

            canPressSet() {
                if (props.canPressSet) return props.canPressSet();
                return false;
            },

            /** Вызывается, когда нажата кнопка SET */
            onSetPressed() {
                if (props.onSetPressed) props.onSetPressed();
            },

            /** Вызывается после завершения процесса сварки */
            onSpliceCompleted() {
                if (props.onSpliceCompleted) props.onSpliceCompleted();
            },

            /** Вызывается после правильного размещения гильзы КДЗС */
            onSpliceProtectionPlaced() {
                if (props.onSpliceProtectionPlaced) props.onSpliceProtectionPlaced();
            },

            /**
             * Вызывается, если гильза КДЗС была перемещена слишком далеко от центра
             * сварного соединения
             */
            onSpliceProtectionRemoved() {
                if (props.onSpliceProtectionRemoved) props.onSpliceProtectionRemoved();
            },

            /** Вызывается, когда ОВ помещено в нагреватель */
            onFiberPlacedInHeater() {
                if (props.onFiberPlacedInHeater) props.onFiberPlacedInHeater();
            },

            /** Вызывается, когда ОВ извлечено из нагревателя */
            onFiberRemovedFromHeater() {
                if (props.onFiberRemovedFromHeater) props.onFiberRemovedFromHeater();
            },

            /** Вызывается, когда крышка нагревателя открыта */
            onMainHeaterLidOpened() {
                if (props.onMainHeaterLidOpened) props.onMainHeaterLidOpened();
            },

            /** Вызывается, когда крышка нагревателя закрыта */
            onMainHeaterLidClosed() {
                if (props.onMainHeaterLidClosed) props.onMainHeaterLidClosed();
            },

            /** Вызывается, когда зажимы нагревателя подняты */
            onHeaterClampsOpened() {
                if (props.onHeaterClampsOpened) props.onHeaterClampsOpened();
            },

            /** Вызывается, когда зажимы нагревателя опущены */
            onHeaterClampsClosed() {
                if (props.onHeaterClampsClosed) props.onHeaterClampsClosed();
            },

            /**
             * Позволяет контролировать, можно ли перемещать гильзу КДЗС
             * @return {boolean} можно ли перемещать гильзу КДЗС
             */
            canPlaceSpliceProtection() {
                if (props.canPlaceSpliceProtection) return props.canPlaceSpliceProtection();
                return false;
            },

            /**
             * Позволяет контролировать, можно ли открывать крышку нагревателя
             * @return {boolean} можно ли открывать крышку нагревателя
             */
            canOpenMainHeaterLid() {
                if (props.canOpenMainHeaterLid) return props.canOpenMainHeaterLid();
                return app.splicer.children.mainHeaterLid.isClosed();
            },

            /**
             * Позволяет контролировать, можно ли закрывать крышку нагревателя
             * @return {boolean} можно ли закрывать крышку нагревателя
             * */
            canCloseMainHeaterLid() {
                if (props.canCloseMainHeaterLid) return props.canCloseMainHeaterLid();
                return app.splicer.children.mainHeaterLid.isOpen();
            },

            /**
             * Позволяет контролировать, можно ли поднимать зажимы нагревателя
             * @return {boolean} можно ли поднимать зажимы нагревателя
             */
            canLiftHeaterClamps() {
                if (props.canLiftHeaterClamps) return props.canLiftHeaterClamps();
                return app.splicer.children.heaterClamps.isDown();
            },

            /**
             * Позволяет контролировать, можно ли опускать зажимы нагревателя
             * @return {boolean} можно ли опускать зажимы нагревателя
             */
            canLowerHeaterClamps() {
                if (props.canLowerHeaterClamps) return props.canLowerHeaterClamps();
                return app.splicer.children.heaterClamps.isUp();
            },

            /**
             * Позволяет контролировать, можно ли помещать ОВ в нагреватель
             * @return {boolean} можно ли помещать ОВ в нагреватель
             */
            canPlaceFiberInHeater() {
                if (props.canPlaceFiberInHeater) return props.canPlaceFiberInHeater();
                return false;
            },

            canPressHeat() {
                if (props.canPressHeat) return props.canPressHeat();
                return false;
            },

            /** Вызывается при нажатии на кнопку HEAT */
            onHeatPressed() {
                if (props.onHeatPressed) return props.onHeatPressed();
            },

            /** Вызывается после завершения процесса охлаждения гильзы КДЗС */
            onCoolingCompleted() {
                if (props.onCoolingCompleted) return props.onCoolingCompleted();
            },

            /** Вызывается после завершения процесса нагрева гильзы КДЗС */
            onHeatingCompleted() {
                if (props.onHeatingCompleted) return props.onHeatingCompleted();
            },

            isSpliceInProgress() {
                if (props.isSpliceInProgress) return props.isSpliceInProgress();

                return false;
            },

            isSpliceCompleted() {
                if (props.isSpliceCompleted) return props.isSpliceCompleted();

                return false;
            }
        };

        app.states[props.name] = state;

        return () => delete app.states[props.name];
    }, [])

    return null;
}
