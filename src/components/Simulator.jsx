import React, {useEffect, useMemo, useRef, useState} from "react";
import {Canvas, useThree} from "@react-three/fiber";
import TooltipScope from "./Tooltip";
import Instructions from "./Instructions";
import {clamp, useHideOnTransition} from "../common";
import * as Colors from "../colors"
import * as THREE from "three";
import Splicer from "./Splicer";
import {AdaptiveDpr, OrbitControls, Stats} from "@react-three/drei";
import MouseHandler from "./MouseHandler";
import Fiber from "./Fiber";
import {GLTFScope, GLTFModel} from "../gltf";
import {useAllLoaded, useLoad} from "./LoaderScope";
import FusedFiber from "./FusedFiber";
import SpliceProtection from "./SpliceProtection";
import {useApp} from "../App";
import States from "./states/States";
import RenderDispatcher from "./RenderDispatcher";

export function usePointerMove(callback, active) {
    const app = useApp();

    const handler = {
        callback: callback,
        setActive(active) {
            if (active) {
                app.pointerMoveCallbacks.add(this.callback);
            } else {
                app.pointerMoveCallbacks.delete(this.callback);
            }
        },
    };

    useEffect(() => {
        if (active ?? true) {
            app.pointerMoveCallbacks.add(callback);
        }

        return () => app.pointerMoveCallbacks.delete(callback);
    }, []);

    return handler;
}

export function useSimulatorCursor(value, cursor, defaultCursor) {
    const app = useApp();
    useEffect(() => {
        if (value) {
            app.setSimulatorCursor(cursor);
        } else {
            app.setSimulatorCursor(defaultCursor ?? "");
        }
    }, [value]);
}

export function useVideo(name) {
    return useApp().videos[name];
}

function VideoLoader() {
    const app = useApp();
    const [startLoadingVideos, finalizeLoadingVideos] = useLoad();

    useEffect(() => {
        startLoadingVideos();

        import("./videos").then(module => {
            app.videos.splice = module.SpliceVideo;
            app.videos.powerOn = module.PowerOnVideo;

            finalizeLoadingVideos();
        });
    }, []);
}

export default function Simulator({hashParameters = new Map(), ...props}) {
    const [rendererParameters, setRendererParameters] = useState(new Object());
    const [opacity, setOpacity] = useState(0);
    const [instructions, setInstructions] = useState("Включите сварочный аппарат");
    const [testButtonVisible, setTestButtonVisible] = useState(false);
    const appState = useApp();
    const container = useRef(null);

    const [splicerModel, setSplicerModel] = useState(null);
    const [fiberModel, setFiberModel] = useState(null);
    const [spliceProtectionModel, setSpliceProtectionModel] = useState(null);

    useEffect(() => {
        setRendererParameters(setupRendererParameters(hashParameters));
    }, [hashParameters]);

    useMemo(() => {
        appState.instructions = instructions;
        appState.setInstructions = setInstructions;
        appState.pointerMoveCallbacks = new Set();
        appState.setSimulatorCursor = cursor => {
            container.current.style.cursor = cursor;
        };
        appState.videos = new Object();

        import("../models/fujikura_fsm-30s.gltf").then(module => {
            setSplicerModel(module.default);
        });

        import("../models/fiber_optic_patch_cord.gltf").then(module => {
            setFiberModel(module.default);
        });

        import("../models/splice_protection_case.gltf").then(module => {
            setSpliceProtectionModel(module.default);
        });
    }, []);

    useEffect(() => {
        const onPointerMove = event => {
            appState.pointerMoveCallbacks.forEach(f => f(event));
        };

        container.current.addEventListener("pointermove", onPointerMove);

        return () => container.current.removeEventListener("pointermove", onPointerMove);
    }, []);

    const dpr = getDpr(hashParameters);
    const minDpr = Math.min(getMinDpr(hashParameters), dpr);

    return (
        <GLTFScope>
            {hashParameters.get("stats") === "true" &&
                <Stats showPanel={0} className="stats" />
            }
            <GLTFModel name="splicer" data={splicerModel} />
            <GLTFModel name="fiber" data={fiberModel} />
            <GLTFModel name="spliceProtection" data={spliceProtectionModel} />
            <VideoLoader/>

            <div
                className="application-container"
                style={{opacity: opacity, transition: "opacity 1.5s"}}
                ref={container}
            >
                <Instructions text={instructions} visible={true}/>
                <TooltipScope visible={false}>
                    <Canvas
                        gl={rendererParameters}
                        frameloop={hashParameters.get("frameloop") || "demand"}
                        camera={{
                            fov: 55,
                            near: 0.025,
                            far: 1000,
                            position: [0.5 * 0.55, 1 * 0.33, 0.5 * 0.33]
                        }}
                        dpr={dpr}
                        performance={{
                            min: minDpr,
                            max: dpr
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
    const [display, setDisplay] = useState(props.visible ? "block" : "none");
    const button = useRef(null);
    
    useEffect(() => {
        if (props.visible) setDisplay("block");
    }, [props.visible]);

    useHideOnTransition(
        () => button.current,
        () => setDisplay("none"),
        () => setDisplay("block"));

    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: "20vh"
            }}
        >
            <button
                className="blue-button"
                style={{
                    display: display,
                    margin: "auto",
                    zIndex: 15,
                    opacity: (!hidden && props.visible) ? 1 : 0,
                    pointerEvents: (!hidden && props.visible) ? "auto" : "none",
                    transition: "opacity 0.5s"
                }}
                onClick={() => {
                    setHidden(true);
                    if (props.startTest) props.startTest();
                }}
                ref={button}
            >
                Приступить к тесту
            </button>
        </div>
    );
}

