import Application from "./Application";
import * as Colors from "./colors";

/**
 * Интерактивный элемент.Представляет собой набор 3D-объектов, с которыми
 * может взаимодейстовать пользователь.
 * @property {THREE.Object3D}  model    - 3D-модель
 * @property {object}          objects  - 3D-объекты (отдельные составляющие модели)
 * @property {object}          children - Дочерние интерактивные элементы
 * @property {boolean}         active   - Позволяет деактивировать элемент
 * @property {string}          tooltip  - Текст подсказки, который показывается при наведении на элемент
 * @property {(number|string)} highlightColor - Цвет подсветки элемента
 * */
export default class InteractiveElement {
    /**
     * Создает экземпляр интерактивного элемента
     * @param {THREE.Object3D} model       - 3D-модель
     * @param {string[]}       objectNames - Список объектов (имен), являющихся частью данного элемента
     */
    constructor(model, objectNames) {
        this.active = true;
        this.objects = {};
        this._originalMaterials = {};
        this.children = {};
        this.model = model;
        this.tooltip = "";

        this._highlightColor = Colors.HIGHLIGHT;

        for (const name of objectNames) {
            const objects = model.getObjectsByProperty("name", name);

            for (const object of objects) {
                this.objects[object.uuid] = object;
            }
        }
    }

    /**
     * Цвет подсветки элемента
     * @return {(number|string)} значение свойства
     */
    get highlightColor() {
        return this._highlightColor;
    }

    /** Задает цвет подсветки элемента */
    set highlightColor(value) {
        this._highlightColor = value;
        this.updateHighlightColor();
    }

    updateHighlightColor() {
        for (const uuid in this.objects) {
            // Skip if already highlighted
            if (!this.isObjectHighlighted(uuid)) continue;

            const obj = this.objects[uuid];
            obj.material.color.set(this.highlightColor);
        }
    }

    isObjectHighlighted(uuid) {
        return uuid in this._originalMaterials;
    }

    isHighlighted() {
        for (const uuid in this.objects) {
            if (this.isObjectHighlighted()) return true;
        }

        return false;
    }

    /** Подсветить интерактивный элемент */
    highlight() {
        for (const uuid in this.objects) {
            // Skip if already highlighted
            if (this.isObjectHighlighted(uuid)) continue;

            const obj = this.objects[uuid];

            this._originalMaterials[uuid] = obj.material;
            obj.material = obj.material.clone();
            obj.material.metalness = 0.0;
            obj.material.roughness = 1.0;
            obj.material.color.set(this.highlightColor);
        }
    }

    /** Убрать подсветку интерактивного элемента */
    clearHighlight() {
        for (const uuid in this.objects) {
            // Skip if not highlighted
            if (!this.isObjectHighlighted(uuid)) continue;

            const obj = this.objects[uuid];
            const highlightMaterial = obj.material;
            obj.material = this._originalMaterials[uuid];

            delete this._originalMaterials[uuid];
            highlightMaterial.dispose();
        }
    }

    /**
     * Вызывается при нажатии на интерактивный элемент
     * @param {Event} event - объект события mousedown
     */
    onClick(event) {}

    /**
     * Вызывается при нажатии мимо интерактивного элемента, если он до этого был выбран
     */
    onFocusLoss() {}

    /** Обновить состояние интерактивного элемента */
    update() {
        for (const elementName in this.children) {
            this.children[elementName].update();
        }
    }

    /**
     * Находит дочерний элемент по предикату
     * @param {function} predicate - предикат, должен принимать 1 параметр (элемент) и возвращать boolean
     * @return {(InteractiveElement|null)} первый найденный элемент или null (если не найден)
     */
    findElement(predicate) {
        for (const elementName in this.children) {
            let element = this.children[elementName];
            if (predicate(element)) return element;

            element = element.findElement(predicate);

            if (element !== null) return element;
        }

        return null;
    }

    /** Добавляет элемент в приложение */
    addToApplication() {
        Application.addElement(this);
        if (this.model) Application.addModel(this.model);
    }

    /** Удаляет элемент в приложение */
    removeFromApplication() {
        if (this.model) Application.removeModel(this.model);
        Application.removeElement(this);
    }
}
