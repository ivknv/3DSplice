import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Исходное состояние */
export default function InitialState() {
    const {setState, setInstructions} = useApp();

    return (
        <ApplicationState
            name="initial"
            canTurnOn={() => true}
            canOpenLid={() => false}
            onPowerOn={() => {
                setState("splicer_on");
                setInstructions("Откройте крышку сварочного аппарата");
            }}
        />
    );
}
