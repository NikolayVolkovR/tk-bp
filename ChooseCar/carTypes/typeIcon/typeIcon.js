import css from './typeIcon.styl';
import template from './typeIcon.pug'

class TypeIcon {
    constructor (params) {
        this.cars = params.cars;
        this.type = params.type;
        this.render();
        this.elem.addEventListener('click', this);
    }
    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({type: this.type});
        this.elem = tmp.firstElementChild;
        if (this.isDisabled()) {
            this.elem.classList.add('disabled');
        }
    }
    getElem () {
        return this.elem;
    }
    isDisabled () {
        for (let car of this.cars) {
            if (car.type === this.type.name) {
                return false;
            }
        }
        return true;
    }
    handleEvent (event) {
        if (this.isDisabled()) {
            return false;
        }

        this.elem.dispatchEvent(new CustomEvent('car-type-icon-click',{
            bubbles: true,
            detail: {type: this.type.name}
        }))
    }
    makeActive () {
        this.elem.classList.add('active');
    }
    makeUnactive () {
        this.elem.classList.remove('active');
    }
}
export {TypeIcon}