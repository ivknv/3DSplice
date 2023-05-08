import React, {useState, useRef, useMemo, createContext, useContext, useEffect} from "react";
import SplashScreen from "./components/SplashScreen";
import Help from "./components/Help";
import HelpButton from "./components/HelpButton";
import Theory from "./components/Theory";
import Facade from "./components/Facade";
import Simulator from "./components/Simulator";
import Test from "./components/Test";

const AppContext = createContext(null);

export function useApp() {
    return useContext(AppContext);
}

/**
 * Данная функция извлекает параметры из URL вида #param1:value1;param2:value2
 * @return {Map} ключ - имя параметра, значение - значение параметра
 */
function parseURLHashParameters() {
    const q = window.location.hash.substring(1);
    const keyValuePairs = q.split(";");

    const parameters = new Map();

    for (const keyValuePair of keyValuePairs) {
        const [key, value] = keyValuePair.split(":");
        parameters.set(key, value);
    }

    return parameters;
}

export default function App() {
    const [facadeVisible, setFacadeVisible] = useState(true);
    const [theoryVisible, setTheoryVisible] = useState(false);
    const [splashScreenVisible, setSplashScreenVisible] = useState(true);
    const [helpButtonVisible, setHelpButtonVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState(false);
    const [testVisible, setTestVisible] = useState(false);

    const context = useRef(null);
    const main = useRef(null);

    useMemo(() => {
        context.current = {
            state: null,
            leftFiberPlaced: false,
            rightFiberPlaced: false,
            get fibersPlaced() {
                return this.leftFiberPlaced && this.rightFiberPlaced;
            },
            states: new Object(),
            setState: stateName => {
                if (context.current.state) {
                    console.log(`Changing state: ${context.current.state.name} -> ${stateName}`);
                }

                context.current.state = context.current.states[stateName];

                console.assert(context.current.state !== undefined, `Application state (${stateName}) is undefined`);
            }
        };

        blockMediaSessionActions();
    }, []);

    return (
        <AppContext.Provider value={context.current}>
            <section id="main" style={{display: "none"}} ref={main}>
                <Facade visible={facadeVisible}/>
                <Simulator
                    hashParameters={parseURLHashParameters()}
                    startTest={() => {
                        setHelpVisible(false);
                        setHelpButtonVisible(false);
                        setFacadeVisible(true);
                        setTestVisible(true);
                    }}
                />
                <SplashScreen
                    visible={splashScreenVisible}
                    goNext={() => {
                        setSplashScreenVisible(false);
                        setTheoryVisible(true);
                    }}
                />
                <Help
                    visible={helpVisible}
                    goNext={() => {
                        setHelpVisible(false);
                        setFacadeVisible(false);
                        setHelpButtonVisible(true);
                    }}
                />
                <Theory
                    visible={theoryVisible}
                    goNext={() => {
                        setTheoryVisible(false);
                        setFacadeVisible(false);
                        setHelpButtonVisible(true);
                    }}
                />
                <Test visible={testVisible} />
                <HelpButton
                    visible={helpButtonVisible}
                    onClick={() => {
                        setHelpButtonVisible(false);
                        setHelpVisible(true);
                        setFacadeVisible(true);
                    }}
                />
            </section>
        </AppContext.Provider>
    );
}

function blockMediaSessionActions() {
    const actions = [
        "play", "pause", "stop", "seekbackward", "seekforward", "seekto",
        "nexttrack", "previoustrack"
    ];

    const handler = () => {};

    for (const action of actions) {
        navigator.mediaSession.setActionHandler(action, handler)
    }
}
