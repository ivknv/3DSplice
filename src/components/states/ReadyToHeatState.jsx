import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором можно включить нагреватель */
export default function ReadyToHeatState(props) {
    const {setInstructions, setState} = useApp();

    const onHeaterLidsOpened = () => {
        setInstructions("Закройте крышку нагревателя");
        setState("can_close_heater");
    }

    return (
        <ApplicationState
            name="ready_to_heat"
            onMainHeaterLidOpened={onHeaterLidsOpened}
            onHeaterClampsOpened={onHeaterLidsOpened}

            onHeatPressed={() => {
                setInstructions("Дождитесь завершения работы нагревателя");
                setState("heating_in_progress");

                if (props.onHeatingStarted) props.onHeatingStarted();
            }}

            canPressHeat={() => true}
            isSpliceCompleted={() => true}
        />
    );
}
