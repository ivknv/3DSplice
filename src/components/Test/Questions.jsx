import React, {useRef} from "react";
import FinishTestButton from "./FinishTestButton";
import TestTimer from "./TestTimer";

function Question(props) {
    const question = useRef(null);

    const onPick = () => {
        const labels = Object.values(question.current.querySelectorAll("label"));
        const answer = labels.filter(x => x.querySelector("input").checked).map(x => x.innerText);
        answer.sort();

        if (props.onPick) props.onPick(answer);
    };

    return (
        <section className="test-card question" ref={question}>
            <h3>{props.question}</h3>
            {props.figure &&
                <img
                    src={props.figure}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        alignSelf: "center",
                        marginTop: "8px",
                        marginBottom: "8px"
                    }}
                />
            }

            {props.options.map(option => {
                return (
                    <div key={option}>
                        <label>
                            <input
                                name={props.name}
                                type={
                                    props.type === "single_choice"
                                        ? "radio"
                                        : "checkbox"
                                }
                                onChange={onPick}
                            />
                            {option}
                        </label>
                    </div>
                );
            })}
        </section>
    );
}

export default function Questions(props) {
    return (
        <>
            {props.questions.map((q, index) => {
                return (
                    <Question
                        key={`question${index}`}
                        name={`q${index}`}
                        question={q.question}
                        options={q.options}
                        figure={q.figure}
                        type={q.type}
                        onPick={answer => {
                            if (props.answerStore) props.answerStore.set(index, answer);
                        }}
                    />
                );
            })}
            <FinishTestButton onFinished={props.onFinished} />
            <TestTimer time={900} onExpire={props.onFinished} />
        </>
    );
}
