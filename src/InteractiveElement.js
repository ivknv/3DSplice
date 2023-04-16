import Application from "./Application";
import * as Colors from "./colors";

/**
 * Интерактивный элемент. Представляет собой набор 3D-объектов, с которыми
 * может взаимодейстовать пользователь.
 *
 * @property {THREE.Object3D}  model    - 3D-модель
 * @property {Set}             objects  - 3D-объекты (отдельные составляющие модели)
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
        this.objects = new Set();
        this._originalMaterials = new Map();
        this.children = {};
        this.model = model;
        this.tooltip = "";

        this._highlightColor = Colors.HIGHLIGHT;

        for (const name of objectNames) {
            for (const object of model.getObjectsByProperty("name", name)) {
                this.objects.add(object);
            }
        }
    }

    /**
     * Данный метод предназначен для удаления всех обработчиков событий и
     * освобождения ресурсов.
     */
    dispose() {
        for (const child in this.children) {
            this.children[child].dispose();
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
        for (const object of this.objects) {
            // Skip if already highlighted
            if (!this.isObjectHighlighted(object)) continue;

            object.material.color.set(this.highlightColor);
        }
    }

    isObjectHighlighted(object) {
        return this._originalMaterials.has(object);
    }

    isHighlighted() {
        for (const object of this.objects) {
            if (this.isObjectHighlighted(object)) return true;
        }

        return false;
    }

    /** Подсветить интерактивный элемент */
    highlight() {
        for (const object of this.objects) {
            // Skip if already highlighted
            if (this.isObjectHighlighted(object)) continue;

            this._originalMaterials.set(object, object.material);
            object.material = object.material.clone();
            object.material.metalness = 0.0;
            object.material.roughness = 1.0;
            object.material.color.set(this.highlightColor);
        }
    }

    /** Убрать подсветку интерактивного элемента */
    clearHighlight() {
        for (const object of this.objects) {
            // Skip if not highlighted
            if (!this.isObjectHighlighted(object)) continue;

            const highlightMaterial = object.material;
            object.material = this._originalMaterials.get(object);

            this._originalMaterials.delete(object);
            highlightMaterial.dispose();
        }
    }

    /**
     * Вызывается при нажатии на интерактивный элемент
     */
    onClick() {}

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
        if (this.model) Application.scene.add(this.model);
    }

    /** Удаляет элемент в приложение */
    removeFromApplication() {
        if (this.model) Application.scene.remove(this.model);
        Application.removeElement(this);
    }
}
