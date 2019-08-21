import css from './inputs.styl';
import template from './inputs.pug';
import {InputLine} from './inputLine/inputLine';

class Inputs {
    constructor (params) {
        this.container = document.querySelector('.calculator__inputsWrap');
        this.support = params.support;
        this.click_or_touch = params.click_or_touch;
        this.InputLines = []; // Экземпляры InputLine

        if (this.container) {
            this.render();
            this.addInput('default');
            this.addInput('default');
        }
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();

        this.inputs = tmp.children[0];
        this.buttons = tmp.children[1];

        this.container.append(this.inputs);
        this.container.append(this.buttons);

        this.listenAddPoint();
        this.listenResetRoute();
    }
    addInput (mode) {
        let linesParent = this.inputs;
        let inputLines = this.inputs.querySelectorAll('.calculator__input-line');
        let lastLine = inputLines[inputLines.length - 1];
        let newLine = new InputLine({
            mode: mode,
            support: this.support
        });
        let newLineElement = newLine.getElem();

        if (mode === 'default') {
            this.InputLines.push(newLine);
            linesParent.appendChild(newLineElement);
            if (this.InputLines.length > 1) {
                newLine.setBgImage('input-mark-blue.svg');
            }
        } else {
            this.InputLines.splice(-1, 0, newLine);
            newLine.showCross()
            linesParent.insertBefore(newLineElement, lastLine);
            newLine.setBgImage('input-mark-green.svg');
        }
    }

    listenAddPoint () {
        let addPoint = this.buttons.querySelector('.calculator__addPoint');
        addPoint.addEventListener(this.click_or_touch, this.handleAddPointClick.bind(this));
    }
    listenResetRoute () {
        let resetRoute = this.buttons.querySelector('.calculator__resetRoute');
        resetRoute.addEventListener(this.click_or_touch, this.handleResetRouteClick.bind(this));
    }

    handleMapClick (coords) {
        let InputLines = this.InputLines;
        let self = this;

        ymaps.geocode(coords).then(result => {
            let firstGeoObject = result.geoObjects.get(0);
            let addres = firstGeoObject.getAddressLine();

            for (let input of InputLines) {
                if (!input.getValue().length) {
                    let detail = {
                        color: self.getTpmPlacemarkColor(),
                        coords: coords
                    };

                    input.setValue(addres);
                    input.fillCoords();
                    input.showCross();

                    this.container.dispatchEvent(new CustomEvent('add-tmp-placemark', {
                        bubbles: true,
                        detail: detail
                    }));
                    return false;
                }
            }
        });
    }
    handleAddPointClick (event) {
        if (!event.target.classList.contains('active')) {
            return false;
        }
        this.addInput();

        this.buttons.dispatchEvent(new CustomEvent('add-point-input', {
            bubbles: true
        }));
        //this.mapCursorMark();
    }
    handleResetRouteClick (event) {
        this.container.dispatchEvent(new CustomEvent('reset-route-click', {
            bubbles: true
        }));
    }

    getTpmPlacemarkColor () {
        let inputs = this.container.querySelectorAll('.calculator__input');
        let index = this.getEmptyInputIndex();
        let length = inputs.length;

        if (index === 0) {
            return '#ff3333';
        } else if (index === length - 1) {
            return '#54a0ec';
        } else {
            return '#71b732';
        }
    }
    getEmptyInputIndex () {
        let inputs = this.container.querySelectorAll('.calculator__input');

        for (let i = 0; i < inputs.length; i += 1) {
            if (!inputs[i].value.length) {
                return i;
            }
        }
    }
    getEmptyInput () {
        let inputs = this.container.querySelectorAll('.calculator__input');
        for (let input of inputs) {
            if (!input.value.length) {
                return input;
            }
        }
        return false;
    }
    getPoints () {
        let points = [];
        let inputs = this.container.querySelectorAll('.calculator__input');

        for (let input of inputs) {
            if (!input.value) {
                continue;
            }
            points.push(input.value);
        }
        return points;
    }

    isCreateRouteAvaliable () {
        let inputs = this.inputs.querySelectorAll('.calculator__input');

        if (!inputs[0].value || !inputs[inputs.length - 1].value) {
            return false;
        }
        return true;
    }

    clear () {
        let length = this.InputLines.length;
        for (let i = 0; i < length; i += 1) {
            if (i !== 0 && i !== length - 1) {
                this.InputLines[i].remove();
            } else {
                this.InputLines[i].clearValue();
                this.InputLines[i].clearCoords();
            }
        }
        this.disableResetButton();
    }
    enableResetButton () {
        let button = this.container.querySelector('.calculator__resetRoute');
        button.classList.add('active');
    }
    disableResetButton () {
        let button = this.container.querySelector('.calculator__resetRoute');
        button.classList.remove('active');
    }
}

export {Inputs};