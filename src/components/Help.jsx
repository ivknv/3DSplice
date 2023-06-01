import React, {useEffect, useRef, useState} from "react";
import {useHideOnTransition} from "../common";

export default function Help({visible = true, goNext}) {
    const section = useRef(null);
    const [display, setDisplay] = useState(visible ? "flex" : "none");

    useEffect(() => {
        if (visible) setDisplay("flex");
    }, [visible]);

    useHideOnTransition(
        () => section.current,
        () => setDisplay("none"),
        () => setDisplay("flex"));

    return (
        <section
            id="help"
            style={{
                display: display,
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none"
            }}
            ref={section}
        >
            <H1>Как пользоваться?</H1>
            <H3>Взаимодействие с 3D-объектами</H3>
            <P>Наведите на нужный элемент сварочного аппарата и нажмите на него чтобы выполнить действие.</P>
            <P>При наведении объект будет подсвечен и появится подсказка рядом с курсором, показывающая, что произойдет при нажатии.</P>
            <P>Некоторые элементы можно перемещать после нажатия. Для того чтобы отпустить их, нажмите еще раз в любое место.</P>
            <P>В верхнем левом углу отображается, какое действие нужно совершить дальше.</P>
            <P>Если при нажатии на объект ничего не происходит, значит это действие сейчас нельзя совершить.</P>
            <H3>Управление камерой</H3>
            <P>
                Для вращения, зажмите левую кнопку мыши и перемещайте курсор.<br/>
                Для перемещения, зажмите правую кнопку мыши и перемещайте курсор.<br/>
                Чтобы приблизить/отдалить, используйте колёсико мыши.
            </P>
            <div style={{margin: "8px"}}></div>
            <a
                target="_blank"
                href="./assets/FUJIKURA_FSM-30S_user_guide.pdf"
                style={{
                    alignSelf: "flex-start",
                }}
            >
                Руководство по эксплуатации Fujikura FSM-30S
            </a>
            <div style={{margin: "8px"}}></div>
            <button
                className="blue-button"
                id="hide-help-button"
                onClick={goNext}
            >
                Продолжить
            </button>
        </section>
    );
}

function H1(props) {
    return <h1 style={{margin: "16px 0px"}}>{props.children}</h1>;
}

function H3(props) {
    return <h3 style={{margin: "16px 0px"}}>{props.children}</h3>;
}

function P(props) {
    return <p style={{width: "100%", margin: "0px 0px"}}>{props.children}</p>;
}
