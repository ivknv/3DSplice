import React, {useState, useEffect, useRef, useMemo} from "react";
import {useThree, useFrame} from "@react-three/fiber";
import {useModel} from "../gltf";
import {useSplicer} from "./Splicer";
import {clamp, projectMouseOntoPlane} from "../common";
import InteractiveElement from "./InteractiveElement";
import * as Colors from "../colors";
import * as THREE from "three";
import {useApp} from "../App";

class FiberState {
    constructor(app, model, group, camera, pointer) {
        this.app = app;
        this.camera = camera;
        this.pointer = pointer;
        this.group = group;
        this.model = model;
        this.direction = "right";
        this.box = new THREE.Box3().setFromObject(model);
        this.minX = 0;
        this.maxX = 0;
        this.clickPoint = new THREE.Vector3();
        this.originalPosition = new THREE.Vector3();
        this.held = false;
        this.placed = false;
    }

    get position() {
        return this.group.current.position;
    }

    get rotation() {
        return this.group.current.rotation;
    }

    checkPlacement() {
        const tolerance = 0.0015;

        let placed = false;

        if (this.direction === "left") {
            placed = Math.abs(this.getTipX() - this.maxX) < tolerance;
        } else {
            placed = Math.abs(this.getTipX() - this.minX) < tolerance;
        }

        if (this.placed !== placed) {
            this.placed = placed;

            if (placed) {
                if (this.direction === "left") {
                    this.app.leftFiberPlaced = placed;
                    this.app.state.onLeftFiberPlaced();
                } else {
                    this.app.rightFiberPlaced = placed;
                    this.app.state.onRightFiberPlaced();
                }
            } else if (this.direction === "left") {
                this.app.leftFiberPlaced = placed;
                this.app.state.onLeftFiberRemoved();
            } else {
                this.app.rightFiberPlaced = placed;
                this.app.state.onRightFiberRemoved();
            }
        }
    }

    setDirection(direction) {
        if (!this.group.current) return;

        if (direction === "right") {
            this.minX = 0.002;
            this.maxX = 0.07;
            this.rotation.y = 0;
        } else {
            this.maxX = -0.002;
            this.minX = -0.07;
            this.rotation.y = -Math.PI;
        }

        this.direction = direction;
    }

    setFromProps(props) {
        this.setDirection(props.direction ?? "right");
        if (props.position) this.setTipPosition(props.position);
    }

    getTipX() {
        const multiplier = this.direction === "right" ? 1 : -1;
        return this.position.x - this.box.max.x * multiplier;
    }

    setTipPosition(position) {
        this.setTipX(position.x);
        this.position.y = position.y;
        this.position.z = position.z;
    }

    setTipX(x) {
        if (!this.group.current) return;

        const multiplier = this.direction === "right" ? 1 : -1;
        this.position.x = this.box.max.x * multiplier + x;
    }

    updateRotation() {
        let t = (this.maxX - this.getTipX()) / (this.maxX - this.minX);
        if (this.direction === "left") {
            t = 1 - t;
        }

        this.rotation.z = (90 + 3 * t) * Math.PI / 180;
    }

    projectMouseOntoFiber() {
        return projectMouseOntoPlane(this.position, this.pointer, "y", this.camera);
    }

    syncWithMouse() {
        const projected = this.projectMouseOntoFiber();
        const delta = projected.x - this.clickPoint.x;

        this.setTipX(clamp(this.originalPosition.x + delta, this.minX, this.maxX));
    }
}

export default function Fiber(props) {
    const originalModel = useModel("fiber").scene.children[0];
    const model = useRef(null);
    const group = useRef(null);
    const padding = useRef(null);
    const [active, setActive] = useState(props.active ?? true);
    const [highlightColor, setHighlightColor] = useState(Colors.HIGHLIGHT);

    const fiberState = useRef(null);
    const appState = useApp();

    const {camera, pointer} = useThree();

    const setObjectName = () => {
        if (!group.current) return;
        if (!fiberState.current) return;

        group.current.name = fiberState.current.direction === "left" ? "leftFiber" : "rightFiber";
    }

    useEffect(() => {
        fiberState.current?.setDirection(props.direction ?? "right");
        setObjectName();
    }, [props.direction]);
    useEffect(() => {
        if (!fiberState.current) return;

        if (props.position) {
            fiberState.current.setTipPosition(props.position)
        }
        fiberState.current.updateRotation();
    }, [props.position]);
    useEffect(() => {
        setActive(props.active ?? true);
    }, [props.active]);

    useEffect(() => {
        return () => {
            if (model.current) model.current.dispose();
            if (padding.current) padding.current.dispose();
            if (group.current) group.current.dispose();
        };
    }, []);

    useMemo(() => {
        group.current = new THREE.Group();
        model.current = originalModel.clone();
        fiberState.current = new FiberState(appState, model.current, group, camera, pointer);
        fiberState.current.setFromProps(props);

        if (props.initialPosition) {
            fiberState.current.setTipPosition(props.initialPosition);
        }

        setObjectName();

        padding.current = model.current.getObjectByName("Cylinder_1").clone();

        if (appState.fibers === undefined) {
            appState.fibers = [];
        }

        appState.fibers.push(group.current);

        fiberState.current.updateRotation();
    }, []);

    useFrame(() => {
        const state = fiberState.current;
        if (!active || !state) return;
        if (state.held) state.syncWithMouse();
        state.updateRotation();
    });

    const splicer = useSplicer();

    const isClickable = () => {
        const clampElement = fiberState.current.direction === "left" ?
            splicer.children.leftFiberClamp : splicer.children.rightFiberClamp;

        return clampElement.isUp();
    };

    const onClick = () => {
        const state = fiberState.current;

        if (!state.held) {
            if (!isClickable()) {
                return;
            }

            setHighlightColor(Colors.HIGHLIGHT_ACTIVE);

            state.originalPosition.x = state.getTipX();
            state.clickPoint = state.projectMouseOntoFiber();

            state.held = true;
        } else {
            reset();
        }
    };

    const reset = () => {
        const state = fiberState.current;

        state.syncWithMouse();
        state.checkPlacement();

        setHighlightColor(Colors.HIGHLIGHT);
        state.held = false;
    };

    return (
        <primitive object={group.current}>
            <primitive object={model.current} rotation-z={0} />
            <primitive
                object={padding.current}
                visible={false}
                scale={[3, 1.65, 8]}
                position={[0, 0.102, 0]}
            />
            {active &&
                <InteractiveElement
                    model={group.current}
                    objectNames={["Cylinder_1", "Cylinder_2", "Cylinder_3"]}
                    tooltip="Переместить волокно"
                    highlightColor={highlightColor}
                    onClick={onClick}
                    onFocus={() => fiberState.current.held}
                    onFocusLoss={reset}
                />
            }
        </primitive>
    );
}