function Scene({onLoaded, onScenarioCompleted}) {
    const [loaded, setLoaded] = useState(false);
    const [spliceCompleted, setSpliceCompleted] = useState(false);
    const [canExtractFusedFiber, setCanExtractFusedFiber] = useState(false);
    const [canMoveSpliceProtection, setCanMoveSpliceProtection] = useState(false);
    const [heaterState, setHeaterState] = useState("inactive");
    const [shrinkSpliceProtection, setShrinkSpliceProtection] = useState(false);
    const appState = useApp();

    const {regress} = useThree().performance;

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
        <RenderDispatcher>
            <States
                onSpliceCompleted={() => setSpliceCompleted(true)}
                extractFusedFiber={() => setCanExtractFusedFiber(true)}
                onFiberRemoved={() => setCanMoveSpliceProtection(true)}
                onHeatingStarted={() => {
                    setHeaterState("heating");
                    setShrinkSpliceProtection(true);
                }}
                onHeatingCompleted={() => setHeaterState("cooling")}
                onCoolingCompleted={() => setHeaterState("inactive")}
                onFiberRemovedFromHeater={() => {
                    if (onScenarioCompleted) onScenarioCompleted();
                }}
            />
            <OrbitControls
                enableDamping={false}
                onChange={regress}
            />
            <MouseHandler>
                <Splicer heaterState={heaterState} />
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
            <AdaptiveDpr/>
        </RenderDispatcher>
    );
}

function setupRendererParameters(hashParameters) {
    const rendererParameters = {
        antialias: hashParameters.get("antialias") !== "false",
        depth: hashParameters.get("depth") !== "false",
        stencil: hashParameters.get("stencil") !== "false",
        preserveDrawingBuffer: hashParameters.get("preserveDrawingBuffer") !== "false"
    };

    if (["highp", "mediump", "lowp"].indexOf(hashParameters.get("precision")) !== -1) {
        rendererParameters.precision = hashParameters.get("precision");
    }

    if (["high-performance", "low-power", "default"].indexOf(hashParameters.get("powerPreference")) !== -1) {
        rendererParameters.powerPreference = hashParameters.get("powerPreference");
    }

    return rendererParameters;
}

function getDpr(hashParameters) {
    return clamp(
        parseFloat(hashParameters.get("dpr") || window.devicePixelRatio),
        0.1,
        window.devicePixelRatio);
}

function getMinDpr(hashParameters) {
    return clamp(
        parseFloat(hashParameters.get("minDpr") || 0.3),
        0.1,
        window.devicePixelRatio);
}

function setupRenderer({gl}, hashParameters) {
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.toneMappingExposure = 0.7;
    gl.physicallyCorrectLights = hashParameters.get("physicallyCorrectLights") !== "false";
    gl.localClippingEnabled = hashParameters.get("localClippingEnabled") === "true";
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
