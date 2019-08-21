import css from './modalWindow.styl';
import template from './modalWindow.pug';
import anime from 'animejs';

class ModalWindow {
    constructor ({shadowColor = '#000', shadowOpacity = 0.7, content = 'Пустое окно', windowWidth = '50%'} = {}) {
        this.content = content;
        this.shadowColor = shadowColor;
        this.shadowOpacity = shadowOpacity;
        this.windowWidth = windowWidth;
        this.render();
        this.appendContent();
        this.setShadowStyle();
        this.setWindowStyle();
        this.elem.addEventListener('click', this);
        this.windowElem.addEventListener('scroll', this.handleScroll.bind(this));
        this.elem.addEventListener('modal-close', this.handleCrossClick.bind(this));
    }
    handleEvent (event) {
        let target = event.target;

        if (target.classList.contains('modal__wrap')) {
            this.handleShadowClick();
        } else if (target.classList.contains('modal__window-cross')) {
            this.handleCrossClick();
        }
    }
    handleScroll (event) {
        this.windowElem.querySelector('.modal__cross-line').style.top = this.windowElem.scrollTop + 'px';
    }
    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();
        this.elem = tmp.firstElementChild;

        this.shadowElem = this.elem.querySelector('.modal__shadow');
        this.windowElem = this.elem.querySelector('.modal__window');
    }
    appendContent () {
        this.content = this.getContent();
        this.windowElem.append(this.content);
    }
    setShadowStyle () {
        this.shadowElem.style.opacity = this.shadowOpacity;
        this.shadowElem.style.background = this.shadowColor;
    }
    setWindowStyle () {
        if (this.windowWidth) {
            this.windowElem.style.flexBasis = this.windowWidth;
        }
    }
    getElem () {
        return this.elem;
    }
    getContent () {
        if (!this.content instanceof HTMLElement) {
            return document.createTextNode(this.content);
        }

        return this.content;
    }
    handleShadowClick () {
        this.close();
    }
    handleCrossClick () {
        this.close();
    }
    close () {
        let removeAnime = new anime({
            targets: this.elem,
            duration: 250,
            delay: 0,
            opacity: 0,
            easing: 'linear'
        });
        removeAnime.finished.then(()=> {
            this.elem.remove();
            document.documentElement.style.overflowY = "auto";
        });
    }
    fire (params) {
        if (params) {
            if (params.animateFadeIn) {
                let hide = new anime({
                    targets: this.elem,
                    delay: 0,
                    duration: 0,
                    opacity: 0.01
                });
                document.body.append(this.getElem());
                let show = new anime({
                    targets: this.elem,
                    delay: 10,
                    duration: params.animateFadeIn,
                    opacity: 1,
                    easing: 'linear'
                });
            }
        } else {
            document.body.append(this.getElem());
        }
        document.documentElement.style.overflowY = "hidden";
    }
}

export {ModalWindow}