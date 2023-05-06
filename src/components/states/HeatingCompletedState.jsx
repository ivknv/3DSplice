import React from "react";
import { useApp } from "../../App";
import ApplicationState from "../ApplicationState";
import * as THREE from "three";

/** Состояние, в котором нагреватель завершил работу */
export default function HeatingCompletedState(props) {
    const app = useApp();
    const {setInstructions} = app;

    const canInteractWithHeaterLid = () => {
        const leftFiber = app.fibers.find(x => x.name === "leftFiber");
        const position = leftFiber.getWorldPosition(new THREE.Vector3());
        return position.y <= 0.055 || position.y > 0.068;
    }

    return (
        <ApplicationState
            name="heating_completed"

            canPlaceFiberInHeater={() => {
                if (!app.splicer.children.mainHeaterLid.isOpen()) return false;
                if (!app.splicer.children.heaterClamps.isUp()) return false;

                return true;
            }}

            canLiftHeaterClamps={() => {
                if (!app.splicer.children.heaterClamps.isDown()) return false;
                return canInteractWithHeaterLid();
            }}

            canLowerHeaterClamps={() => {
                if (!app.splicer.children.heaterClamps.isUp()) return false;
                return canInteractWithHeaterLid();
            }}

            canOpenMainHeaterLid={() => {
                if (!app.splicer.children.mainHeaterLid.isClosed()) return false;
                return canInteractWithHeaterLid();
            }}

            canCloseMainHeaterLid={() => {
                if (!app.splicer.children.mainHeaterLid.isOpen()) return false;
                return canInteractWithHeaterLid();
            }}

            onFiberPlacedInHeater={() => setInstructions("Извлеките волокно из нагревателя")}

            onFiberRemovedFromHeater={() => {
                setInstructions("");
                if (props.onFiberRemovedFromHeater) props.onFiberRemovedFromHeater();
            }}

            isSpliceCompleted={() => true}
        />
    );
}
