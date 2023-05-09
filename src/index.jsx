import ReactDOM from "react-dom/client";
import React from "react";

import "./style.css";
import "./fonts/OpenSans-Regular.ttf";
import App from "./App"

function main() {
    document.addEventListener("DOMContentLoaded", () => {
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(<App/>);
    });
}

main();
