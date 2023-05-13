import * as THREE from "three";
import {useEffect} from "react";

export function clamp(x, a, b) {
    return Math.max(Math.min(x, b), a);
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

export function useTransitionEnd(callback, elementFactory) {
    useEffect(() => {
        const element = elementFactory();

        element.addEventListener("transitionend", callback);

        return () => element.removeEventListener("transitionend", callback);
    }, []);
}

export function useHideOnTransition(elementFactory, hide, show) {
    useTransitionEnd(event => {
        const opacity = event.target.style.opacity;
        if (opacity !== "" && opacity <= 0.01) {
            hide();
        } else if (opacity >= 0.99) {
            show();
        }
    }, elementFactory);
}