import React, {useEffect, useState} from "react";

export default function Instructions(props) {
    const [visible, setVisible] = useState(props.visible ?? true);
    const [text, setText] = useState(props.text ?? "");

    useEffect(() => {
        setVisible(props.visible ?? true);
    }, [props.visible]);

    useEffect(() => {
        setText(props.text ?? "");
    }, [props.text]);

    return (
        <section id="instructions" style={{display: visible ? "block" : "none"}}>
            {text}
        </section>
    );
}
