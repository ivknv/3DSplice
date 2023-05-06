import React, {useEffect, useMemo, useRef} from "react";
import {useMouse} from "./MouseHandler";
import * as Colors from "../colors";

export default function InteractiveElement(props) {
    const mouse = useMouse();

    const element = useRef(null);

    useMemo(() => {
        const objects = [];

        const {model, objectNames} = props;

        if (model) {
            for (const name of (objectNames ?? [])) {
                model.getObjectsByProperty("name", name).forEach(x => objects.push(x));
            }
        }

        element.current = {
            objects: objects,
            hovered: false,
            onClick: props.onClick ?? (() => {}),
            onFocus: props.onFocus ?? (() => {}),
            onFocusLoss: props.onFocusLoss ?? (() => {}),
            highlightColor: props.highlightColor ?? Colors.HIGHLIGHT,
            tooltip: props.tooltip ?? ""
        };
    }, []);

    useEffect(() => {
        mouse.elements.add(element.current);

        if (props.onCreated) props.onCreated(element.current);

        return () => mouse.elements.delete(element.current);
    }, []);

    useEffect(() => {
        element.current.tooltip = props.tooltip ?? "";
        mouse.update();
    }, [props.tooltip]);

    useEffect(() => {
        element.current.highlightColor = props.highlightColor ?? Colors.HIGHLIGHT;
        mouse.update();
    }, [props.highlightColor]);

    const updateObjects = () => {
        const objects = element.current.objects;

        while (objects.length > 0) objects.pop();

        const {model, objectNames} = props;

        if (model) {
            for (const name of (objectNames ?? [])) {
                model.getObjectsByProperty("name", name).forEach(x => objects.push(x));
            }
        }

        mouse.update();
    };

    useEffect(() => {
        updateObjects();
    }, [props.model, props.objectNames]);

    return <>{props.children}</>;
}
