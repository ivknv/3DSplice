import React, {useRef, useEffect, createContext, useContext} from "react";

const LoaderContext = createContext(null);

export default function LoaderScope(props) {
    const state = useRef({loading: 0, loaded: 0, callbacks: []});

    return (
        <LoaderContext.Provider value={state.current}>
            {props.children}
        </LoaderContext.Provider>
    );
}

export function useLoad() {
    const state = useContext(LoaderContext);

    return [
        () => { state.loading++ },
        () => {
            state.loading--;
            state.loaded++;

            if (state.loading === 0 && state.loaded > 0) {
                state.callbacks.forEach(callback => callback());
            }
        },
    ]
}

export function useAllLoaded(callback) {
    const state = useContext(LoaderContext);

    useEffect(() => {
        if (state.loading === 0 && state.loaded > 0) {
            callback();
        } else {
            state.callbacks.push(callback);
        }
    }, []);
}
