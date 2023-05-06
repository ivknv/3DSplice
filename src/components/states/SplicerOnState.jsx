import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором сварочный аппарат включен */
export default function SplicerOnState() {
    const app = useApp();
    const {setInstructions, setState} = app;

    const instructToLiftClamps = () => {
        setInstructions("Поднимите зажимы для волокна");
    };

    return (
        <ApplicationState
            name="splicer_on"
            onLidOpened={instructToLiftClamps}
            onLidClosed={() => {
                if (app.fibersPlaced) {
                    setInstructions("Нажмите кнопку SET");
                    setState("ready_to_splice");
                } else {
                    setInstructions("Откройте крышку сварочного аппарата");
                }
            }}

            onLeftFiberCladdingClampUp={instructToLiftClamps}
            onRightFiberCladdingClampUp={instructToLiftClamps}

            onLeftFiberCladdingClampDown={() => {
                if (app.fibersPlaced) {
                    if (app.splicer.children.rightFiberCladdingClamp.isDown()) {
                        setInstructions("Закройте крышку сварочного аппарата");
                    } else {
                        setInstructions("Опустите зажимы с правой стороны");
                    }
                } else {
                    instructToLiftClamps();
                }
            }}

            onRightFiberCladdingClampDown={() => {
                if (app.fibersPlaced) {
                    if (app.splicer.children.leftFiberCladdingClamp.isDown()) {
                        setInstructions("Закройте крышку сварочного аппарата");
                    } else {
                        setInstructions("Опустите зажимы с левой стороны");
                    }
                } else {
                    instructToLiftClamps();
                }
            }}

            onLeftFiberClampUp={() => {
                if (!app.leftFiberPlaced) {
                    setInstructions("Поместите левое волокно в сварочный аппарат");
                    setState("can_place_left_fiber");
                } else {
                    setInstructions("Опустите зажимы с левой стороны");
                    setState("left_fiber_placed");
                }
            }}

            onRightFiberClampUp={() => {
                if (!app.rightFiberPlaced) {
                    setInstructions("Поместите правое волокно в сварочный аппарат");
                    setState("can_place_right_fiber");
                } else {
                    setInstructions("Опустите зажимы с правой стороны");
                    setState("right_fiber_placed");
                }
            }}
        />
    );
}
