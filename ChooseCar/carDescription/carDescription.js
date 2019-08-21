import css from './carDescription.styl';
import template from './carDescription.pug';
import {Slider} from '../../Slider/Slider';

class CarDescription {
    constructor (params) {
        this.cars = params.cars;
        this.designOptions = params.designOptions;
        this.suitableCars = params.suitableCars;
        this.suitableCarNumber = params.suitableCarNumber;
        this.slider = new Slider({
            slides: this.getSlides(),
            options: {
                slidesVisible: 4
            }
        });
        this.render();

    }
    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({
            designOptions: this.designOptions,
            car: this.suitableCars[this.suitableCarNumber],
            carsLenth: this.suitableCars.length
        });
        this.elem = tmp.firstElementChild;
        if (this.suitableCars.length > 1) {
            this.renderSlider();
        }
        this.elem.addEventListener('click', this);
    }
    renderSlider () {
        this.slider = new Slider({
            slides: this.getSlides(),
            options: {
                slidesVisible: 4,
                slideClickEventName: 'car-description-slide-click'
            }
        });
        let beforeElem = this.elem.querySelector('.chooseCar__carDescription-params');
        this.elem.insertBefore(this.slider.getElem(), beforeElem);
    }
    updateSuitableCars (params) {
        this.suitableCars = params.suitableCars;
        this.suitableCarNumber = 0;
        this.render();
    }
    handleEvent(event) {
        let target = event.target;

        if (target.classList.contains('chooseCar__carDescription-prev') &&
            !target.classList.contains('disabled')) {
            this.handlePrevCarClick();
        } else if (target.classList.contains('chooseCar__carDescription-next') &&
            !target.classList.contains('disabled')) {
            this.handleNextCarClick();
        } else if (target.classList.contains('chooseCar__carDescription-params-order-btn')) {
            this.handleChooseCarBtnClick();
        }
    }
    handlePrevCarClick () {
        this.suitableCarNumber = this.suitableCarNumber === 0
            ? this.suitableCars.length - 1
            : this.suitableCarNumber - 1;
        this.changeSuitableCar();
    }
    handleNextCarClick () {
        this.suitableCarNumber = this.suitableCarNumber === this.suitableCars.length - 1
            ? 0
            : this.suitableCarNumber + 1;
        this.changeSuitableCar();
    }
    handleChooseCarBtnClick () {
        this.elem.dispatchEvent(new CustomEvent('choose-car-done', {
            bubbles: true,
            detail: {
                carIndex: this.getCarIndex()
            }
        }));
    }
    changeSuitableCar () {
        this.elem.dispatchEvent(new CustomEvent('change-suitable-car', {
            bubbles: true,
            detail: {newNumber: this.suitableCarNumber}
        }));
    }
    getSlides () {
        let slides = [];
        let nowCar = this.suitableCars[this.suitableCarNumber];
        for (let car of this.suitableCars) {
            if (car.name === nowCar.name) {
                continue;
            }
            let slide = {
                nameRus: car.name,
                nameEng: car.engName,
                src: car.photo
            };
            slides.push(slide)
        }
        return slides;
    }
    getElem () {
        return this.elem;
    }
    getCarIndex () {
        for (let i = 0, l = this.cars.length; i < l; i++) {
            if (this.suitableCars[this.suitableCarNumber].engName === this.cars[i].engName) {
                return i;
            }
        }
    }
}

export {CarDescription}