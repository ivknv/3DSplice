import React, {useState, useEffect, useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {useModel} from "../gltf";
import InteractiveElement from "./InteractiveElement";
import AnimationActionController from "../AnimationActionController";
import * as THREE from "three";
import {useApp} from "../App";
import PowerOnVideo from "../videos/power_on.mp4";
import SpliceVideo from "../videos/splice.mp4";
import Video from "./Video";

const BASE_ANIMATION_SPEED = 5;

export function useSplicer() {
    return useApp().splicer;
}

export function useSplicerElement(name) {
    const {children} = useSplicer();

    return children[name];
}

export default function Splicer(props) {
    const gltf = useModel("splicer");
    const model = useRef(gltf.scene.children[0]);
    const [mixer, setMixer] = useState(null);
    const animations = useRef(gltf.animations);
    const appState = useApp();

    const powerOnVideo = useRef(null);
    const spliceVideo = useRef(null);

    const [video, setVideo] = useState(null);

    useMemo(() => {
        appState.splicer = {
            model: model.current,
            animations: animations.current,
            mixer: new THREE.AnimationMixer(model.current),
            children: new Object()
        };

        setMixer(appState.splicer.mixer);
    }, []);

    useFrame((_, delta) => {
        if (mixer) mixer.update(delta);
    });

    if (!mixer) return null;

    return (
        <primitive object={model.current} position={[0, -0.07, 0]}>
            <Video
                src={PowerOnVideo}
                onCreated={texture => powerOnVideo.current = texture}
                play={(video ?? false) && video === powerOnVideo.current}
                onEnded={() => appState.state.onPowerOn()}
            />
            <Video
                src={SpliceVideo}
                onCreated={texture => spliceVideo.current = texture}
                play={(video ?? false) && video === spliceVideo.current}
                resetAfterEnd={true}
                onEnded={() => appState.state.onSpliceCompleted()}
            />
            <ElectrodeAnimation/>
            <LidElement/>
            <ScreenBearingElement/>
            <ScreenElement video={video}/>
            <LeftFiberCladdingClampElement/>
            <RightFiberCladdingClampElement/>
            <LeftFiberClampElement/>
            <RightFiberClampElement/>
            <HeaterMainLidElement/>
            <HeaterClampsElement/>
            <SetButtonElement onPressed={() => {
                setVideo(spliceVideo.current);
            }} />
            <ResetButtonElement/>
            <HeatButtonElement/>
            <HeaterIndicator active={props.heaterActive ?? false} />
            <PowerSwitchElement onToggle={() => {
                setVideo(powerOnVideo.current);
            }}
        />
        </primitive>
    );
}

function ElectrodeAnimation() {
    const state = useSplicer();
    const {mixer, animations} = state;

    const makeAction = clipName => {
        const clip = THREE.AnimationClip.findByName(animations, clipName);

        const action = mixer.clipAction(clip);
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;

        return action;
    };

    const playAction = (action, timeScale) => {
        action.timeScale = (timeScale ?? 1) * 6;
        action.reset();
        if (action.timeScale < 0) {
            action.time = 2;
        }
        action.play();
    };

    useEffect(() => {
        const revealElectrodeAction1 = makeAction("Reveal Electrode 1");
        const revealElectrodeAction2 = makeAction("Reveal Electrode 2");

        state.revealElectrode = () => {
            playAction(revealElectrodeAction1);
            playAction(revealElectrodeAction2);
        };

        state.hideElectrode = () => {
            playAction(revealElectrodeAction1, -1);
            playAction(revealElectrodeAction2, -1);
        };
    }, []);

    return null;
}

function SplicerElement(props) {
    const {model, children} = useSplicer();

    const oldName = useRef(props.name);
    const state = useRef(null);

    useEffect(() => {
        if (oldName.current) delete children[oldName.current];
        if (props.name) children[props.name] = state.current;
        oldName.current = props.name;
    }, [props.name]);

    const onCreated = () => {
        state.current = new Object();
        if (props.name) children[props.name] = state.current;
        if (props.onCreated) props.onCreated(state.current);
    }

    return <InteractiveElement model={model} {...props} onCreated={onCreated} />;
}

function AnimatedSplicerElement(props) {
    const controller = useRef(null);
    const {animations, mixer, children} = useSplicer();

    useMemo(() => {
        controller.current = AnimationActionController.fromAnimationName(animations, mixer, props.animation);
        controller.current.onCompleted = () => {
            if (props.onAnimationCompleted) props.onAnimationCompleted();
        };
        controller.current.onReset = () => {
            if (props.onAnimationReset) props.onAnimationReset();
        };
    }, []);

    useEffect(() => {
        return () => controller.current.dispose();
    }, []);

    useEffect(() => {
        controller.current.scale = props.animationSpeed ?? 1;
    }, [props.animationSpeed])

    const checkDependencies = () => {
        if (props.checkDependencies && !props.checkDependencies()) return false;

        const deps = props.deps;

        if (!deps) return true;

        for (const name in deps) {
            if (!children[name]) return false;
            if (children[name].getAnimationState() !== deps[name]) return false;
        }

        return true;
    };

    const onClick = () => {
        if (checkDependencies()) {
            controller.current.toggle();

            if (props.onClick) props.onClick();
        }
    };

    const onCreated = state => {
        state.getAnimationState = () => controller.current?.state;
        state.animationController = controller.current;

        if (props.onCreated) props.onCreated(state);
    };

    return (
        <SplicerElement
            {...props}
            onCreated={onCreated}
            onClick={onClick}
        />
    );
}

function LidElement() {
    const splicer = useSplicer();
    const openTooltip = "Открыть крышку сварочного аппарата";
    const closeTooltip = "Закрыть крышку сварочного аппарата";
    const [tooltip, setTooltip] = useState(openTooltip);
    const state = useRef(null);

    const app = useApp();

    return (
        <AnimatedSplicerElement
            objectNames={["Splice_Lid", "Cube057", "Cube058", "Cube059"]}
            animation="Open Lid"
            animationSpeed={BASE_ANIMATION_SPEED}
            deps={{
                leftFiberCladdingClamp: "initial",
                rightFiberCladdingClamp: "initial",
                leftFiberClamp: "initial",
                rightFiberClamp: "initial",
                screenBearing: "initial"
            }}
            name="lid"
            tooltip={tooltip}
            onCreated={elementState => {
                state.current = elementState;
                state.current.isOpen = () => state.current.getAnimationState() === "completed";
                state.current.isClosed = () => state.current.getAnimationState() === "initial";
            }}
            checkDependencies={() => {
                if (!state.current) return false;

                if (state.current.isOpen()) {
                    return app.state.canCloseLid();
                } else if (state.current.isClosed()) {
                    return app.state.canOpenLid();
                }

                return true;
            }}
            onClick={() => {
                if (state.current.isOpen()) {
                    splicer.hideElectrode();
                } else if (state.current.isClosed()) {
                    splicer.revealElectrode();
                }
            }}
            onAnimationCompleted={() => {
                app.state.onLidOpened();
                setTooltip(closeTooltip);
            }}
            onAnimationReset={() => {
                app.state.onLidClosed();
                setTooltip(openTooltip);
            }}
        />
    );
}

function ScreenElement(props) {
    const {model} = useSplicer();
    const video = useRef(null);
    const screenObject = useRef(null);
    const emptyTexture = useRef(null);

    useMemo(() => {
        emptyTexture.current = new THREE.Texture();
        screenObject.current = model.getObjectByName("Cube113_1");
        screenObject.current.material.reflectivity = 0.1;
        screenObject.current.material.needsUpdate = true;
    }, []);

    const setVideo = newVideo => {
        video.current = newVideo;

        if (!newVideo) {
            screenObject.current.material.map = emptyTexture.current;
            screenObject.current.material.color.set(0x000000);
        } else {
            screenObject.current.material.map = newVideo;
            screenObject.current.material.color.set(0x888888);
        }
        screenObject.current.material.needsUpdate = true;
    };

    useEffect(() => {
        if (props.video === video.current) return;

        setVideo(props.video);
    }, [props.video]);

    return (
        <AnimatedSplicerElement
            objectNames={["Cube113", "Cube113_1"]}
            deps={{screenBearing: "initial"}}
            animation="Rotate Screen"
            animationSpeed={BASE_ANIMATION_SPEED}
            name="screen"
            tooltip="Повернуть экран"
        />
    );
}

function ScreenBearingElement() {
    const [tooltip, setTooltip] = useState("Сложить экран");

    return (
        <AnimatedSplicerElement
            objectNames={["Cube108", "Cube108_1", "Screen_Hinge", "Screen_Hinge001"]}
            animation="Rotate Screen Bearing"
            animationSpeed={BASE_ANIMATION_SPEED}
            deps={{screen: "completed", lid: "initial"}}
            name="screenBearing"
            tooltip={tooltip}
            onAnimationCompleted={() => setTooltip("Вернуть экран")}
            onAnimationReset={() => setTooltip("Сложить экран")}
        />
    );
}

function LeftFiberCladdingClampElement() {
    const app = useApp();
    const [tooltip, setTooltip] = useState("Поднять зажим");

    return (
        <AnimatedSplicerElement
            objectNames={[
                "Fiber_Clamp_Bar001", "Fiber_Clamp_Handle001", "Fiber_Clamp_Bar_End001",
                "Fiber_Clamp_Presser_Leg001", "Cube017", "Screw004"
            ]}
            animation="Lift Up Left Fiber Clamp Bar"
            animationSpeed={BASE_ANIMATION_SPEED}
            name="leftFiberCladdingClamp"
            tooltip={tooltip}
            deps={{lid: "completed", leftFiberClamp: "initial"}}
            onCreated={element => {
                element.isUp = () => element.getAnimationState() === "completed";
                element.isDown = () => element.getAnimationState() === "initial";
            }}
            onAnimationCompleted={() => {
                app.state.onLeftFiberCladdingClampUp();
                setTooltip("Опустить зажим");
            }}
            onAnimationReset={() => {
                app.state.onLeftFiberCladdingClampDown();
                setTooltip("Поднять зажим");
            }}
        />
    );
}

function RightFiberCladdingClampElement() {
    const app = useApp();
    const [tooltip, setTooltip] = useState("Поднять зажим");

    return (
        <AnimatedSplicerElement
            objectNames={[
                "Fiber_Clamp_Bar", "Fiber_Clamp_Handle", "Fiber_Clamp_Bar_End",
                "Fiber_Clamp_Presser_Leg", "Cube068", "Cube068_1", "Screw010"
            ]}
            animation="Lift Up Right Fiber Clamp Bar"
            animationSpeed={BASE_ANIMATION_SPEED}
            name="rightFiberCladdingClamp"
            deps={{lid: "completed", rightFiberClamp: "initial"}}
            tooltip={tooltip}
            onCreated={element => {
                element.isUp = () => element.getAnimationState() === "completed";
                element.isDown = () => element.getAnimationState() === "initial";
            }}
            onAnimationCompleted={() => {
                app.state.onRightFiberCladdingClampUp()
                setTooltip("Опустить зажим");
            }}
            onAnimationReset={() => {
                app.state.onRightFiberCladdingClampDown()
                setTooltip("Поднять зажим");
            }}
        />
    );
}

function LeftFiberClampElement() {
    const app = useApp();
    const [tooltip, setTooltip] = useState("Поднять зажим");

    return (
        <AnimatedSplicerElement
            objectNames={["Cube019_1", "Cube019_2", "Fiber_Cladding_Clamp_(outer)001"]}
            animation="Lift Up Left Fiber Clamp"
            animationSpeed={BASE_ANIMATION_SPEED}
            name="leftFiberClamp"
            deps={{lid: "completed", leftFiberCladdingClamp: "completed"}}
            tooltip={tooltip}
            onCreated={element => {
                element.isUp = () => element.getAnimationState() === "completed";
                element.isDown = () => element.getAnimationState() === "initial";
            }}
            onAnimationCompleted={() => {
                app.state.onLeftFiberClampUp();
                setTooltip("Опустить зажим");
            }}
            onAnimationReset={() => {
                app.state.onLeftFiberClampDown();
                setTooltip("Поднять зажим");
            }}
        />
    );
}

function RightFiberClampElement() {
    const app = useApp();
    const [tooltip, setTooltip] = useState("Поднять зажим");

    return (
        <AnimatedSplicerElement
            objectNames={["Cube054_1", "Cube054_2", "Fiber_Cladding_Clamp_(outer)"]}
            animation="Lift Up Right Fiber Clamp"
            animationSpeed={BASE_ANIMATION_SPEED}
            name="rightFiberClamp"
            deps={{lid: "completed", rightFiberCladdingClamp: "completed"}}
            tooltip={tooltip}
            onCreated={element => {
                element.isUp = () => element.getAnimationState() === "completed";
                element.isDown = () => element.getAnimationState() === "initial";
            }}
            onAnimationCompleted={() => {
                app.state.onRightFiberClampUp();
                setTooltip("Опустить зажим");
            }}
            onAnimationReset={() => {
                app.state.onRightFiberClampDown();
                setTooltip("Поднять зажим");
            }}
        />
    );
}

function HeaterMainLidElement() {
    const app = useApp();
    const state = useRef(null);
    const [tooltip, setTooltip] = useState("Открыть крышку нагревателя");

    return (
        <AnimatedSplicerElement
            objectNames={["Heater_Lid", "Cube014"]}
            animation="Open Heating Chamber Lid"
            animationSpeed={BASE_ANIMATION_SPEED}
            name="mainHeaterLid"
            tooltip={tooltip}
            onCreated={element => {
                element.isOpen = () => element.getAnimationState() === "completed";
                element.isClosed = () => element.getAnimationState() === "initial";
                state.current = element;
            }}
            onAnimationCompleted={() => {
                app.state.onMainHeaterLidOpened()
                setTooltip("Закрыть крышку нагревателя");
            }}
            onAnimationReset={() => {
                app.state.onMainHeaterLidClosed()
                setTooltip("Открыть крышку нагревателя");
            }}
            checkDependencies={() => {
                if (state.current.isClosed()) {
                    return app.state.canOpenMainHeaterLid();
                } else if (state.current.isOpen()) {
                    return app.state.canCloseMainHeaterLid();
                }

                return true;
            }}
        />
    );
}

function HeaterClampsElement() {
    const app = useApp();
    const state = useRef(null);
    const [tooltip, setTooltip] = useState("Поднять зажимы нагревателя");

    return (
        <AnimatedSplicerElement
            objectNames={["Cube016"]}
            animation="Lift Up Heating Chamber Side Lid"
            animationSpeed={BASE_ANIMATION_SPEED}
            name="heaterClamps"
            tooltip={tooltip}
            onCreated={element => {
                element.isUp = () => element.getAnimationState() === "completed";
                element.isDown = () => element.getAnimationState() === "initial";
                state.current = element;
            }}
            onAnimationCompleted={() => {
                app.state.onHeaterClampsOpened()
                setTooltip("Опустить зажимы нагревателя");
            }}
            onAnimationReset={() => {
                app.state.onHeaterClampsClosed()
                setTooltip("Поднять зажимы нагревателя");
            }}
            checkDependencies={() => {
                if (state.current.isDown()) {
                    return app.state.canLiftHeaterClamps();
                } else if (state.current.isUp()) {
                    return app.state.canLowerHeaterClamps();
                }

                return true;
            }}
        />
    );
}

function SetButtonElement(props) {
    const app = useApp();

    return (
        <SplicerElement
            objectNames={["Cube135", "Cube135_1"]}
            name="setButton"
            tooltip="Произвести сварку"
            onClick={() => {
                if (!app.state.canPressSet()) return;

                if (props.onPressed) props.onPressed();
                app.state.onSetPressed()
            }}
        />
    );
}

function ResetButtonElement() {
    return <SplicerElement objectNames={["Cube136", "Cube136_1"]} />;
}

function HeatButtonElement(props) {
    const app = useApp();

    return (
        <SplicerElement
            objectNames={["Cube137", "Cube137_1"]}
            name="heatButton"
            tooltip="Включить нагреватель"
            onClick={() => {
                if (!app.state.canPressHeat()) return;

                if (props.onPressed) props.onPressed();
                app.state.onHeatPressed();
            }}
        />
    );
}

function PowerSwitchElement(props) {
    const state = useRef(null);
    const [tooltip, setTooltip] = useState("Включить сварочный аппарат");

    return (
        <AnimatedSplicerElement
            objectNames={["Cube050"]}
            animation="Power On (AC)"
            animationSpeed={20}
            name="powerSwitch"
            tooltip={tooltip}
            checkDependencies={() => state.current.isOff()}
            onCreated={element => {
                state.current = element;
                element.isOn = () => element.getAnimationState() === "completed";
                element.isOff = () => element.getAnimationState() === "initial";
            }}
            onAnimationCompleted={() => {
                if (props.onToggle) props.onToggle();
                setTooltip("");
            }}
        />
    );
}

function HeaterIndicator({active = false}) {
    const {model} = useSplicer();
    const intervalId = useRef(null);
    const flashing = useRef(false);
    const object = useRef(null);
    const initialColor = useRef(null);
    const activeColor = useRef(null);

    const startFlashing = () => {
        if (intervalId.current !== null) stopFlashing();

        intervalId.current = setInterval(() => {
            const color = flashing.current ? initialColor.current : activeColor.current;
            object.current.material.color.set(color);
            flashing.current = !flashing.current;
        }, 1000);
    }

    const stopFlashing = () => {
        clearInterval(intervalId.current);
        intervalId.current = null;
        object.current.material.color.set(initialColor.current);
    }

    useEffect(() => {
        object.current = model.getObjectByName("HeaterIndicator");
        activeColor.current = new THREE.Color("orange");
        initialColor.current = object.current.material.color.clone();

        return stopFlashing;
    }, []);

    useEffect(() => {
        if (active) {
            startFlashing();
        } else {
            stopFlashing();
        }
    }, [active]);

    return null;
}
