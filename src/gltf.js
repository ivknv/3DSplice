import {GLTFLoader} from "three/addons/loaders/GLTFLoader";

function parseGLTF(string) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.parse(string, "", resolve, reject);
    });
}

export {parseGLTF};
