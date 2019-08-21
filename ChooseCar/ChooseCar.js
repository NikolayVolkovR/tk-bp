import css from './chooseCar.styl';
import {CarTypes} from './carTypes/carTypes';
import {CarDescription} from './carDescription/carDescription';
import {CargoParams} from './cargoParams/cargoParams';
import {OrderWindow} from "../MakeOrder/OrderWindow"
import anime from 'animejs';

class ChooseCar {
    constructor (params) {
        this.cars = params.cars;
        this.designOptions = params.designOptions
            ? params.designOptions
            : {
                orderButtonColor: '#ccc',
                orderButtonText: 'Заказать_'
            };
        this.demands = this.getDefaultDemands();
        this.suitableCars = this.getSuitableCars();
        this.suitableCarNumber = 0;
        this.carTypes = new CarTypes({
            cars: this.cars,
            demands: this.demands,
            suitableCars: this.suitableCars,
            suitableCarNumber: this.suitableCarNumber
        });
        this.carDescription = new CarDescription({
            cars: this.cars,
            designOptions: this.designOptions,
            suitableCars: this.suitableCars,
            suitableCarNumber: this.suitableCarNumber
        });
        this.cargoParams = new CargoParams({
            cars: this.cars,
            demands: this.demands,
            suitableCars: this.suitableCars,
            suitableCarNumber: this.suitableCarNumber
        });
        this.render();
        this.listen();
    }

    render () {
        this.elem = document.createElement('div');
        this.elem.classList.add('chooseCar');

        this.elem.append(this.carTypes.getElem());
        this.elem.append(this.carDescription.getElem());
        this.elem.append(this.cargoParams.getElem());
    }
    listen () {
        this.elem.addEventListener('car-type-icon-click', this.handleCarTypeIconClick.bind(this));
        this.elem.addEventListener('checkbox-click', this.handleCheckboxClick.bind(this));
        this.elem.addEventListener('change-suitable-car', this.handleSuitableCarChange.bind(this));
        this.elem.addEventListener('cargo-param-value-change', this.handleCargoParamValueChange.bind(this));
        this.elem.addEventListener('car-description-slide-click', this.handleCarDescriptionSlideClick.bind(this));
        this.elem.addEventListener('choose-car-done', this.handleChooseCarDoneeClick.bind(this));
    }
    getElem () {
        return this.elem;
    }

    handleCarTypeIconClick (event) {
        let newType = event.detail.type;
        if (this.carTypes.allTypesCheckbox.getState() === 'checked') {
            this.elem.querySelector('.chooseCar__carTypes-icons').classList.remove('active');
            this.carTypes.allTypesCheckbox.setState('ready');
        } else {
            this.carTypes.types[this.demands.type].makeUnactive();
        }
        this.demands = {type: newType};
        this.carTypes.setDemands(this.demands);
        this.carTypes.types[newType].makeActive();
        this.handleChangeDemands();
    }
    handleCheckboxClick (event) {
        let type = event.detail.type;
        let state = event.detail.state;
        let valueTypes = ['ton','width','height','length','palet','passenger'];

        if (type === 'allTypes') {
            if (state === 'checked') {
                this.enableAllTypesSearch();
            } else {
                this.disableAllTypesSearch();
            }
            return;
        }

        if (state === 'checked') {
            if (valueTypes.includes(type)) {
                let value = this.cargoParams.params[type].getValue();
                this.demands[type] = value;
            } else {
                this.demands[type] = true;
            }
        } else {
            delete this.demands[type];
        }
        this.handleChangeDemands();
        this.updateCarDescriptionContent();
    }
    handleSuitableCarChange (event) {
        this.suitableCarNumber = event.detail.newNumber;
        this.carDescription.render();
        this.updateCarDescriptionContent();
        this.carTypes.setSuitableCarNumber(this.suitableCarNumber);
        this.carTypes.updateCheckboxes({suitableCars: this.suitableCars});
        this.cargoParams.update({
            demands: this.demands,
            suitableCars: this.suitableCars,
            suitableCarNumber: this.suitableCarNumber
        });
    }
    handleCargoParamValueChange (event) {
        let type = event.detail.type;
        let value = event.detail.value;
        this.demands[type] = value;
        this.handleChangeDemands();
    }
    handleCarDescriptionSlideClick (event) {
        let type = event.detail.type;
        this.suitableCarNumber = this.getCarIndexByName(type);
        this.carDescription.suitableCarNumber = this.suitableCarNumber;

        this.carDescription.render();
        this.updateCarDescriptionContent();
        this.carTypes.setSuitableCarNumber(this.suitableCarNumber);
        this.carTypes.updateCheckboxes({suitableCars: this.suitableCars});
        this.cargoParams.update({
            demands: this.demands,
            suitableCars: this.suitableCars,
            suitableCarNumber: this.suitableCarNumber
        });
    }
    handleChooseCarDoneeClick (event) {
        if (this.designOptions.orderButtonText === 'Заказать') {
            let car = this.suitableCars[this.suitableCarNumber];
            this.makeOrder({src: car.photo, name: car.name});
        }
    }

