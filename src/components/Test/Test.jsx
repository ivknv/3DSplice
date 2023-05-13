import React, {useEffect, useRef, useState} from "react";
import {useHideOnTransition} from "../../common";
import {shuffleArray} from "../../common";
import _questions from "./TestQuestions";
import TestForm from "./TestForm";
import Questions from "./Questions";
import TestResults from "./TestResults";

function prepareQuestions() {
    const questions = _questions.map(q => {
        const newQuestion = new Object();
        Object.assign(newQuestion, q)

        newQuestion.answer = newQuestion.answer.map(index => q.options[index]);
        newQuestion.answer.sort();

        newQuestion.options = Array.from(q.options);
        shuffleArray(newQuestion.options);

        return newQuestion;
    });

    shuffleArray(questions);

    return questions;
}

export default function Test({visible = true}) {
    const [testFinished, setTestFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [nameEntered, setNameEntered] = useState(false);
    const identity = useRef(new Object());
    const answers = new Map();

    const section = useRef(null);
    const [display, setDisplay] = useState(visible ? "flex" : "none");

    useHideOnTransition(
        () => section.current,
        () => setDisplay("none"),
        () => setDisplay("flex"));

    useEffect(() => {
        if (visible) setDisplay("flex");
    }, [visible]);

    const questions = useRef(null);

    const checkAnswers = () => {
        let correctCount = 0;

        answers.forEach((value, key) => {
            const question = questions.current[key];
            if (value.every((x, i) => x === question.answer[i])) {
                correctCount++;
            }
        });

        return correctCount / questions.current.length;
    };

    const startedTime = useRef(0);
    const finishedTime = useRef(0);

    const startTest = () => {
        setTestFinished(false);
        setScore(0);
        setNameEntered(true);
        startedTime.current = Date.now();

        questions.current = prepareQuestions();
    };

    const restartTest = () => {
        setTestFinished(false);
        setNameEntered(false);
    }

    const finishTest = () => {
        setScore(checkAnswers());
        setTestFinished(true);
        finishedTime.current = Date.now();
    };

    return (
        <section
            id="test"
            style={{
                display: display,
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px"
            }}
            ref={section}
        >
            <h1>Тест по сварочному аппарату Fujikura FSM-30S</h1>
            {(() => {
                if (!testFinished) {
                    if (!nameEntered) {
                        return (
                            <TestForm
                                identity={identity.current}
                                onSubmitted={startTest}
                            />
                        );
                    } else {
                        return (
                            <Questions
                                questions={questions.current}
                                answerStore={answers}
                                onFinished={finishTest}
                            />
                        );
                    }
                } else {
                    return (
                        <TestResults
                            onStarted={restartTest}
                            onTamper={restartTest}
                            score={score}
                            identity={identity.current}
                            time={Math.round((finishedTime.current - startedTime.current) / 1000)}
                        />
                    );
                }
            })()}
        </section>
    );
}
