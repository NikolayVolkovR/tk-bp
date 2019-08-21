import template from './item.pug'

class Item {
    constructor ({src, height, sideMargin}) {
        this.src = src;
        this.height = height;
        this.sideMargin = sideMargin;
        this.render();
        this.setHeight(this.height);
        this.setSideMargin(this.sideMargin);
        this.listen();
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({src: this.src});
        this.elem = tmp.firstElementChild;
        this.image = this.elem.querySelector('.carousel__item-image');
        this.boneShadow = this.elem.querySelector('.carousel__item-bone-shadow');
    }

    setHeight (height) {
        this.image.height = height;
    }

    setSideMargin (margin) {
        this.elem.style.marginLeft = this.sideMargin + 'px';
        this.elem.style.marginRight = this.sideMargin + 'px';
    }
    listen () {
        this.image.addEventListener('load', ()=> {
            this.hideBoneShadow();
        });
    }

    hideBoneShadow() {
        this.boneShadow.style.display = 'none';
    }

    getWidth () {
        return window.getComputedStyle(this.elem).width;
    }

    getImage () {
        return this.image;
    }
    getElem () {
        return this.elem;
    }
}

export {Item}