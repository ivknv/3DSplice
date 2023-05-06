import React from "react";
import ApplicationState from "../ApplicationState";
import { useApp } from "../../App";

/** Состояние, в котором можно начать процесс сварки */
export default function ReadyToSpliceState() {
    const {setInstructions, setState} = useApp();

    return (
        <ApplicationState
            name="ready_to_splice"
            onLidOpened={() => {
                setInstructions("Закройте крышку сварочного аппарата");
                setState("fibers_placed");
            }}

            canPressSet={() => true}

            onSetPressed={() => {
                setInstructions("Дождитесь завершения сварки");
                setState("splice_in_progress");
            }}
        />
    );
}
