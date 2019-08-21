import css from './carousel.styl'
import template from './carousel.pug'
import {Item} from "./item/item"
import Velocity from 'velocity-animate'
import {BoneAnimate} from "../BoneAnimate/BoneAnimate";

class Carousel {
    constructor ({dataPromise, height = 150, itemSideMargin = 20, srcollSpeed = 17}) {
        this.dataPromise = dataPromise;
        this.height = height;
        this.itemSideMargin = itemSideMargin;
        this.items = [];
        this.marginLeft = 0;
        this.firstItem = undefined;
        this.firstItemWidth = undefined;
        this.srcollSpeed = srcollSpeed;
        this.setState('init');

        this.renderTemplate();
        this.dataPromise
            .then((response)=>{ // todo обработать ошибку сервера
                this.hideBoneShadow();
                this.data = response.data;
                this.createItems();
                this.renderItems();
                this.setFirstItem();
                return this.getImagesLoadPromise();
            })
            .then(()=> {
                this.startAnimation();
                this.listeners();
            })
    }

    renderTemplate () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();
        this.elem = tmp.firstElementChild;
        this.ribbon = this.elem.querySelector('.carousel__ribbon');
        this.boneShadow = this.elem.querySelector('.carousel__bone-shadow');

        this.setHeight(this.height);
    }
    createItems () {
        for (let itemData of this.data) {
            this.items.push(new Item({src: itemData.src, height: this.height, sideMargin: this.itemSideMargin}))
        }
    }
    renderItems () {
        for (let item of this.items) {
            this.ribbon.append(item.getElem());
        }
    }
    hideBoneShadow () {
        this.boneShadow.remove();
    }
    listeners () {
        this.bindFunction = {
            handleMouseover: this.handleMouseover.bind(this),
            handleMouseout: this.handleMouseout.bind(this)
        };
        this.elem.addEventListener('mouseover', this.bindFunction.handleMouseover);
        this.elem.addEventListener('mouseout', this.bindFunction.handleMouseout);

    }
    handleMouseover (event) {
        this.state = 'pause';
    }
    handleMouseout (event) {
        this.state = 'scroll';
    }
    setState (state) {
        this.state = state;
    }
    isStateEquals(state) {
        return this.state === state;
    }

    startAnimation () {
        if (this.isStateEquals('scroll')) {
            return false;
        }
        this.setState('scroll');
        const self = this;
        this.timeout = setTimeout(function scroll() {
            if (self.isStateEquals('scroll')) {
                self.moveRibbon();
                self.handleMoveIcon();
            }
            this.timeout = setTimeout(scroll, self.srcollSpeed)
        }, self.srcollSpeed);
    }
    moveRibbon () {
        this.marginLeft -= 0.5;
        this.ribbon.style.marginLeft = this.marginLeft + 'px';
    }
    handleMoveIcon () {
        if (this.isFirstItemSlided()) {
            this.moveFirstItemBack();
            this.setFirstItem();
        }
    }

    isFirstItemSlided () {
        return Math.abs(this.marginLeft) >= this.firstItemWidth + this.itemSideMargin * 2;
    }
    moveFirstItemBack () {
        this.ribbon.appendChild(this.firstItem);
        this.marginLeft = 0;
        this.ribbon.style.marginLeft = this.marginLeft + 'px';
    }
    setFirstItem () {
        this.firstItem = this.ribbon.firstElementChild;
        this.firstItemWidth = parseInt(window.getComputedStyle(this.firstItem).width);
    }

    setHeight (height) {
        this.elem.style.height = height + 'px';
    }
    getImagesLoadPromise () {
        let promises = [];
        for (let item of this.items) {
            let image = item.getImage();
            promises.push(new Promise((resolve)=>{
                image.addEventListener('load', ()=> {
                    resolve()
                });
            }))
        }
        return promises;
    }
    getElem () {
        return this.elem;
    }
}

export {Carousel}