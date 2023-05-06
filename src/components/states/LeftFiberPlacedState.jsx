import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором левое волокно правильно расположено */
export default function LeftFiberPlacedState() {
    const app = useApp();
    const {setInstructions, setState} = app;

    const allClampsAreDown = () => {
        const clamps = [
            "leftFiberClamp", "rightFiberClamp",
            "leftFiberCladdingClamp", "rightFiberCladdingClamp"
        ];

        for (const clamp of clamps) {
            if (!app.splicer.children[clamp].isDown()) return false;
        }

        return true;
    }

    return (
        <ApplicationState
            name="left_fiber_placed"
            onLeftFiberRemoved={() => {
                setInstructions("Поместите левое волокно в сварочный аппарат");
                setState("can_place_left_fiber");
            }}
            onLeftFiberCladdingClampDown={() => {
                if (app.fibersPlaced) {
                    if (allClampsAreDown()) {
                        setInstructions("Закройте крышку сварочного аппарата");
                        setState("fibers_placed");
                    } else {
                        setInstructions("Опустите зажимы с правой стороны");
                        setState("right_fiber_placed");
                    }
                } else if (app.splicer.children.rightFiberClamp.isUp()) {
                    setInstructions("Поместите правое волокно в сварочный аппарат");
                    setState("can_place_right_fiber");
                } else {
                    setInstructions("Поднимите зажимы с правой стороны");
                    setState("splicer_on");
                }
            }}
        />
    );
}
