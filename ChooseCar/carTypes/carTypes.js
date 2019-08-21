import css from './carTypes.styl';
import template from './carTypes.pug';
import {TypeIcon} from './typeIcon/typeIcon';
import {Checkbox} from '../../Checkbox/Checkbox';

class CarTypes {
    constructor (params) {
        this.loadingTypes = [{
                name :'sideLoading',
                rusName: 'боковая'
            },{
                name :'topLoading',
                rusName: 'верхняя'
            },{
                name :'gydroLift',
                rusName: 'гидролифт'
            }];
        this.passTypes = [{
                name :'mkadPass',
                rusName: 'МКАД'
            },{
                name :'ttkPass',
                rusName: 'TTK'
            },{
                name :'skPass',
                rusName: 'СК'
            }];
        this.cars = params.cars;
        this.demands = params.demands;
        this.suitableCars = params.suitableCars;
        this.suitableCarNumber = params.suitableCarNumber;
        this.types = {};
        this.render();
    }
    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();
        this.elem = tmp.firstElementChild;
        this.renderAllTypesCheckbox();
        this.renderTypeIcons ();
        this.renderLoadTypes ();
        this.renderPassTypes ();
    }
    renderAllTypesCheckbox () {
        this.allTypesCheckbox = new Checkbox({
            label: 'Поиск среди всех типов машин',
            type: 'allTypes'
        });
        let beforeElem = this.elem.querySelector('.chooseCar__carTypes-icons');
        this.elem.insertBefore(this.allTypesCheckbox.getElem(), beforeElem);
    }
    renderTypeIcons () {
        let typeNames = ['van', 'minivan', 'heel', 'bort', 'manipulator', 'pyramid'];
        let types = [
            {name: 'van', rusName: 'фургон'},
            {name: 'minivan', rusName: 'микро-автобус'},
            {name: 'heel', rusName: 'каблук'},
            {name: 'bort', rusName: 'борт'},
            {name: 'manipulator', rusName: 'манипу-лятор'},
            {name: 'pyramid', rusName: 'пирамида'}
        ];
        let iconsElem = this.elem.querySelector('.chooseCar__carTypes-icons');

        for (let type of types) {
            let typeIcon = new TypeIcon({
                cars: this.cars,
                type: type
            });
            if (type.name === this.demands.type) {
                typeIcon.makeActive();
            }
            this.types[type.name] = typeIcon;
            iconsElem.append(typeIcon.getElem());
        }
    }
    renderLoadTypes () {
        let elem = this.elem.querySelector('.chooseCar__carTypes-half.loading');

        for (let type of this.loadingTypes) {
            let checkboxState = this.getCheckboxState(type.name);
            this[type.name] = new Checkbox({
                state: checkboxState,
                label: type.rusName,
                type: type.name
            });

            elem.append(this[type.name].getElem());
        }
    }
    renderPassTypes () {
        let elem = this.elem.querySelector('.chooseCar__carTypes-half.passes');

        for (let type of this.passTypes) {
            let checkboxState = this.getCheckboxState(type.name);
            this[type.name] = new Checkbox({
                state: checkboxState,
                label: type.rusName,
                type: type.name
            });
            elem.append(this[type.name].getElem());
        }
    }
    setDemands(demands) {
        this.demands = demands;
    }
    setSuitableCarNumber(number) {
        this.suitableCarNumber = number;
    }
    updateCheckboxes (params) {
        this.suitableCars = params.suitableCars;

        for (let type of this.loadingTypes) {
            let checkboxState = this.getCheckboxState(type.name);
            this[type.name].setState(checkboxState);
        }
        for (let type of this.passTypes) {
            let checkboxState = this.getCheckboxState(type.name);
            this[type.name].setState(checkboxState);
        }
    }
    getElem () {
        return this.elem;
    }
    getCheckboxState (paramName) {
        let activeCar = this.suitableCars[this.suitableCarNumber];

        if (this.demands[paramName]) {
            return 'checked';
        }

        if (activeCar[paramName]) {
            return 'checked-disabled';
        } else if (this.isParamAvailable(paramName)) {
            return 'ready';
        } else {
            return 'disabled';
        }
    }
    isParamAvailable (paramName) {
        for (let car of this.suitableCars) {
            if (car[paramName]){
                return true;
            }
        }
        return false;
    }
}

export {CarTypes}