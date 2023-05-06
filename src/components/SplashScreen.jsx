import React from "react";

export default function SplashScreen({visible = true, goNext}) {
    return (
        <section
            id="splash-screen"
            style={{
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none"
            }}>
            <h1>
                Симулятор аппарата для сварки оптических волокон<br/>
                Fujikura FSM-30S
            </h1>

            <button
                className="blue-button blue-button-centered"
                id="start-button"
                onClick={goNext}
            >
                Начать
            </button>
        </section>
    );
}
