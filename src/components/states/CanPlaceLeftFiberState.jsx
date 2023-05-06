import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором можно разместить левое волокно */
export default function CanPlaceLeftFiberState() {
    const {setInstructions, setState} = useApp();

    return (
        <ApplicationState
            name="can_place_left_fiber"
            onLeftFiberPlaced={() => {
                setInstructions("Опустите зажимы с левой стороны");
                setState("left_fiber_placed");
            }}
            onLeftFiberClampDown={() => {
                setInstructions("Поднимите зажимы для волокна");
                setState("splicer_on");
            }}/>
    );
}
