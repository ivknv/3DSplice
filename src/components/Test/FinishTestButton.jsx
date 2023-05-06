import React from "react";

export default function FinishTestButton(props) {
    return (
        <button
            className="blue-button"
            onClick={() => {if (props.onFinished) props.onFinished()}}
        >
            Завершить тест
        </button>
    );
}
