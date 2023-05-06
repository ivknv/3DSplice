import React from "react";

export default function StartTestButton(props) {
    return (
        <button
            className="blue-button"
            style={props.style}
            onClick={() => {if (props.onClick) props.onClick()}}
        >
            {(() => {
                if (props.firstTime) {
                    return "Начать тест";
                } else {
                    return "Пройти тест заново";
                }
            })()}
        </button>
    );
}
