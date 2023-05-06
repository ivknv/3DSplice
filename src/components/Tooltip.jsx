import React, {createContext, useContext, useState, useRef} from "react";

const TooltipContext = createContext(null);

export function useTooltip() {
    return useContext(TooltipContext);
}

export default function TooltipScope(props) {
    const [text, setText] = useState(props.text ?? "");
    const [visible, setVisible] = useState(props.visible ?? false);
    const [x, setX] = useState(props.x ?? 0);
    const [y, setY] = useState(props.y ?? 0);

    const state = useRef({
        text: text,
        setText: setText,
        visible: visible,
        setVisible: setVisible,
        x: x,
        setX: setX,
        y: y,
        setY: setY
    });

    return (
        <TooltipContext.Provider value={state.current}>
            <span
                id="tooltip"
                style={{
                    opacity: (visible && text) ? 1 : 0,
                    left: x + "px",
                    top: y + "px"
                }}
            >
                {text}
            </span>
            {props.children}
        </TooltipContext.Provider>
    );
}
