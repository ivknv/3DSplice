import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором нагреватель работает */
export default function HeatingInProgressState(props) {
    const {setInstructions, setState} = useApp();

    return (
        <ApplicationState
            name="heating_in_progress"
            canOpenMainHeaterLid={() => false}
            canLiftHeaterClamps={() => false}
            onHeatingCompleted={() => {
                if (props.onHeatingCompleted) props.onHeatingCompleted();
            }}
            onCoolingCompleted={() => {
                if (props.onCoolingCompleted) props.onCoolingCompleted();
                setInstructions("Волокно можно извлечь");
                setState("heating_completed");
            }}
            isSpliceCompleted={() => true}
        />
    );
}
