import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";

export default function CanCloseHeaterState() {
    const app = useApp();
    const {setInstructions, setState} = useApp();

    const onHeaterLidsClosed = () => {
        setInstructions("Нажмите на кнопку HEAT");
        setState("ready_to_heat");
    }

    return (
        <ApplicationState
            name="can_close_heater"
            onFiberRemovedFromHeater={() => {
                setInstructions("Поместите волокно с КДЗС в нагреватель");
                setState("ready_to_place_fiber_in_heater");
            }}

            canPlaceFiberInHeater={() => {
                if (!app.splicer.children.mainHeaterLid.isOpen()) return false;
                if (!app.splicer.children.heaterClamps.isUp()) return false;

                return true;
            }}

            onMainHeaterLidClosed={() => {
                if (app.splicer.children.heaterClamps.isDown()) {
                    onHeaterLidsClosed();
                } else {
                    setInstructions("Закройте крышку нагревателя");
                }
            }}

            onHeaterClampsClosed={() => {
                if (app.splicer.children.mainHeaterLid.isClosed()) {
                    onHeaterLidsClosed();
                } else {
                    setInstructions("Закройте крышку нагревателя");
                }
            }}

            canCloseMainHeaterLid={() => true}
            canCloseHeaterClamps={() => true}

            isSpliceCompleted={() => true}
        />
    );
}
