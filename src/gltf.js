import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import React, {useRef, useEffect, createContext, useContext} from "react";
import LoaderScope, {useLoad} from "./components/LoaderScope";

export function parseGLTF(string) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.parse(string, "", resolve, reject);
    });
}

export function useGLTFData(callback, data) {
    const model = useRef(null);

    useEffect(() => {
        if (!data) {
            model.current = null;
            return;
        }

        parseGLTF(data).then(gltf => {
            model.current = gltf.scene.children[0];
            callback(gltf);
        });

        return () => model.current?.dispose();
    }, [data]);
}

const GLTFContext = createContext(null);

export function GLTFScope(props) {
    const models = useRef(new Object());

    return (
        <LoaderScope>
            <GLTFContext.Provider value={models.current}>
                {props.children}
            </GLTFContext.Provider>
        </LoaderScope>
    );
}

export function useModels() {
    return useContext(GLTFContext);
}

export function useModel(name) {
    return useModels()[name];
}

export function GLTFModel({name, data}) {
    const models = useModels();

    const [start, finalize] = useLoad();

    useEffect(start, []);

    useGLTFData(gltf => {
        models[name] = gltf;
        finalize();
    }, data);
}
