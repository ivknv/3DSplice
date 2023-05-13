import React, {useEffect, useRef, useState} from "react";
import {useHideOnTransition} from "../common";

export default function Help({visible = true, goNext}) {
    const section = useRef(null);
    const [display, setDisplay] = useState(visible ? "block" : "none");
    
    useEffect(() => {
        if (visible) setDisplay("block");
    }, [visible]);

    useHideOnTransition(
        () => section.current,
        () => setDisplay("none"),
        () => setDisplay("block"));

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
            <h1>Как пользоваться?</h1>
            <h3>Взаимодействие с 3D-объектами</h3>
            <p>Наведите на нужный элемент сварочного аппарата и нажмите на него чтобы выполнить действие.</p>
            <p>При наведении объект будет подсвечен и появится подсказка рядом с курсором, показывающая, что произойдет при нажатии.</p>
            <p>Некоторые элементы можно перемещать после нажатия. Для того чтобы отпустить их, нажмите еще раз в любое место.</p>
            <p>В верхнем левом углу отображается, какое действие нужно совершить дальше.</p>
            <p>Если при нажатии на объект ничего не происходит, значит это действие сейчас нельзя совершить.</p>
            <h3>Управление камерой</h3>
            <p>
                Для вращения, зажмите левую кнопку мыши и перемещайте курсор.<br/>
                Для перемещения, зажмите правую кнопку мыши и перемещайте курсор.<br/>
                Чтобы приблизить/отдалить, используйте колёсико мыши.
            </p>
            <button
                className="blue-button blue-button-centered"
                id="hide-help-button"
                onClick={goNext}
            >
                Продолжить
            </button>
        </section>
    );
}
