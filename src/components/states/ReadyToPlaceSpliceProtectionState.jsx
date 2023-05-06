import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором можно разместить гильзу КДЗС */
export default function ReadyToPlaceSpliceProtection() {
    const app = useApp();
    const {setInstructions, setState} = app;

    return (
        <ApplicationState
            name="ready_to_place_splice_protection"
            onSpliceProtectionPlaced={() => {
                setInstructions("Поместите волокно с КДЗС в нагреватель");

                if (app.splicer.children.mainHeaterLid.isOpen() && app.splicer.children.heaterClamps.isUp()) {
                    setState("ready_to_place_fiber_in_heater");
                } else {
                    setState("splice_protection_placed");
                }
            }}

            onSpliceProtectionRemoved={() => {
                setInstructions("Разместите гильзу КДЗС в центре места сварки");
            }}

            canPlaceSpliceProtection={() => true}
            isSpliceCompleted={() => true}
        />
    );
}
