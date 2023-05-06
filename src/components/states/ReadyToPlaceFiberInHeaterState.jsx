import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором можно поместить волокно в нагреватель */
export default function ReadyToPlaceFiberInHeaterState() {
    const {setInstructions, setState} = useApp();

    return (
        <ApplicationState
            name="ready_to_place_fiber_in_heater"
            canPlaceFiberInHeater={() => true}

            onFiberPlacedInHeater={() => {
                setInstructions("Закройте крышку нагревателя");
                setState("can_close_heater");
            }}

            canLiftHeaterClamps={() => false}
            canLowerHeaterClamps={() => false}
            canOpenMainHeaterLid={() => false}
            canCloseMainHeaterLid={() => false}

            isSpliceCompleted={() => true}
        />
    );
}
