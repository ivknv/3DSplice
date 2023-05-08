import {useFrame, useThree} from "@react-three/fiber";
import React, {createContext, useContext, useEffect, useMemo, useRef} from "react";
import * as THREE from "three";

const context = createContext(null);

export function useRenderDispatcher() {
    const globalDispatcher = useContext(context);
    const dispatcher = useRef(null);

    useMemo(() => {
        dispatcher.current = {
            clock: globalDispatcher.clock,
            invalidate: globalDispatcher.invalidate,
            _active: false,
            begin() {
                if (!this._active) {
                    this._active = true;
                    globalDispatcher.begin();
                }
            },
            end() {
                if (this._active) {
                    this._active = false;
                    globalDispatcher.end();
                }
            },
            get delta() {
                return globalDispatcher.delta;
            }
        };
    }, []);

    useEffect(() => {
        return () => dispatcher.current.end();
    }, []);

    return dispatcher.current;
}

export default function RenderDispatcher(props) {
    const state = useRef(null);

    const {invalidate} = useThree();

    useMemo(() => {
        state.current = {
            invalidate: invalidate,
            renderCount: 0,
            clock: new THREE.Clock(),
            delta: 0,
            begin() {
                this.renderCount++;
                if (this.renderCount === 1) {
                    this.updateDelta();
                    this.delta = 0;
                    invalidate();
                }
            },
            end() {
                this.renderCount--;
            },
            updateDelta() {
                this.delta = this.clock.getDelta();
            }
        };
    }, []);

    useFrame(() => {
        if (state.current.renderCount) {
            invalidate();
            state.current.updateDelta();
        }
    });

    return <context.Provider value={state.current}>{props.children}</context.Provider>;
}
