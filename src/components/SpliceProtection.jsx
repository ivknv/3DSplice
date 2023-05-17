import React, {useEffect, useMemo, useRef, useState} from "react";
import InteractiveElement from "./InteractiveElement";
import {useModel} from "../gltf";
import * as THREE from "three";
import AnimationActionController from "../AnimationActionController";
import {clamp, projectMouseOntoPlane} from "../common";
import {useFrame, useThree} from "@react-three/fiber";
import {useApp} from "../App";
import * as Colors from "../colors";
import {useRenderDispatcher} from "./RenderDispatcher";
import {usePointerMove} from "./Simulator";

const HEATING_DURATION = 120; // seconds
const COOLING_DURATION = 30; // seconds

class SpliceProtectionState {
    constructor(app, group, animations, fiber, pointer, camera, renderDispatcher) {
        this.app = app;
        this.group = group;
        this.originalPosition = new THREE.Vector3();
        this.clickPoint = new THREE.Vector3();
        this.dispatcher = renderDispatcher;

        this.fiber = fiber;
        this.box = new THREE.Box3().setFromObject(fiber);

        this.pointer = pointer;
        this.camera = camera;

        this.delta = 0;
        this.mixer = new THREE.AnimationMixer(group.current);
        this.animationController = new AnimationActionController.fromAnimationName(
            animations, this.mixer, "Shrink");

        // Animation is normally played at 24 FPS and has a duration of 60 frames
        this.animationController.scale = 1 / HEATING_DURATION * 60 / 24;

        this.placed = false;
        this.held = false;

        this.animationController.onCompleted = () => {
            this.app.state.onHeatingCompleted();
            clearTimeout(this.timeoutId);

            this.timeoutId = setTimeout(() => {
                this.app.state.onCoolingCompleted();
            }, COOLING_DURATION * 1000);

            this.dispatcher.end();
        };

        this.timeoutId = null;
    }

    dispose() {
        this.animationController.dispose();
        clearTimeout(this.timeoutId);
    }

    get position() {
        return this.group.current.position;
    }

    get rotation() {
        return this.group.current.rotation;
    }

    setPosition(position) {
        this.position.copy(position);
        this.originalPosition.copy(position);
    }

    isCentered() {
        return Math.abs(this.position.x) < 0.004;
    }

    checkPlacement() {
        const value = this.isCentered();

        if (this.placed !== value) {
            this.placed = value;

            if (value) {
                this.app.state.onSpliceProtectionPlaced();
            } else {
                this.app.state.onSpliceProtectionRemoved();
            }
        }
    }

    projectMouseOntoModel() {
        return projectMouseOntoPlane(this.position, this.pointer, "z", this.camera);
    }

    updateRotation() {
        const fiberPos = new THREE.Vector3();
        this.fiber.getWorldPosition(fiberPos);

        const x = -this.delta - (this.originalPosition.x - fiberPos.x);
        const maxX = this.app.state.isSpliceCompleted() ? fiberPos.x + 0.05 : fiberPos.x - 0.1;
        const minX = 0.07;

        const newPosition = new THREE.Vector3(0, clamp(x, minX, maxX, 0));
        newPosition.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.fiber.rotation.z);

        this.rotation.z = -Math.PI * 0.5 + this.fiber.rotation.z;
        this.position.x = newPosition.x + fiberPos.x;
        this.position.y = newPosition.y + 0.0008 + fiberPos.y;
        this.position.z = newPosition.z + fiberPos.z;
    }

    syncWithMouse() {
        const projected = this.projectMouseOntoModel();
        this.delta = projected.x - this.clickPoint.x;
    }

    shrink() {
        this.dispatcher.begin();
        this.animationController.playForward();
    }

    update(delta) {
        this.mixer.update(delta);

        if (this.held) this.syncWithMouse();

        this.updateRotation();
    }
}

export default function SpliceProtection(props) {
    const gltf = useModel("spliceProtection");
    const model = gltf.scene.children[0];
    const animations = gltf.animations;
    const padding = useRef(null);
    const group = useRef(null);
    const spliceProtectionState = useRef(null);
    const appState = useApp();

    const [active, setActive] = useState(props.active ?? false);
    const [highlightColor, setHighlightColor] = useState(Colors.HIGHLIGHT);

    useMemo(() => {
        padding.current = model.getObjectByName("Cube").clone();
    }, []);

    const {camera, invalidate, pointer} = useThree();
    const renderDispatcher = useRenderDispatcher();

    useEffect(() => {
        const fiber = appState.fibers.find(x => x.name === "rightFiber");
        spliceProtectionState.current = new SpliceProtectionState(
            appState, group, animations, fiber, pointer, camera, renderDispatcher);
        spliceProtectionState.current.setPosition(props.initialPosition);

        return () => {
            if (padding.current) padding.current.dispose();
            if (spliceProtectionState.current); spliceProtectionState.current.dispose();
        }
    }, []);

    useEffect(() => {
        setActive(props.active ?? false);
    }, [props.active]);

    useEffect(() => {
        if (props.shrink) spliceProtectionState.current.shrink();
    }, [props.shrink])

    useFrame(() => {
        if (!spliceProtectionState.current) return;

        spliceProtectionState.current.update(renderDispatcher.delta);
    });

    const pointerHandler = usePointerMove(() => {
        const state = spliceProtectionState.current;

        state.syncWithMouse();
        state.updateRotation();
        invalidate();
    }, false);

    const onClick = () => {
        const state = spliceProtectionState.current;

        if (!state.held) {
            if (!appState.state.canPlaceSpliceProtection()) return;

            setHighlightColor(Colors.HIGHLIGHT_ACTIVE);

            state.originalPosition.copy(state.position);
            state.clickPoint.copy(state.projectMouseOntoModel());

            state.held = true;
            pointerHandler.setActive(true);
        } else {
            reset();
        }
    };

    const reset = () => {
        const state = spliceProtectionState.current;

        setHighlightColor(Colors.HIGHLIGHT);

        if (state.held) {
            state.syncWithMouse();
            state.updateRotation();
            state.checkPlacement();
            invalidate();
        }

        state.held = false;
        pointerHandler.setActive(false);
    };

    return (
        <group ref={group}>
            <primitive object={model}/>
            <primitive object={padding.current} scale={[1, 3, 6]} visible={false}/>
            {active &&
                <InteractiveElement
                    model={group.current}
                    objectNames={["Cube", "Cylinder001"]}
                    tooltip="Переместить гильзу КДЗС"
                    highlightColor={highlightColor}
                    onClick={onClick}
                    onFocus={() => spliceProtectionState.current.held}
                    onFocusLoss={reset}
                />
            }
        </group>
    );
}
