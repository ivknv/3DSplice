import InteractiveElement from "./InteractiveElement";
import AnimationActionController from "./AnimationActionController";

/**
 * Интерактивный элемент с анимацией при нажатии.
 * При каждом нажатии направление анимации меняется на противоположное.
 *
 * @property {AnimationActionController} animationActionController - Контроллер анимаций
 * @property {string}                    animationState - Текущее состояние анимации (animationActionController.state)
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
    }

    /**
     * Текущее состояние анимации (animationActionController.state)
     * @return {string} значение animationActionController.state */
    get animationState() {
        return this.animationActionController.state;
    }

    /**
     * Проверяет, можно ли запускать анимацию
     * @return {boolean} true, если можно, false, если нельзя */
    checkDependencies() {
        return true;
    }

    onClick(event) {
        if (this.checkDependencies()) {
            this.animationActionController.toggle();
        }
    }
};
