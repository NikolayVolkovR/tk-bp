import css from './cargoParams.styl';
import template from './cargoParams.pug';
import {Param} from'./param/param.js'

class CargoParams {
    constructor (params) {
        this.cars = params.cars;
        this.demands = params.demands;
        this.suitableCars = params.suitableCars;
        this.suitableCarNumber = params.suitableCarNumber;
        this.names = [{
            eng: 'ton',
            rus: 'вес'
        },{
            eng: 'length',
            rus: 'длина'
        },{
            eng: 'height',
            rus: 'высота'
        },{
            eng: 'width',
            rus: 'ширина'
        },{
            eng: 'palet',
            rus: 'палет'
        },{
            eng: 'passenger',
            rus: 'пассажиров'
        }];
        this.params = {};
        this.render();
        this.elem.addEventListener('click', this);

    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({car: this.suitableCars[this.suitableCarNumber]});
        this.elem = tmp.firstElementChild;

        this.renderParams();
    }

    handleEvent(event) {

    }

    getElem () {
        return this.elem;
    }
    renderParams () {
        for (let name of this.names) {
            this.params[name.eng] = new Param({
                name: name,
                cars: this.cars,
                demands: this.demands,
                suitableCars: this.suitableCars,
                suitableCarNumber: this.suitableCarNumber
            });
            this.elem.append(this.params[name.eng].getElem());
        }
    }
    update (params) {
        this.demands = params.demands;
        this.suitableCars = params.suitableCars;
        this.suitableCarNumber = params.suitableCarNumber;

        this.updateParams();
    }
    updateParams () {
        for (let name of this.names) {
            let param = this.params[name.eng];
            param.update({
                demands: this.demands,
                suitableCars: this.suitableCars,
                suitableCarNumber: this.suitableCarNumber
            });
        }
    }
}

export {CargoParams}