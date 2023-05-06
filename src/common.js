import * as THREE from "three";

export function clamp(x, a, b) {
    return Math.max(Math.min(x, b), a);
}

export function override(method, newMethod) {
    return (...args) => newMethod(method, ...args);
}

export function overrideMethod(object, methodName, newMethod) {
    const method = object[methodName];
    object[methodName] = override(method, newMethod);
}

export function projectMouseOntoPlane(planePosition, mousePosition, coordinate, camera) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, camera);

    const projected = raycaster.ray.origin.clone();

    const distToPlane = planePosition[coordinate] - raycaster.ray.origin[coordinate];
    const t = distToPlane / raycaster.ray.direction[coordinate];

    const offset = raycaster.ray.direction.clone().multiplyScalar(t);

    projected.add(offset);

    return projected;
}

export function shuffleArray(array) {
    // Durstenfeld algorithm
    for (let i = array.length - 1; i > 0; --i) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
}
