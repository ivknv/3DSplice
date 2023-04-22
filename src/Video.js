import * as THREE from "three";

/**
 * Класс для работы с HTML-элементом video.
 *
 * @property {HTMLVideoElement} domElement - HTML-элемент video
 * @property {THREE.VideoTexture} texture - текстура Three.js
 */
export default class Video {
    /**
     * Создает экземпляр Video.
     *
     * @param {string} source - Источник видео (аттрибут src video)
     */
    constructor(source) {
        this.domElement = document.createElement("video");
        this.domElement.muted = true;
        this.domElement.style.display = "none";
        this.domElement.src = source;
        this.texture = new THREE.VideoTexture(this.domElement);
        this.texture.flipY = false;
    }

    /**
     * Воспроизводит видео.
     * @return {Promise<void>}
     */
    play() {
        return this.domElement.play();
    }

    /* Ставит видео на паузу. */
    pause() {
        this.domElement.pause();
    }

    /**
     * Устанавливает текущий момент видео в time.
     * @param {number} time - момент времени
     */
    seek(time) {
        this.domElement.currentTime = time;
    }
}
