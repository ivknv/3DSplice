import React from "react";
import {useApp} from "../../App";
import ApplicationState from "../ApplicationState";

/** Состояние, в котором производится сварка */
export default function SpliceInProgressState(props) {
    const {setInstructions, setState} = useApp();

    return (
        <ApplicationState
            name="splice_in_progress"
            canOpenLid={() => false}
            onSpliceCompleted={() => {
                if (props.onSpliceCompleted) props.onSpliceCompleted();

                setInstructions("Извлеките волокно из сварочного аппарата");
                setState("splice_completed");
            }}
        />
    );
}
