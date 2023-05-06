import React, {useEffect, useMemo, useState} from "react";
import {Canvas} from "@react-three/fiber";
import TooltipScope from "./Tooltip";
import Instructions from "./Instructions";
import {clamp} from "../common";
import * as Colors from "../colors"
import * as THREE from "three";
import Splicer from "./Splicer";
import {OrbitControls} from "@react-three/drei";
import MouseHandler from "./MouseHandler";
import Fiber from "./Fiber";
import {GLTFScope, GLTFModel} from "../gltf";
import {useAllLoaded} from "./LoaderScope";
import FusedFiber from "./FusedFiber";
import SplicerModel from "../models/fujikura_fsm-30s.gltf";
import FiberModel from "../models/fiber_optic_patch_cord.gltf";
import SpliceProtectionModel from "../models/splice_protection_case.gltf";
import SpliceProtection from "./SpliceProtection";
import {useApp} from "../App";
import States from "./states/States";

export default function Simulator({hashParameters = new Map(), ...props}) {
    const [rendererParameters, setRendererParameters] = useState(new Object());
    const [opacity, setOpacity] = useState(0);
    const [dpr, setDpr] = useState(window.devicePixelRatio);
    const [instructions, setInstructions] = useState("Включите сварочный аппарат");
    const [testButtonVisible, setTestButtonVisible] = useState(false);
    const appState = useApp();

    useEffect(() => {
        setRendererParameters(setupRendererParameters(hashParameters));
        setDpr(getDpr(hashParameters));
    }, [hashParameters]);

    useMemo(() => {
        appState.instructions = instructions;
        appState.setInstructions = setInstructions;
    }, []);

    return (
        <GLTFScope>
            <GLTFModel name="splicer" data={SplicerModel} />
            <GLTFModel name="fiber" data={FiberModel} />
            <GLTFModel name="spliceProtection" data={SpliceProtectionModel} />

            <div className="application-container" style={{opacity: opacity, transition: "opacity 1.5s"}}>
                <Instructions text={instructions} visible={true}/>
                <TooltipScope visible={false}>
                    <Canvas
                        gl={rendererParameters}
                        dpr={dpr}
                        camera={{
                            fov: 20,
                            near: 0.025,
                            far: 1000,
                            position: [0.5, 1, 0.5]
                        }}
                        onCreated={state => setupRenderer(state, hashParameters)}
                        scene={{background: new THREE.Color(Colors.CLEAR)}}
                    >
                        <Scene
                            onLoaded={() => setOpacity(1)}
                            onScenarioCompleted={() => setTestButtonVisible(true)}
                        />
                    </Canvas>
                </TooltipScope>
                <StartTestButton visible={testButtonVisible} startTest={props.startTest} />
            </div>
        </GLTFScope>
    );
}

function StartTestButton(props) {
    const [hidden, setHidden] = useState(false);
    return (
        <button
            className="blue-button"
            style={{
                position: "fixed",
                left: 0,
                right: 0,
                margin: "auto",
                bottom: "20vh",
                zIndex: 15,
                opacity: (!hidden && props.visible) ? 1 : 0,
                pointerEvents: (!hidden && props.visible) ? "auto" : "none",
                transition: "opacity 0.5s"
            }}
            onClick={() => {
                setHidden(true);
                if (props.startTest) props.startTest();
            }}
        >
            Приступить к тесту
        </button>
    );
}

function Scene({onLoaded, onScenarioCompleted}) {
    const [loaded, setLoaded] = useState(false);
    const [spliceCompleted, setSpliceCompleted] = useState(false);
    const [canExtractFusedFiber, setCanExtractFusedFiber] = useState(false);
    const [canMoveSpliceProtection, setCanMoveSpliceProtection] = useState(false);
    const [heaterActive, setHeaterActive] = useState(false);
    const [shrinkSpliceProtection, setShrinkSpliceProtection] = useState(false);
    const appState = useApp();

    useAllLoaded(() => {
        setLoaded(true);
        onLoaded();
    });

    useEffect(() => {
        if (loaded) {
            appState.setState("initial");
        }
    }, [loaded]);

    if (!loaded) return null;

    return (
        <>
            <States
                onSpliceCompleted={() => setSpliceCompleted(true)}
                extractFusedFiber={() => setCanExtractFusedFiber(true)}
                onFiberRemoved={() => setCanMoveSpliceProtection(true)}
                onHeatingStarted={() => {
                    setHeaterActive(true);
                    setShrinkSpliceProtection(true);
                }}
                onHeatingCompleted={() => setHeaterActive(false)}
                onFiberRemovedFromHeater={() => {
                    if (onScenarioCompleted) onScenarioCompleted();
                }}
            />
            <OrbitControls enableDamping={false} />
            <MouseHandler>
                <Splicer heaterActive={heaterActive} />
                <FusedFiber active={spliceCompleted} canExtract={canExtractFusedFiber}>
                    <Fiber
                        direction="left"
                        initialPosition={new THREE.Vector3(-0.07, 0.052, 0.0034)}
                        position={spliceCompleted ? new THREE.Vector3(0.00025, 0.052, 0.0034) : undefined}
                        active={!spliceCompleted}
                    />
                    <Fiber
                        direction="right"
                        initialPosition={new THREE.Vector3(0.07, 0.052, 0.0034)}
                        position={spliceCompleted ? new THREE.Vector3(-0.00025, 0.052, 0.0034) : undefined}
                        active={!spliceCompleted} />
                </FusedFiber>
                <SpliceProtection
                    initialPosition={new THREE.Vector3(0.099, 0.0527, 0.0034)}
                    active={canMoveSpliceProtection}
                    shrink={shrinkSpliceProtection}
                />
            </MouseHandler>
            <Lights/>
        </>
    );
}

function setupRendererParameters(hashParameters) {
    const rendererParameters = {
        antialias: hashParameters["antialias"] !== "false",
        depth: hashParameters["depth"] !== "false",
        stencil: hashParameters["stencil"] !== "false",
        preserveDrawingBuffer: hashParameters["preserveDrawingBuffer"] !== "false"
    };

    if (["highp", "mediump", "lowp"].indexOf(hashParameters["precision"]) !== -1) {
        rendererParameters.precision = hashParameters["precision"];
    }

    if (["high-performance", "low-power", "default"].indexOf(hashParameters["powerPreference"]) !== -1) {
        rendererParameters.powerPreference = hashParameters["powerPreference"];
    }

    return rendererParameters;
}

function getDpr(hashParameters) {
    return clamp(
        parseFloat(hashParameters["pixelRatio"] || window.devicePixelRatio),
        0.1,
        window.devicePixelRatio);
}

function setupRenderer({gl}, hashParameters) {
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.toneMappingExposure = 0.7;
    gl.physicallyCorrectLights = hashParameters["physicallyCorrectLights"] !== "false";
    gl.localClippingEnabled = hashParameters["localClippingEnabled"] === "true";
}

function Lights() {
    return (
        <>
            <ambientLight color="white" intensity={0.5}/>
            <directionalLight color="white" intensity={3} position={[0, 100, -100]}/>
            <directionalLight color="white" intensity={3} position={[100, 100, -100]}/>
            <directionalLight color="white" intensity={3} position={[-100, 100, -100]}/>
            <directionalLight color="white" intensity={3} position={[0, 20, 100]}/>
        </>
    );
}
