import Application from "./Application";
import "./style.css";
import "./fonts/OpenSans-Regular.ttf";

async function main() {
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector("#main").appendChild(Application.renderer.domElement);
        document.querySelector("#main").appendChild(Application.stats.domElement);

        Application.initialize().then(function() {
            Application.animate();
        });
    });
}

main();
