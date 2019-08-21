'use strict';
import template from './inputLine.pug';

class InputLine {
    constructor(params) {
        this.support = params.support;
        this.click_or_touch = this.support.isMobile ? 'touchstart' : 'click';
        this.mode = params.mode;

        this.render();
        this.bindSuggestView();
        this.listenCrossClick();
        this.listenSuggestSelect();
        this.listenInputChange();
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({
            //name: value
        });
        this._elem = tmp.firstElementChild;
        this._input = this._elem.querySelector('.calculator__input')
    }
    bindSuggestView () {
        //let input = this._elem.querySelector('input');
        this.suggestView = new ymaps.SuggestView(this._input);
    }
    listenCrossClick () {
        let self = this;
        let cross = this._elem.querySelector('.calculator__input-cross');
        cross.addEventListener(this.click_or_touch, event => {
            this._elem.dispatchEvent(new CustomEvent('input-cross-click', {
                bubbles: true
            }));

            if (this.mode === 'default') {
                this.clearValue();
                this.clearCoords();
            } else {
                this.remove();
            }
        })
    }
    listenSuggestSelect () {
        this.suggestView.events.add('select', (event) => {
            this.showCross();
            this._elem.dispatchEvent(new CustomEvent('input-suggest-select', {
                bubbles: true
            }));
        });
    }
    listenInputChange () {
        this._input.addEventListener('change', ()=> {
            this.fillCoords();
        })
    }

    clearValue () {
        //let input = this._elem.querySelector('.calculator__input');
        this._input.value = '';

        let cross = this._elem.querySelector('.calculator__input-cross');
        cross.style.display = 'none';
    }
    clearCoords () {
        this._input.dataset.coords = '';
    }
    remove () {
        this._elem.remove();
    }
    showCross() {
        let cross = this._elem.querySelector('.calculator__input-cross');
        cross.style.display = 'block';
    }
    getValue () {
        return this._input.value;
    }
    setValue (value) {
        this._input.value = value;
    }
    fillCoords () {
        let input = this._input;
        if (input.value) {
            ymaps.geocode(input.value).then(
                (res) => {
                    let firstGeoObject = res.geoObjects.get(0);
                    let coords = firstGeoObject.geometry.getCoordinates();
                    input.dataset.coords = coords.join(',');
                },
                (err) => {

                }
            )
        }

    }
    setBgImage (value) {
        //let input = this._elem.querySelector('.calculator__input');
        this._input.style.backgroundImage = 'url(/images/' + value + ')';
    }
    getElem () {
        return this._elem;
    }
}

export {InputLine}