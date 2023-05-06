import React, {useRef, useState} from "react";
import StartTestButton from "./StartTestButton";

export default function TestForm(props) {
    const div = useRef(null);
    const firstName = useRef(null);
    const lastName = useRef(null);
    const group = useRef(null);
    const [error, setError] = useState("");

    const onClick = () => {
        const inputs = Object.values(div.current.querySelectorAll("input"));
        if (!inputs.every(x => x.value.length > 0)) {
            setError("Введите все данные");
            return;
        }

        setError("");

        if (props.identity) {
            Object.assign(props.identity, {
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                group: group.current.value
            });
        }

        if (props.onSubmitted) props.onSubmitted();
    };

    return (
        <div
            className="test-card"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "16px 24px",
                fontFamily: "OpenSans"
            }}
            ref={div}
        >
            <div>
                <label>Имя:</label><br/>
                <input
                    type="text"
                    placeholder="Ваше имя"
                    defaultValue={props.identity?.firstName}
                    ref={firstName}
                />
            </div>
            <div>
                <label>Фамилия:</label><br/>
                <input
                    type="text"
                    placeholder="Ваша фамилия"
                    defaultValue={props.identity?.lastName}
                    ref={lastName}
                />
            </div>
            <div>
                <label>Группа:</label><br/>
                <input
                    type="text"
                    placeholder="Ваша группа"
                    defaultValue={props.identity?.group}
                    ref={group}
                />
            </div>

            {error && <div style={{color: "red"}}>{error}</div>}

            <StartTestButton
                style={{margin: "auto", marginTop: "12px"}}
                firstTime={true}
                onClick={onClick}
            />
        </div>
    );
}
