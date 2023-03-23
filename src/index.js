import Application from "./Application";

async function main() {
    const application = new Application();

    document.body.appendChild(application.renderer.domElement);
    await application.initialize();

    application.animate();
}

main();
