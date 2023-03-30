import Application from "./Application";

async function main() {
    document.querySelector("#main").appendChild(Application.renderer.domElement);
    document.querySelector("#main").appendChild(Application.stats.domElement);

    await Application.initialize();

    Application.animate();
}

main();
