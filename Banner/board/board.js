import template from './board.pug';
import Velocity from 'velocity-animate';

class Board {
    constructor (params) {
        this.slide = params.slide;

        this.render();
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();
        this.elem = tmp.firstElementChild;

        this.header = this.elem.querySelector('.banner__board-header');
        this.subHeader = this.elem.querySelector('.banner__board-sub-header');
        this.text = this.elem.querySelector('.banner__board-text');
        this.setContent();
    }

    setContent () {
        this.header.innerHTML = this.slide.header;
        this.subHeader.innerHTML = this.slide.subHeader;
        this.text.innerHTML = this.slide.text;
    }

    getElem () {
        return this.elem;
    }

    changeSlide (slide) {
        this.slide = slide;
        this.fadeOutElems().
            then(()=> {
                this.setContent();
                this.fadeInElems()
            });

    }
    fadeOutElems () {
        return Velocity([this.header, this.subHeader, this.text], {opacity: 0}, {duration: 500});
    }
    fadeInElems () {
        return Velocity([this.header, this.subHeader, this.text], {opacity: 1}, {duration: 500});
    }
}

export {Board}