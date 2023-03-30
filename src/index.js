import Application from "./Application";

async function main() {
    document.querySelector("#main").appendChild(Application.renderer.domElement);
    document.querySelector("#main").appendChild(Application.stats.domElement);
    await Application.initialize();

    Application.stats.domElement.style.right = "0px";
    Application.stats.domElement.style.removeProperty("left");

    Application.renderer.domElement.style.position = "absolute";
    Application.renderer.domElement.style.zIndex = "1";

    Application.animate();
}

main();
