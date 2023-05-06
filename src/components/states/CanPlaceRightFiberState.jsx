import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором можно разместить правое волокно */
export default function CanPlaceRightFiberState() {
    const {setInstructions, setState} = useApp();

    return (
        <ApplicationState
            name="can_place_right_fiber"
            onRightFiberPlaced={() => {
                setInstructions("Опустите зажимы с правой стороны");
                setState("right_fiber_placed");
            }}
            onRightFiberClampDown={() => {
                setInstructions("Поднимите зажимы для волокна");
                setState("splicer_on");
            }}/>
    );
}
