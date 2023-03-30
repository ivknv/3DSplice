import * as THREE from "three";
import InteractiveElement from "./InteractiveElement";
import AnimationActionController from "./AnimationActionController";
import Application from "./Application";
import {clamp} from "./common";
import * as Colors from "./colors";

export default class SpliceProtectionCase extends InteractiveElement {
    constructor(model) {
        super(model, ["Cube", "Cylinder001"]);

        this.originalPosition = new THREE.Vector3();
        this.mouseDownPoint = new THREE.Vector3();
        this.held = false;
        this.raycaster = new THREE.Raycaster();
        this.delta = 0;

        const plasticCase = this.model.getObjectByName("Cube");
        this.metalRod = this.model.getObjectByName("Cylinder001");

        this.mixer = new THREE.AnimationMixer(plasticCase);
        this.keyframes = new THREE.VectorKeyframeTrack(
            ".scale", [0, 15], [1, 1, 1, 5/6, 2/3, 2/3], THREE.InterpolateSmooth);
        this.animationClip = new THREE.AnimationClip("Shrink", 15, [this.keyframes]);
        this.animationActionController = new AnimationActionController(this.mixer, this.animationClip);

        this.tooltip = "Переместить гильзу КДЗС";

        this.animationActionController.onCompleted = () => {
            Application.state.onHeatingCompleted();
        };
    }

    setPosition(x, y, z) {
        this.model.position.set(x, y, z);
        this.originalPosition.set(x, y, z);
    }

    isCentered() {
        return Math.abs(this.model.position.x) < 0.005;
    }

    checkPlacement() {
        Application.spliceProtectionPlaced = this.isCentered();
    }

    onClick(event) {
        if (!this.held) {
            if (!Application.state.canPlaceSpliceProtection()) return;

            this.highlightColor = Colors.HIGHLIGHT_ACTIVE;

            Application.mouseHandler.setHoverFilter(element => {
                return element === this;
            });

            this.originalPosition.copy(this.model.position);

            this.mouseDownPoint = this.projectMouseOntoModel(
                Application.mouseHandler.mouseDownPosition, Application.camera);
        } else {
            this.highlightColor = Colors.HIGHLIGHT;
            Application.mouseHandler.resetHoverFilter();
            this.checkPlacement();
        }

        this.held = !this.held;
    }

    projectMouseOntoModel(mousePosition, camera) {
        this.raycaster.setFromCamera(mousePosition, camera);

        const projected = this.raycaster.ray.origin.clone();

        const distToPlane = this.model.position.y - this.raycaster.ray.origin.y;
        const t = distToPlane / this.raycaster.ray.direction.y;
        const offset = this.raycaster.ray.direction.clone().multiplyScalar(t);

        projected.add(offset);

        return projected;
    }

    updateRotation() {
        const x = -this.delta - (this.originalPosition.x - Application.rightFiber.model.position.x);
        const maxX = Application.state === "initial" ?
            -Application.rightFiber.getTipPosition().x + Application.rightFiber.model.position.x - 0.03 :
            -Application.rightFiber.getTipPosition().x + Application.rightFiber.model.position.x + 0.1;
        const minX = 0.07;
        const newPosition = new THREE.Vector3(0, clamp(x, minX, maxX, 0));
        newPosition.applyAxisAngle(new THREE.Vector3(0, 0, 1), Application.rightFiber.model.rotation.z);
        this.model.rotation.z = -Math.PI * 0.5 + Application.rightFiber.model.rotation.z;
        this.model.position.x = newPosition.x + Application.rightFiber.model.position.x;
        this.model.position.y = newPosition.y + 0.001 + Application.rightFiber.model.position.y;
        this.model.position.z = newPosition.z + Application.rightFiber.model.position.z;
    }

    update() {
        this.mixer.update(Application.clockDelta);
        const scale = (5/6) / this.model.scale.x;
        this.metalRod.scale.x = scale;
        this.metalRod.scale.y = scale;
        this.metalRod.scale.z = scale;
        if (!this.held) {
            this.updateRotation();
            return;
        }

        const projected = this.projectMouseOntoModel(
            Application.mouseHandler.position, Application.camera);

        this.delta = projected.x - this.mouseDownPoint.x;
        this.updateRotation();
    }

    onFocusLoss() {
        this.highlightColor = Colors.HIGHLIGHT;
        Application.mouseHandler.resetHoverFilter();
        this.checkPlacement();
        this.held = false;
    }

    shrink() {
        this.animationActionController.playForward();
    }
}
