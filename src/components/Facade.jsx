import React from "react";

export default function Facade({visible = true}) {
    return (
        <div
            id="facade"
            style={{
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none"
            }}>
        </div>
    );
}
