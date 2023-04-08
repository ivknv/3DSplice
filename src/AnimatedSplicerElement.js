import AnimatedInteractiveElement from "./AnimatedInteractiveElement";
import Application from "./Application";

/**
 * Анимированный интерактивный элемент сварочного аппарата.
 * Переопределяет метод checkDependencies() - проверяет, чтобы все элементы-зависимости
 * были в требуемом состоянии анимации.
 *
 * @property {object} dependencies - ключ - имя элемента, значение - состояние
 */
export default class AnimatedSplicerElement extends AnimatedInteractiveElement {
    /**
     * Создает экземпляр AnimatedSplicerElement
     * @param {THREE.Object3D}        model         - 3D-модель
     * @param {THREE.AnimationClip[]} animations    - набор анимаций
     * @param {THREE.AnimationMixer}  mixer         - Экземпляр THREE.AnimationMixer
     * @param {string[]}              objectNames   - Список имен 3D-объектов
     * @param {string}                animationName - Имя анимации
     */
    constructor(model, animations, mixer, objectNames, animationName) {
        super(model, animations, mixer, objectNames, animationName);

        this.dependencies = {};
    }

    checkDependencies() {
        for (const dependency in this.dependencies) {
            const state = Application.splicer.children[dependency].animationState;
            if (state != this.dependencies[dependency]) return false;
        }

        return true;
    }
};
