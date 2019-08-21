import css from './slider.styl';
import template from './slider.pug';
import anime from 'animejs';

class Slider {
    constructor (params) {
        this._slides = params.slides;
        this._options = params.options;
        this._step = params.options.slidesVisible - 1;
        this.render();
        this._elem.addEventListener('click', this);
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({
            slideWidth: 100 / this._options.slidesVisible + '%',
            slidesVisible: this._options.slidesVisible,
            slides: this._slides
        });
        this._elem = tmp.firstElementChild;
        this._slidesElem = this._elem.querySelector('.cSlider__slides');
    }
    handleEvent (event) {
        let target = event.target;
        let parent = target.parentNode;

        if (target.classList.contains('cSlider__leftArrow') ||
            parent.classList.contains('cSlider__leftArrow')
        ) {
            if (target.classList.contains('disabled') || parent.classList.contains('disabled')) {
                return false;
            }
            this.handleLeftArrowClick();
        } else if (
            target.classList.contains('cSlider__rightArrow') ||
            parent.classList.contains('cSlider__rightArrow')
        ) {
            if (target.classList.contains('disabled') || parent.classList.contains('disabled')) {
                return false;
            }
            this.handleRightArrowClick();
        } else if (
            target.classList.contains('cSlider__slide') ||
            parent.classList.contains('cSlider__slide')
        ) {
            let type = target.dataset.type ? target.dataset.type : parent.dataset.type;
            this.handleSlideCkick(type)
        }

    }
    getElem () {
        return this._elem;
    }
    handleLeftArrowClick () {
        // Получаем ширину слайда в пикселях
        this._slideWidth = this.getSlidePixelWidth();

        // Изменяем ширину контейнера слайдов
        this._slidesElem.style.width = this._slideWidth * (this._options.slidesVisible + 1) + 'px';

        // Прокручиваем слайды влево за границу экрана
        this._slidesElem.style.marginLeft = - this._slideWidth + 'px';

        // Вычисляем новый step
        this._step = this._step === 0 ? this._slides.length - 1 : this._step - 1;

        // Получаем ссылку на нужный слайд
        let slideIndex;
        let diff = this._step + 1 - this._options.slidesVisible;
        if (diff < 0) {
            slideIndex = this._slides.length - Math.abs(diff);
        } else {
            slideIndex = this._step + 1 - this._options.slidesVisible;
        }
        let slide = this._slides[slideIndex];

        // Добавляем слайд
        let newSlide = document.createElement('div');
        newSlide.dataset.type = slide.nameEng;
        newSlide.classList.add('cSlider__slide');
        newSlide.title = slide.nameRus;
        let newImg = document.createElement('img');
        newImg.src = slide.src;
        newSlide.append(newImg);

        let beforeSlide = this._slidesElem.firstElementChild;
        this._slidesElem.insertBefore(newSlide, beforeSlide);

        // Устанавливаем ширину слайдов
        this.setSlidesWidth();

        // Анимируем прокрутку вправо
        let slidePromise = anime({
            targets: this._slidesElem,
            delay: 0,
            duration: 300,
            easing: 'linear',
            marginLeft: 0
        });

        // Удаляет последний элемент
        slidePromise.finished.then(()=>{
            this._slidesElem.lastElementChild.remove();
        });
    }
    handleRightArrowClick () {
        // Получаем ширину слайда в пикселях
        this._slideWidth = this.getSlidePixelWidth();
        // Изменяем ширину контейнера слайдов
        this._slidesElem.style.width = this._slideWidth * (this._options.slidesVisible + 1) + 'px';
        // Вычисляем новый step
        this._step = this._step === this._slides.length - 1 ? 0 : this._step + 1;
        // Добавляем слайд в конец списка
        let newSlide = document.createElement('div');
        newSlide.dataset.type = this._slides[this._step].nameEng;
        newSlide.classList.add('cSlider__slide');
        newSlide.title = this._slides[this._step].nameRus;
        let newImg = document.createElement('img');
        newImg.src = this._slides[this._step].src;
        newSlide.append(newImg);
        this._slidesElem.append(newSlide);

        // Устанавливаем ширину слайдов
        this.setSlidesWidth();

        // Анимируем прокрутку вправо
        let slidePromise = anime({
            targets: this._slidesElem,
            delay: 0,
            duration: 300,
            easing: 'linear',
            marginLeft: - this._slideWidth
        });

        slidePromise.finished.then(()=>{
            this._slidesElem.querySelector('.cSlider__slide').remove();
            this._slidesElem.style.marginLeft = 0;
        });
    }
    handleSlideCkick (type) {
        this._elem.dispatchEvent(new CustomEvent(this._options.slideClickEventName, {
            bubbles: true,
            detail: {type: type}
        }))
    }
    getSlidePixelWidth () {
        let elem = this._slidesElem.firstElementChild;
        return parseFloat(getComputedStyle(elem, null).width);
    }
    setSlidesWidth () {
        let elems = this._slidesElem.querySelectorAll('.cSlider__slide');
        for (let elem of elems) {
            elem.style.flexBasis = this._slideWidth + 'px';
        }
    }
}

export {Slider}
