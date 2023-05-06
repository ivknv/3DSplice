import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором оба волокна правильно расположены */
export default function FibersPlacedState() {
    const app = useApp();
    const {setInstructions, setState} = app;

    return (
        <ApplicationState
            name="fibers_placed"
            onLeftFiberCladdingClampUp={() => {
                setInstructions("Опустите зажимы с левой стороны");
                setState("left_fiber_placed");
            }}
            onRightFiberCladdingClampUp={() => {
                setInstructions("Опустите зажимы с правой стороны");
                setState("right_fiber_placed");
            }}
            onLeftFiberCladdingClampDown={() => {
                if (app.splicer.children.rightFiberCladdingClamp.isDown()) {
                    setInstructions("Закройте крышку сварочного аппарата");
                } else {
                    setInstructions("Опустите зажимы с правой стороны");
                }
            }}

            onRightFiberCladdingClampDown={() => {
                if (app.splicer.children.leftFiberCladdingClamp.isDown()) {
                    setInstructions("Закройте крышку сварочного аппарата");
                } else {
                    setInstructions("Опустите зажимы с левой стороны");
                }
            }}

            onLidClosed={() => {
                setInstructions("Нажмите на кнопку SET");
                setState("ready_to_splice");
            }}
        />
    );
}
