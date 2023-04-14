import InteractiveElement from "./InteractiveElement";
import Application from "./Application";
import AnimationActionController from "./AnimationActionController";

/**
 * Анимированный интерактивный элемент сварочного аппарата.
 * Переопределяет метод checkDependencies() - проверяет, чтобы все элементы-зависимости
 * были в требуемом состоянии анимации.
 * При каждом нажатии направление анимации меняется на противоположное.
 *
 * @property {AnimationActionController} animationActionController - Контроллер анимаций
 * @property {string}                    animationState - Текущее состояние анимации (animationActionController.state)
 * @property {object} dependencies - ключ - имя элемента, значение - состояние
 */
export default class AnimatedSplicerElement extends InteractiveElement {
    /**
     * Создает экземпляр AnimatedSplicerElement
     * @param {THREE.Object3D}        model         - 3D-модель
     * @param {THREE.AnimationClip[]} animations    - набор анимаций
     * @param {THREE.AnimationMixer}  mixer         - Экземпляр THREE.AnimationMixer
     * @param {string[]}              objectNames   - Список имен 3D-объектов
     * @param {string}                animationName - Имя анимации
     */
    constructor(model, animations, mixer, objectNames, animationName) {
        super(model, objectNames);

        this.animationActionController = AnimationActionController.fromAnimationName(
            animations, mixer, animationName);

        this.dependencies = {};
    }

    /**
     * Проверяет, можно ли запускать анимацию
     * @return {boolean} true, если можно, false, если нельзя
     */
    checkDependencies() {
        for (const dependency in this.dependencies) {
            const state = Application.splicer.children[dependency].animationState;
            if (state != this.dependencies[dependency]) return false;
        }

        return true;
    }

    /**
     * Текущее состояние анимации (animationActionController.state)
     * @return {string} значение animationActionController.state */
    get animationState() {
        return this.animationActionController.state;
    }

    onClick() {
        if (this.checkDependencies()) {
            this.animationActionController.toggle();
        }
    }
};
