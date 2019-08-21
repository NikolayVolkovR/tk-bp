import css from './mocha.styl';
import {mocha} from 'mocha';
import chai from 'chai';
import {ChooseCarSpec} from "./ChooseCar/ChooseCar.spec"
import {CheckboxSpec} from "./Checkbox/Checkbox.spec"
import {SliderSpec} from "./Slider/Slider.spec"
import {ModalWindowSpec} from "./ModalWindow/ModalWindow.spec"

class Tests {
    constructor (params) {
        this.cars = params.cars;
        this.prepare();
        this.tests();
        mocha.run();
    }
    prepare () {
        mocha.setup('bdd');
        let mochaContainer = document.createElement('div');
        mochaContainer.id = 'mocha';
        let footer = document.querySelector('.footer');
        document.querySelector('.wrap').insertBefore(mochaContainer, footer);
    }
    tests () {
        let chooseCarSpec = new ChooseCarSpec({cars: this.cars});
        let checkboxSpec = new CheckboxSpec();
        let sliderSpec = new SliderSpec({cars: this.cars});
        let modalWindowSpec = new ModalWindowSpec({});
    }
}

export {Tests}