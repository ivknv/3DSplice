import React from "react";

export default function HelpButton({visible = true, onClick}) {
    return (
        <button
            id="help-button"
            title="Помощь"
            style={{
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none"
            }}
            onClick={onClick}
        >
            ?
        </button>
    );
}

