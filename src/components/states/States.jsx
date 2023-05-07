import React from "react";
import InitialState from "./InitialState";
import SplicerOnState from "./SplicerOnState";
import CanPlaceLeftFiberState from "./CanPlaceLeftFiberState";
import CanPlaceRightFiberState from "./CanPlaceRightFiberState";
import RightFiberPlacedState from "./RightFiberPlacedState";
import LeftFiberPlacedState from "./LeftFiberPlacedState";
import FibersPlacedState from "./FibersPlacedState";
import ReadyToSpliceState from "./ReadyToSpliceState";
import SpliceInProgressState from "./SpliceInProgressState";
import SpliceCompletedState from "./SpliceCompletedState";
import ReadyToPlaceSpliceProtection from "./ReadyToPlaceSpliceProtectionState";
import SpliceProtectionPlacedState from "./SpliceProtectionPlacedState";
import ReadyToPlaceFiberInHeaterState from "./ReadyToPlaceFiberInHeaterState";
import ReadyToHeatState from "./ReadyToHeatState";
import HeatingInProgressState from "./HeatingInProgressState";
import HeatingCompletedState from "./HeatingCompletedState";
import CanCloseHeaterState from "./CanCloseHeaterState";

export default function States(props) {
    return (
        <>
            <InitialState/>
            <SplicerOnState/>
            <CanPlaceLeftFiberState/>
            <CanPlaceRightFiberState/>
            <LeftFiberPlacedState/>
            <RightFiberPlacedState/>
            <FibersPlacedState/>
            <ReadyToSpliceState/>
            <SpliceInProgressState onSpliceCompleted={props.onSpliceCompleted} />
            <SpliceCompletedState
                extractFusedFiber={props.extractFusedFiber}
                onFiberRemoved={props.onFiberRemoved}
            />
            <ReadyToPlaceSpliceProtection/>
            <SpliceProtectionPlacedState/>
            <ReadyToPlaceFiberInHeaterState/>
            <ReadyToHeatState onHeatingStarted={props.onHeatingStarted} />
            <HeatingInProgressState
                onHeatingCompleted={props.onHeatingCompleted}
                onCoolingCompleted={props.onCoolingCompleted}
            />
            <HeatingCompletedState onFiberRemovedFromHeater={props.onFiberRemovedFromHeater} />
            <CanCloseHeaterState/>
        </>
    );
}
