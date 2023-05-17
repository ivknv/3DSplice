import React, {useEffect, useRef} from "react";
import StartTestButton from "./StartTestButton";

export default function TestResults(props) {
    const results = useRef(null);
    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (props.onTamper) props.onTamper();
        });

        observer.observe(results.current, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="test-card test-results" ref={results}>
            <h3>Результат:&nbsp;
                <span style={{color: scoreToColor(props.score)}}>
                    {Math.round(props.score * 100)}%
                </span>
            </h3>
            <h3>
                Оценка:&nbsp;
                <span style={{color: scoreToColor(props.score)}}>
                    {scoreToGrade(props.score)}
                </span>
            </h3>
            <div style={{marginTop: "8px"}}>
                Студент: {props.identity.lastName} {props.identity.firstName}
            </div>
            <div>Группа: {props.identity.group}</div>
            <div>Время прохождения: {props.time} с.</div>
            <StartTestButton
                onClick={props.onStarted}
                style={{alignSelf: "center", marginTop: "16px"}}
            />
        </section>
    );
}

function scoreToGrade(score) {
    return Math.max(2, Math.round(score * 5));
}

function scoreToColor(score) {
    if (score < 0.5) return "red";
    if (score < 0.65) return "orange";
    return "green";
}
