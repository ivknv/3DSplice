import Application from "./Application";
import "./style.css";
import "./fonts/OpenSans-Regular.ttf";

async function main() {
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector("#main").appendChild(Application.domElement);

        Application.initialize().then(function() {
            Application.animate();
        });
    });
}

main();
