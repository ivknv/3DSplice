import { useEffect, useRef } from "react";
import * as THREE from "three";
import {useRenderDispatcher} from "./RenderDispatcher";

export default function Video(props) {
    const domElement = useRef(null);
    const texture = useRef(null);

    const dispatcher = useRenderDispatcher();

    useEffect(() => {
        domElement.current = document.createElement("video");
        domElement.current.muted = true;
        domElement.current.style.display = "none";
        domElement.current.src = props.src;
        domElement.current.playbackRate = 1;
        texture.current = new THREE.VideoTexture(domElement.current);
        texture.current.flipY = false;

        const onEnded = () => {
            if (props.resetAfterEnd) {
                domElement.current.currentTime = 0;
            }

            dispatcher.end();

            if (props.onEnded) props.onEnded();
        };

        const onPlay = () => dispatcher.begin();
        const onPause = () => dispatcher.end();

        domElement.current.addEventListener("play", onPlay);
        domElement.current.addEventListener("pause", onPause);
        domElement.current.addEventListener("ended", onEnded);

        if (props.onCreated) props.onCreated(texture.current);

        return () => {
            domElement.current.removeEventListener("ended", onEnded);
            domElement.current.removeEventListener("play", onPlay);
            domElement.current.removeEventListener("pause", onPause);
            texture.current.dispose();
        };
    }, []);

    useEffect(() => {
        if (props.play) {
            domElement.current.play();
        } else {
            domElement.current.pause();
        }
    }, [props.play]);

    return null;
}
