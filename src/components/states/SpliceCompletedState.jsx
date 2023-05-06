import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором сварка завершена */
export default function SpliceCompletedState(props) {
    const app = useApp();
    const {setInstructions, setState} = app;

    const onFiberClampsUp=() => {
        if (props.extractFusedFiber) props.extractFusedFiber();
    };

    return (
        <ApplicationState
            name="splice_completed"
            onLidOpened={() => {
                setInstructions("Поднимите зажимы для волокна");
            }}

            onLidClosed={() => {
                setInstructions("Извлеките волокно из сварочного аппарата");
            }}

            onLeftFiberClampUp={() => {
                if (app.splicer.children.rightFiberClamp.isUp()) {
                    onFiberClampsUp()
                }
            }}

            onRightFiberClampUp={() => {
                if (app.splicer.children.leftFiberClamp.isUp()) {
                    onFiberClampsUp()
                }
            }}


            onFiberRemoved={() => {
                setInstructions("Разместите гильзу КДЗС в центре места сварки");
                setState("ready_to_place_splice_protection");

                if (props.onFiberRemoved) props.onFiberRemoved();
            }}

            isSpliceCompleted={() => true}
        />
    );
}
