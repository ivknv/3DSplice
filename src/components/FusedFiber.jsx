import React, {useEffect, useRef, useState} from "react";
import AnimationActionController from "../AnimationActionController";
import {useApp} from "../App";
import * as THREE from "three";
import {useFrame, useThree} from "@react-three/fiber";
import InteractiveElement from "./InteractiveElement";
import {clamp, projectMouseOntoPlane} from "../common";
import * as Colors from "../colors";

function makeKeyframeTrack(model, offsetY, offsetZ) {
    return new THREE.VectorKeyframeTrack(
        ".position",
        [0, 2],
        [
            model.position.x,
            model.position.y,
            model.position.z,
            model.position.x,
            model.position.y + offsetY,
            model.position.z + offsetZ
        ],
        THREE.InterpolateLinear);
}

class FusedFiberState {
    constructor(app, group, pointer, camera) {
        this.app = app;
        this.group = group;
        this.fibers = [];
        this.pointer = pointer;
        this.camera = camera;

        this.minY = -0.012;
        this.maxY = 0.17;

        this.originalPosition = new THREE.Vector3();
        this.clickPoint = new THREE.Vector3();
        this.mixer = null;
        this.keyframeTrack = null;
        this.animationClip = null;
        this.animationController = null;
        this.initialAngles = [];
        this.placedInHeater = false;

        this.held = false;
    }

    dispose() {
        if (this.animationController) this.animationController.dispose();
    }

    get position() {
        return this.group.current.position;
    }

    checkPlacement() {
        const value = Math.abs(this.position.y - this.minY) <= 0.003;

        if (this.placedInHeater !== value) {
            this.placedInHeater = value;

            if (value) {
                this.app.state.onFiberPlacedInHeater();
            } else {
                this.app.state.onFiberRemovedFromHeater();
            }
        }
    }

    update(delta) {
        this.mixer.update(delta);

        if (this.held) this.syncWithMouse();
        this.updateRotation();
    }

    setFibers(fibers) {
        this.fibers = fibers;
        this.mixer = new THREE.AnimationMixer(this.group.current);
        this.keyframeTrack = makeKeyframeTrack(this.group.current, 0.1, 0.0525);
        this.animationClip = new THREE.AnimationClip("Lift Fiber", 2, [this.keyframeTrack]);
        this.animationController = new AnimationActionController(this.mixer, this.animationClip);
        this.initialAngles = fibers.map(f => f.rotation.z);

        this.animationController.onCompleted = () => {
            this.app.state.onFiberRemoved();
        };
    }

    projectMouseOntoFiber() {
        return projectMouseOntoPlane(this.position, this.pointer, "z", this.camera);
    }

    updateRotation() {
        const t = this.animationController.action.time / this.animationClip.duration;

        this.fibers.forEach((fiber, index) => {
            const initialAngle = this.initialAngles[index]
            const delta = initialAngle - 0.5 * Math.PI;
            fiber.rotation.z = initialAngle - delta * t;
        });
    }

    syncWithMouse() {
        const projected = this.projectMouseOntoFiber();

        const delta = projected.y - this.clickPoint.y;
        this.position.y = clamp(this.originalPosition.y + delta, this.minY, this.maxY);
    }

    isAnimationCompleted() {
        return this.animationController.state === "completed";
    }
}

export default function FusedFiber(props) {
    const [active, setActive] = useState(props.active ?? false);
    const [ready, setReady] = useState(false);
    const fiberState = useRef(null);
    const group = useRef(null);
    const [highlightColor, setHighlightColor] = useState(Colors.HIGHLIGHT);

    const appState = useApp();

    useEffect(() => {
        setActive(props.active ?? false);

        if (props.active && !fiberState.current) {
            fiberState.current = new FusedFiberState(appState, group, pointer, camera);
            fiberState.current.setFibers(appState.fibers);
            setReady(true);
        }
    }, [props.active]);

    useEffect(() => {
        return () => {if (fiberState.current) fiberState.current.dispose()};
    }, []);

    useEffect(() => {
        if (props.canExtract) {
            fiberState.current.animationController.playForward();
        }
    }, [props.canExtract]);

    const {pointer, camera} = useThree();

    useFrame((_, delta) => {
        if (!active || !ready) return;
        fiberState.current.update(delta);
    });

    const onClick = () => {
        const state = fiberState.current;

        if (!state.held) {
            if (!state.isAnimationCompleted()) return;

            if (!appState.state.canPlaceFiberInHeater()) return;

            setHighlightColor(Colors.HIGHLIGHT_ACTIVE);

            state.originalPosition.copy(state.position);
            state.clickPoint = state.projectMouseOntoFiber();
            state.held = true;
        } else {
            reset();
        }
    };

    const reset = () => {
        setHighlightColor(Colors.HIGHLIGHT);

        const state = fiberState.current;

        if (state.held) {
            state.syncWithMouse();
            state.checkPlacement();
        }

        state.held = false;
    };

    return (
        <group ref={group}>
            {props.children}
            {active && ready &&
                <InteractiveElement
                    model={group.current}
                    objectNames={["Cylinder_1", "Cylinder_2", "Cylinder_3"]}
                    name="fusedFiber"
                    tooltip="Переместить волокно"
                    highlightColor={highlightColor}
                    onClick={onClick}
                    onFocus={() => fiberState.current.held}
                    onFocusLoss={reset}
                />
            }
        </group>
    );
}
