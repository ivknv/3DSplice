import * as THREE from "three";

/**
 * Контроллер анимации. Реализует методы для управления и отслеживания состояния анимации.
 *
 * @property {string}                state       - Состояние анимации
 * @property {THREE.AnimationClip}   animation   - Анимация
 * @property {THREE.AnimationAction} action      - Экземпляр THREE.AnimationAction
 * @property {function}              onCompleted - Функция, вызываемая после завершения анимации
 * @property {function}              onReset     - Функция, вызываемая после возвразения анимации в исходное состояние
 * */
export default class AnimationActionController {
    /**
     * Создает экземпляр контроллера анимации
     * @param {THREE.AnimationMixer}  mixer      - Экземпляр THREE.AnimationMixer
     * @param {THREE.AnimationClip}   animation  - Анимация
     */
    constructor(mixer, animation) {
        this.state = "initial";
        this.mixer = mixer;
        this.animation = animation;
        this.action = mixer.clipAction(this.animation);
        this.action.clampWhenFinished = true;
        this.action.loop = THREE.LoopOnce;
        this.onCompleted = function() {}
        this.onReset = function() {}
        this.scale = 1;

        this.onAnimationFinished = event => {
            if (event.action !== this.action) return;

            if (this.state == "playing_forward") {
                this.state = "completed";
                this.onCompleted();
            } else if (this.state == "playing_back") {
                this.state = "initial";
                this.onReset();
            }
        };

        mixer.addEventListener("finished", this.onAnimationFinished);
    }

    /**
     * Удаляет все обработчики событий.
     */
    dispose() {
        this.mixer.removeEventListener("finished", this.onAnimationFinished);
    }

    /**
     * Создает контроллер по имени анимации
     * @param {THREE.AnimationClip[]} animations - Набор анимаций
     * @param {THREE.AnimationMixer}  mixer      - Экземпляр THREE.AnimationMixer
     * @param {string}                name       - Имя анимации
     * @return {AnimationActionController} контроллер анимации */
    static fromAnimationName(animations, mixer, name) {
        const animation = THREE.AnimationClip.findByName(animations, name);

        return new AnimationActionController(mixer, animation);
    }

    /**
     * Включает анимацию в прямом/обратном направлении (меняет на противоположное)
     * */
    toggle() {
        if (this.canPlayForward()) {
            this.playForward();
        } else {
            this.playBack();
        }
    }

    /**
     * Возвращает, можно ли воспроивести анимацию в прямом направлении
     * @return {boolean}
     */
    canPlayForward() {
        return this.state == "initial" || this.state == "playing_back";
    }

    /**
     * Возвращает, можно ли воспроивести анимацию в обратном направлении
     * @return {boolean}
     */
    canPlayBack() {
        return this.state != "initial" || this.state == "playing_forward";
    }

    /** Включает анимацию в прямом направлении, если это возможно */
    playForward() {
        if (this.canPlayForward()) {
            this.action.timeScale = 1 * this.scale;

            if (this.state != "playing_back") this.action.reset();

            this.state = "playing_forward";
            this.action.play();
        }
    }

    /** Включает анимацию в обратном направлении, если это возможно */
    playBack() {
        if (this.canPlayBack()) {
            this.action.timeScale = -1 * this.scale;

            if (this.state == "completed") {
                this.action.reset();
                this.action.time = this.animation.duration;
            }

            this.state = "playing_back";
            this.action.play();
        }
    }
}
