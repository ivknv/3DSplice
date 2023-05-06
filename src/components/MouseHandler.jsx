import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {useCursor} from "@react-three/drei";
import {useTooltip} from "./Tooltip";

const MouseContext = createContext(null);

export function useMouse() {
    return useContext(MouseContext);
}

const DRAG_TRESHOLD = 4;

export default function MouseHandler(props) {
    const currentHover = useRef(null);
    const state = useRef(null);

    useMemo(() => {
        currentHover.current = {element: null, materials: new Map()};
        state.current = {
            elements: new Set(),
            hovered: null,
            focus: null,
            setFocus(element) {
                if (this.focus && this.focus !== element) {
                    loseFocus();
                }

                if (element && element.onFocus()) {
                    this.focus = element;
                } else {
                    loseFocus();
                }
            },
            loseFocus() {
                if (!this.focus) return;

                this.focus.onFocusLoss();
                this.focus = null;
            },
            update() {
                const element = currentHover.current.element;
                if (!element) return;

                updateTooltip(element, undefined, undefined);
                element.objects.forEach(x => x.material.color.set(element.highlightColor));
            }
        };
    }, []);

    const groupRef = useRef(null);

    const [hover, setHover] = useState(false);
    useCursor(hover, "pointer", "auto");

    const tooltip = useTooltip();

    const identifyElement = object => findElement(object, state.current.elements);
    const rememberMaterial = element => element.objects.forEach(x => currentHover.current.materials.set(x, x.material));

    const setElementHover = element => {
        if (currentHover.current.element !== element && currentHover.current.element) unsetElementHover();
        if (element?.hovered ?? true) return;
        if (state.current.focus && state.current.focus !== element) return;

        currentHover.current.element = element;

        rememberMaterial(element);
        setHoverMaterial(element);
        element.hovered = true;
        state.current.hovered = element;
        setHover(true);
    };

    const unsetElementHover = () => {
        if (!currentHover.current.element) return;

        restoreMaterial(currentHover.current.element, currentHover.current.materials)

        currentHover.current.element.hovered = false;
        currentHover.current.element = null;
        state.current.hovered = null;
        setHover(false);
    };

    const loseFocus = () => state.current.loseFocus();

    const updateTooltip = (element, x, y) => {
        if (element) {
            tooltip.setText(element.tooltip);
            tooltip.setVisible(true);
            if (x !== undefined) tooltip.setX(x + 16);
            if (y !== undefined) tooltip.setY(y + 16);
        } else {
            tooltip.setVisible(false);
        }
    };

    useFrame(({raycaster}) => {
        if (!groupRef.current) return;

        const intersection = raycaster.intersectObjects(groupRef.current.children);
        const element = identifyElement(intersection[0]?.object);
        setElementHover(element);

        if (element?.hovered) {
            updateTooltip(element, undefined, undefined);
        } else {
            updateTooltip(null, undefined, undefined);
        }
    });

    return (
        <MouseContext.Provider value={state.current}>
            <group
                ref={groupRef}
                onPointerMove={event => {
                    tooltip.setX(event.clientX + 16);
                    tooltip.setY(event.clientY + 16);
                }}
                onClick={event => {
                    event.stopPropagation();

                    if (event.delta > DRAG_TRESHOLD) return;

                    const element = currentHover.current.element;

                    if (element) {
                        if (state.current.focus !== element) loseFocus();

                        element.onClick();
                        if (element.onFocus()) {
                            state.current.setFocus(element);
                        } else {
                            loseFocus();
                        }
                    } else {
                        loseFocus();
                    }

                    updateTooltip(element, event.clientX, event.clientY);
                }}
                onPointerMissed={() => {
                    loseFocus();
                    updateTooltip(null, 0, 0);
                }}
            >
                {props.children}
            </group>
        </MouseContext.Provider>
    );
}

function setHoverMaterial(element) {
    for (const object of element.objects) {
        object.material = object.material.clone();
        object.material.color.set(element.highlightColor);
        object.material.metalness = 0.0;
        object.material.roughness = 1.0;
    }
}

function restoreMaterial(element, materials) {
    for (const object of element.objects) {
        object.material.dispose();
        object.material = materials.get(object);
        materials.delete(object);
    }
}

function findElement(object, elements) {
    for (const element of elements) {
        if (element.objects.indexOf(object) > -1) return element;
    }

    return null;
}
