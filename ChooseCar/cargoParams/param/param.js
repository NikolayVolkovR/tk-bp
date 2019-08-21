import css from './param.styl';
import template from './param.pug'
import {Checkbox} from '../../../Checkbox/Checkbox';

class Param {
    constructor (params) {
        this.name = params.name;
        this.cars = params.cars;
        this.demands = params.demands;
        this.suitableCars = params.suitableCars;
        this.suitableCarNumber = params.suitableCarNumber;
        this.checkbox = new Checkbox({
            label: this.name.rus,
            type: this.name.eng
        });
        this.steps = this.getSteps();
        this.step = this.getCurrentStep();
        this.enableClick = true;

        this.render();
        this.valueElem = this.elem.querySelector('.chooseCar__cargoParams-value');
        this.minusElem = this.elem.querySelector('.chooseCar__cargoParams-minus');
        this.plusElem = this.elem.querySelector('.chooseCar__cargoParams-plus');
        this.handleButtonsDisable();

        this.elem.addEventListener('click', this);
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({
            value: this.suitableCars[this.suitableCarNumber][this.name.eng]
        });
        this.elem = tmp.firstElementChild;
        this.renderCheckbox();
    }
    renderCheckbox () {
        let valueWrap = this.elem.querySelector('.chooseCar__cargoParams-valueWrap');
        this.elem.insertBefore(this.checkbox.getElem(), valueWrap);
    }
    handleEvent(event) {
        if (this.enableClick) {
            this.enableClick = false;

            let target = event.target;
            if ((target === this.minusElem || target.parentNode === this.minusElem) &&
                !target.classList.contains('disabled') && !target.parentNode.classList.contains('disabled')) {
                this.handleMinusClick();
            } else if ((target === this.plusElem || target.parentNode === this.plusElem) &&
                !target.classList.contains('disabled') && !target.parentNode.classList.contains('disabled')) {
                this.handlePlusClick();
            }
        }

        setTimeout(()=> {
            this.enableClick = true;
        }, 500);
    }
    getElem () {
        return this.elem;
    }
    getValue () {
        return parseFloat(this.valueElem.innerHTML);
    }
    getSteps () {
        let values = [];
        let suitableCarsSourse = this.checkbox.getState() === 'checked'
            ? this.getSuitableCarsWithoutOwnParam()
            : this.suitableCars;

        for(let car of suitableCarsSourse) {
            if (!values.includes(car[this.name.eng])) {
                values.push(car[this.name.eng]);
            }
        }

        return values.sort(function(a, b) {
            return a - b;
        });
    }
    getCurrentStep () {
        let car = this.suitableCars[this.suitableCarNumber];
        for (let i = 0, l = this.steps.length; i < l; i++) {
            if (this.steps[i] === car[this.name.eng]) {
                return i;
            }
        }
    }
    setValue (value) {
        this.valueElem.innerHTML = value;
    }
    getSuitableCarsWithoutOwnParam() {
        let cars = [];
        for (let car of this.cars) {
            if (this.isCarSuitableWithoutOwnParam(car)) {
                cars.push(car);
            }
        }
        return cars;
    }
    isCarSuitableWithoutOwnParam (car) {
        for (let demand in this.demands) {
            if (demand === this.name.eng) {
                continue;
            }
            if (car[demand] !== this.demands[demand]) {
                return false;
            }
        }
        return true;
    }
    update (params) {
        this.demands = params.demands;
        this.suitableCars = params.suitableCars;
        this.suitableCarNumber = params.suitableCarNumber;
        this.setValue(this.suitableCars[this.suitableCarNumber][this.name.eng])
        this.steps = this.getSteps();
        this.step = this.getCurrentStep();
        this.handleButtonsDisable();
    }
    handleButtonsDisable () {
        if (this.steps.length === 1) {
            this.minusElem.classList.add('disabled');
            this.plusElem.classList.add('disabled');
        } else {
            if (this.isAvailablePrevStep()) {
                this.minusElem.classList.remove('disabled');
            } else {
                this.minusElem.classList.add('disabled');
            }

            if (this.isAvailableNextStep()) {
                this.plusElem.classList.remove('disabled');
            } else {
                this.plusElem.classList.add('disabled');
            }
        }
    }

    isAvailablePrevStep () {
        let value = this.getValue();
        for (let i = 0, l = this.steps.length; i < l; i++) {
            if (this.steps[i] === value && i !== 0) {
                return true;
            }
        }
        return false;
    }
    isAvailableNextStep () {
        let value = this.getValue();
        for (let i = 0, l = this.steps.length; i < l; i++) {
            if (this.steps[i] === value && i !== l - 1) {
                return true;
            }
        }
        return false;
    }

    handleMinusClick () {
        this.step = this.step === 0 ? this.steps.length - 1 : this.step - 1;
        this.changeValue();
    }
    handlePlusClick () {
        this.step = this.step === this.steps.length -1 ? 0 : this.step + 1;
        this.changeValue();
    }
    changeValue () {
        this.valueElem.innerHTML = this.steps[this.step];
        this.handleButtonsDisable();
        if (this.checkbox.getState() !== 'checked') {
            this.checkbox.setState('checked');
        }
        this.elem.dispatchEvent(new CustomEvent('cargo-param-value-change', {
            bubbles: true,
            detail: {
                type: this.name.eng,
                value: this.getValue()
            }
        }))
    }
}

export {Param}