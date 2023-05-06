import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором гильза КДЗС размещена в центре места сварки */
export default function SpliceProtectionPlacedState() {
    const app = useApp();
    const {setInstructions, setState} = app;

    const instructToOpenHeater = () => {
        setInstructions("Откройте крышку нагревателя");
    }

    const onHeaterLidsOpened = () => {
        setInstructions("Поместите волокно с КДЗС в нагреватель");
        setState("ready_to_place_fiber_in_heater");
    }

    return (
        <ApplicationState
            name="splice_protection_placed"
            onMainHeaterLidClosed={instructToOpenHeater}
            onHeaterClampsClosed={instructToOpenHeater}

            onMainHeaterLidOpened={() => {
                if (app.splicer.children.heaterClamps.isUp()) {
                    onHeaterLidsOpened();
                }
            }}

            onHeaterClampsOpened={() => {
                if (app.splicer.children.mainHeaterLid.isOpen()) {
                    onHeaterLidsOpened();
                }
            }}

            isSpliceCompleted={() => true}
        />
    );
}
