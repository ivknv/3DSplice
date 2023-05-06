import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором правое волокно правильно расположено */
export default function RightFiberPlacedState() {
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
            name="right_fiber_placed"
            onRightFiberRemoved={() => {
                setInstructions("Поместите правое волокно в сварочный аппарат");
                setState("can_place_right_fiber");
            }}
            onRightFiberCladdingClampDown={() => {
                if (app.fibersPlaced) {
                    if (allClampsAreDown()) {
                        setInstructions("Закройте крышку сварочного аппарата");
                        setState("fibers_placed");
                    } else {
                        setInstructions("Опустите зажимы с левой стороны");
                        setState("left_fiber_placed");
                    }
                } else if (app.splicer.children.leftFiberClamp.isUp()) {
                    setInstructions("Поместите левое волокно в сварочный аппарат");
                    setState("can_place_left_fiber");
                } else {
                    setInstructions("Поднимите зажимы с левой стороны");
                    setState("splicer_on");
                }
            }}
        />
    );
}
