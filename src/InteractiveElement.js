import Application from "./Application";

export default class InteractiveElement {
    constructor(model, objectNames) {
        this.active = true;
        this.objects = {};
        this._originalMaterials = {};
        this.children = {};
        this.model = model;
        this.tooltip = "";

        for (const name of objectNames) {
            const objects = model.getObjectsByProperty("name", name);

            for (const object of objects) {
                this.objects[object.uuid] = object;
            }
        }
    }

    highlight() {
        for (const uuid in this.objects) {
            // Skip if already highlighted
            if (uuid in this._originalMaterials) continue;

            const obj = this.objects[uuid];

            this._originalMaterials[uuid] = obj.material;
            obj.material = obj.material.clone();
            obj.material.metalness = 0.0;
            obj.material.roughness = 1.0;
            obj.material.color.set(0xc14919);
        }
    }

    clearHighlight() {
        for (const uuid in this.objects) {
            // Skip if not highlighted
            if (!(uuid in this._originalMaterials)) continue;

            const obj = this.objects[uuid];
            const highlightMaterial = obj.material;
            obj.material = this._originalMaterials[uuid];

            delete this._originalMaterials[uuid];
            highlightMaterial.dispose();
        }
    }

    onClick(event) {}
    onFocusLoss() {}

    update() {
        for (const elementName in this.children) {
            this.children[elementName].update(Application);
        }
    }

    findElement(predicate) {
        for (const elementName in this.children) {
            let element = this.children[elementName];
            if (predicate(element)) return element;

            element = element.findElement(predicate);

            if (element !== null) return element;
        }

        return null;
    }

    addToApplication() {
        Application.addElement(this);
        if (this.model) Application.addModel(this.model);
    }

    removeFromApplication() {
        if (this.model) Application.removeModel(this.model);
        Application.removeElement(this);
    }
}
