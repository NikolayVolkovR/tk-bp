import css from './cars.styl';
import template from './cars.pug';
import anime from 'animejs';

class Cars {
    constructor (params) {
        this.container = params.container;
        this.click_or_touch = params.click_or_touch;
        this.data = params.carsData;
        this.carNumber = params.carNumber;
        this.preloadPhotos();
        this.render();
    }

    /* Загрузить текущее фото, предыдущее и следующее*/
    preloadPhotos () {
        let prevImg = new Image();
        prevImg.src = this.data[this.getPrevCarNumber()].photo;
        let nowImg = new Image();
        nowImg.src = this.data[this.carNumber].photo;
        let nextImg = new Image();
        nextImg.src = this.data[this.getNextCarNumber()].photo;

    }
    render () {
        let tmp = document.createElement('div');
        let car = this.data[this.carNumber];
        tmp.innerHTML = template({
            src: car.photo,
            name: car.name,
            ton: car.ton,
            minHours: car.minHours,
            minOrder: car.minHours * car.hourCost,
            dayPrice: car.hourCost * 8,
            length: car.length,
            width: car.width,
            height: car.height,
            kmCost: car.kmCost,
            hourCost: car.hourCost
        });
        this.photo = tmp.children[0];
        this.params = tmp.children[1];

        this.container.append(this.photo);
        this.container.append(this.params);

        this.enableListeners();
    }

    enableListeners () {
        this.container.addEventListener(this.click_or_touch, this);
    }
    disableListeners () {
        this.container.removeEventListener(this.click_or_touch, this);
    }
    handleEvent (event) {
        let target = event.target;
        if (target.classList.contains('calculator__cars_prev-car') ||
            target.parentNode.classList.contains('calculator__cars_prev-car')) {
            this.goToPrevCar();
        } else if (target.classList.contains('calculator__cars_next-car') ||
            target.parentNode.classList.contains('calculator__cars_next-car')) {
            this.goToNextCar();
        } else if (target.classList.contains('calculator__cars_choose-car-btn') ||
            target.parentNode.classList.contains('calculator__cars_choose-car-btn')) {
            this.params.dispatchEvent(new CustomEvent('calculator-choose-car-btn-click', {bubbles: true}))
        }
    }

    goToPrevCar () {
        this.goToCar(this.getPrevCarNumber());
    }
    goToNextCar () {
        this.goToCar(this.getNextCarNumber());
    }
    goToCar (carNumber) {
        this.container.dispatchEvent(new CustomEvent('car-change', {
            bubbles: true,
            detail: {
                carNumber: carNumber
            }
        }));
        this.carNumber = carNumber;
        this.changePhoto();
        this.changeParams();
        this.preloadPhotos();
    }

    getPrevCarNumber () {
        return this.carNumber === 0 ? this.data.length - 1 : this.carNumber - 1;
    }
    getNextCarNumber () {
        return this.carNumber + 1 < this.data.length ? this.carNumber + 1 : 0;
    }
    changePhoto () {
        this.disableListeners();

        let elem = this.container.querySelector('.calculator__cars_car-photo img');
        let newCar = this.data[this.carNumber];
        let hidePromice = anime({
            targets: elem,
            delay: 0,
            duration: 500,
            easing: 'linear',
            opacity: 0.01
        });

        hidePromice.finished.then(()=>{
            elem.src = newCar.photo;

            let showPromice = anime({
                targets: elem,
                delay: 0,
                duration: 500,
                easing: 'linear',
                opacity: 1
            });

            showPromice.finished.then(()=>{
                this.enableListeners();
            });
        });
    }
    changeParams () {
        let car = this.data[this.carNumber];

        let name = this.container.querySelector('.calculator__cars_params-name');
        this.animateValue({
            elem: name,
            value: `${car.name} <span class="tons">${car.ton} т</span>`
        });

        let minOrderHours = this.container.querySelector('.calculator__cars-min-order-hours');
        this.animateValue({
            elem: minOrderHours,
            value: car.minHours
        });

        let minOrderCost = this.container.querySelector('.calculator__cars-min-order-cost');
        this.animateValue({
            elem: minOrderCost,
            value: car.minHours * car.hourCost
        });

        let dayCost = this.container.querySelector('.calculator__cars-day-cost');
        this.animateValue({
            elem: dayCost,
            value: 8 * car.hourCost
        });

        let length = this.container.querySelector('.calculator__cars-length');
        this.animateValue({
            elem: length,
            value: car.length
        });

        let width = this.container.querySelector('.calculator__cars-width');
        this.animateValue({
            elem: width,
            value: car.width
        });

        let kmCost = this.container.querySelector('.calculator__cars-km-cost');
        this.animateValue({
            elem: kmCost,
            value: car.kmCost
        });

        let hourCost = this.container.querySelector('.calculator__cars-hour-cost');
        this.animateValue({
            elem: hourCost,
            value: car.hourCost
        });
    }
    animateValue(params) {
        let {elem, value} = params;

        let anim = anime({
            targets: elem,
            opacity: 0.01,
            delay: 0,
            duration: 500,
            easing: 'linear',
            complete: () => {
                elem.innerHTML = value;
                anim = anime({
                    targets: elem,
                    opacity: 1,
                    delay: 0,
                    easing: 'linear',
                    duration: 500
                })
            }
        })
    }
    setCars (cars){
        this.data = cars;
    }

}

export {Cars}