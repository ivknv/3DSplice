import Application from "./Application";

async function main() {
    const application = new Application();

    document.querySelector("#main").appendChild(application.renderer.domElement);
    document.querySelector("#main").appendChild(application.stats.domElement);
    await application.initialize();

    application.renderer.domElement.style.position = "absolute";
    application.renderer.domElement.style.zIndex = "1";

    application.animate();
}

main();
