import css from './checkbox.styl';

class Checkbox {
    constructor (params) {
        this.state = params && params.state ? params.state : 'ready';
        this.labelText = params && params.label ? params.label : 'labelText';
        this.type = params && params.type ? params.type : null;
        this.render();
        this.setData();
        this.setSrcByState();
        this.handleDisabledClass();
        this.elem.addEventListener('click', this);
    }
    render () {
        this.elem = document.createElement('div');
        this.elem.classList.add('cCheckbox');

        this.imageElem = document.createElement('img');
        this.imageElem.classList.add('cCheckbox-image');

        this.labelElem = document.createElement('div');
        this.labelElem.classList.add('cCheckbox-label');
        this.labelElem.innerHTML = this.labelText;

        this.elem.append(this.imageElem);
        this.elem.append(this.labelElem);
    }
    handleEvent (event) {
        if (this.isDisabled()) {
            return false;
        }

        this.state = this.state === 'ready' || this.state === 'checked-disabled' ? 'checked' : 'ready';
        this.setSrcByState();

        this.elem.dispatchEvent(new CustomEvent('checkbox-click', {
            bubbles: true,
            cancelable: true,
            detail: {
                type: this.type,
                state: this.state
            }
        }))
    }
    setData () {
        if (this.type) {
            this.elem.dataset.type = this.type;
        }
    }
    setSrcByState () {
        let src = '/images/checkbox/' + this.state + '.svg';
        this.imageElem.src = src;
    };
    handleDisabledClass () {
        if (this.state === 'disabled') {
            this.elem.classList.add('disabled');
        } else {
            this.elem.classList.remove('disabled');
        }
    }
    getState () {
        return this.state;
    }
    setState (state) {
        this.state = state;
        this.setSrcByState();
        this.handleDisabledClass();
    }
    getElem  () {
        return this.elem;
    }
    isDisabled () {
        if (this.elem.classList.contains('disabled')) {
            return true;
        } else {
            return false;
        }
    }
}

export {Checkbox}