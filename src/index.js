import Application from "./Application";

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
