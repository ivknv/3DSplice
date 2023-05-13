import React, {useEffect, useRef, useState} from "react";
import {useHideOnTransition} from "../common";

export default function SplashScreen({visible = true, goNext}) {
    const [display, setDisplay] = useState(visible ? "block" : "none");
    const section = useRef(null);

    useEffect(() => {
        if (visible) setDisplay("block");
    }, [visible]);

    useHideOnTransition(
        () => section.current,
        () => setDisplay("none"),
        () => setDisplay("block"));

    return (
        <section
            id="splash-screen"
            style={{
                display: display,
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none"
            }}
            ref={section}>
            <h1>
                Электронный практикум<br/>
                &laquo;Изучение аппарата для сварки оптических волокон&raquo;
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