    handleChangeDemands () {
        this.suitableCars = this.getSuitableCars();
        this.suitableCarNumber = 0;
        this.carTypes.setSuitableCarNumber(this.suitableCarNumber);
        this.carTypes.updateCheckboxes({suitableCars: this.suitableCars});
        this.carDescription.updateSuitableCars({suitableCars: this.suitableCars});
        this.updateCarDescriptionContent();
        this.cargoParams.update({
            demands: this.demands,
            suitableCars: this.suitableCars,
            suitableCarNumber: this.suitableCarNumber
        });
    }
    getDefaultDemands () {
        return {
            type: 'van'
        }
    }
    getSuitableCars () {
        let cars = [];
        for (let car of this.cars) {
            if (this.isCarSuitable(car)) {
                cars.push(car);
            }
        }
        return cars;
    }
    getCarIndexByName (name) {
        for (let i = 0, l = this.suitableCars.length; i < l; i++) {
            let car = this.suitableCars[i];
            if (car.engName === name) {
                return i;
            }
        }
    }
    isCarSuitable (car) {
        for (let demand in this.demands) {
            if (car[demand] !== this.demands[demand]) {
                return false;
            }
        }
        return true;
    }
    updateCarDescriptionContent () {
        let elem = this.elem.querySelector('.chooseCar__carDescription');
        let newElem = this.carDescription.getElem();
        let cargoParams = this.elem.querySelector('.chooseCar__cargoParams');

        let hidePromise = anime({
            targets: [elem, newElem],
            delay: 0,
            duration: 200,
            easing: 'linear',
            opacity: 0.01
        });
        hidePromise.finished.then(()=>{
            //elem.remove(); bag fix
            let elems = this.elem.querySelectorAll('.chooseCar__carDescription');
            elems.forEach(elem => {
                elem.remove();
            });

            this.elem.insertBefore(newElem, cargoParams);

            return anime({
                targets: newElem,
                delay: 0,
                duration: 200,
                easing: 'linear',
                opacity: 1
            });
        });
    }

    enableAllTypesSearch () {
        this.carTypes.types[this.demands.type].makeUnactive();
        this.elem.querySelector('.chooseCar__carTypes-icons').classList.add('active');
        delete this.demands.type;
        this.handleChangeDemands();
    }
    disableAllTypesSearch () {
        this.elem.querySelector('.chooseCar__carTypes-icons').classList.remove('active');
        if (Object.keys(this.demands).length) {
            let suitableCars = this.getSuitableCars();
            this.demands.type = suitableCars[0].type;
        } else {
            this.demands.type = 'van';
        }
        this.carTypes.types[this.demands.type].makeActive();

        this.handleChangeDemands();
    }
    getCars() {
        return this.cars;
    }
    makeOrder (params) {
        let orderWindow = new OrderWindow({
            className: 'order-window',
            photoSrc: params.photo,
            photoName: params.name
        })
    }
}

export {ChooseCar}