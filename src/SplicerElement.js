export default class SplicerElement {
    constructor(splicer, objectNames) {
        this.objects = {};
        this._originalMaterials = {};

        for (const name of objectNames) {
            this.objects[name] = splicer.model.getObjectByName(name);
        }
    }

    highlight() {
        for (const name in this.objects) {
            // Skip if already highlighted
            if (name in this._originalMaterials) continue;

            const obj = this.objects[name];

            this._originalMaterials[name] = obj.material;
            obj.material = obj.material.clone();
            obj.material.metalness = 0.0;
            obj.material.roughness = 1.0;
            obj.material.color.set(0xc14919);
        }
    }

    clearHighlight() {
        for (const name in this.objects) {
            // Skip if not highlighted
            if (!(name in this._originalMaterials)) continue;

            const obj = this.objects[name];
            const highlightMaterial = obj.material;
            obj.material = this._originalMaterials[name];

            delete this._originalMaterials[name];
            highlightMaterial.dispose();
        }
    }

    onClick(splicer, event) {
        return;
    }
}
