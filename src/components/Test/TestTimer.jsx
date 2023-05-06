import React, {useRef, useState, useEffect} from "react";

export default function TestTimer(props) {
    const [remaining, setRemaining] = useState(props.time);
    const intervalId = useRef(null);

    useEffect(() => {
        intervalId.current = setInterval(() => {
            setRemaining(x => {
                if (x <= 0) {
                    if (props.onExpire) props.onExpire();
                    return 0;
                }

                return x - 1}
            );
        }, 1000);

        return () => clearInterval(intervalId.current);
    }, []);

    return (
        <span className="test-timer">
            Оставшееся время: {remaining} c.
        </span>
    );
}
