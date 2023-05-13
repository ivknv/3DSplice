import React, {useEffect, useRef, useState} from "react";
import {useHideOnTransition} from "../common";

export default function HelpButton({visible = true, onClick}) {
    const button = useRef(null);
    const [display, setDisplay] = useState(visible ? "block" : "none");
    
    useEffect(() => {
        if (visible) setDisplay("block");
    }, [visible]);

    useHideOnTransition(
        () => button.current,
        () => setDisplay("none"),
        () => setDisplay("block"));

    return (
        <button
            id="help-button"
            title="Помощь"
            style={{
                display: display,
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none"
            }}
            onClick={onClick}
            ref={button}
        >
            ?
        </button>
    );
}

