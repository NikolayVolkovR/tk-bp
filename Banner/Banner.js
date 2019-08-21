
import css from './banner.styl';
import template from './banner.pug';
import {Board} from "./board/board";
import anime from 'animejs';
import Velocity from 'velocity-animate';

class Banner {
    constructor({
            bannerData,
            height, width,
            slideNumber,
            changeSlideDuration = 10000,
            bgAnimationMultiplier = 90,
            srcVersion = '0.1'
    }) {
        this.data = bannerData;
        this.height = height;
        this.width = width;
        this.slideNumber = slideNumber;
        this.changeSlideDuration = changeSlideDuration;
        this.bgAnimationMultiplier = bgAnimationMultiplier;
        this.srcVersion = srcVersion;
        this.srcMode = this.getSrcMode();
        this.bindedFunctions = {};

        this.board = new Board({slide: this.getActiveSlide()});
        this.render();
        this.setElemHeight(this.height);
        this.preloadFirstSlideImage();
        this.preloadAllImages();
        //this.startBannerFrameAnimation();
        this.startSlideChanging();
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();
        this.elem = tmp.firstElementChild;
        this.background = this.elem.querySelector('.banner__background');
        this.bannerShadow = this.elem.querySelector('.banner__shadow');
        this.renderBoard();
    }
    startSlideChanging () {
        if (this.state === 'running') {
            return false;
        }
        this.checkIsRunning();
        let self = this;
        this.slideChangeTimeout = setTimeout(function change() {
            self.setState('running');
            self.stopBackgroundAnimation();
            self.changeSlide();
            setTimeout(change, self.changeSlideDuration)
        },self.changeSlideDuration)
    }

    checkIsRunning () {
        return this.state === 'running';
    }
    setState (state) {
        this.state = state;
    }
    changeSlide () {
        this.setNextSlideNumber();
        this.fadeInBackground()
            .then(()=>{
                this.setBackgroundCoordsDefault();
                this.setBackground();
                this.startBackgroundAnimation();
                this.fadeOutBackground();
            });
        this.board.changeSlide(this.getActiveSlide());
    }
    fadeInBackground() {
        return Velocity(this.bannerShadow, {opacity: 1}, {duration: 700});
    }
    fadeOutBackground() {
        return Velocity(this.bannerShadow, {opacity: 0}, {duration: 700});
    }


    renderBoard () {
        let slide = this.data[this.slideNumber];
        this.elem.append(this.board.getElem());
    }

    preloadFirstSlideImage () {
        this.bindedFunctions.handleFirstImageOnload = this.handleFirstImageOnload.bind(this);
        this.firstImage = this.getSlideImage(this.getSlideSrc(this.getActiveSlide()));
        this.firstImage.addEventListener('load', this.bindedFunctions.handleFirstImageOnload);
    }
    handleFirstImageOnload () {
        this.setBackground();
        this.stopBannerFrameAnimation();
        this.startBackgroundAnimation();
        this.firstImage.removeEventListener('load', this.bindedFunctions.handleFirstImageOnload);
    }
    preloadAllImages () {
        for (let slide of this.data) {
            let image = this.getSlideImage(slide.src[this.srcMode]);
        }
    }

    startBackgroundAnimation () {
        let image = this.getSlideImage(this.getSlideSrc(this.getActiveSlide()));
        image.onload = () => {
            let maxTop = image.height - this.height;
            let maxLeft = image.width - this.width;
            let duration = Math.max(maxTop, maxLeft) * this.bgAnimationMultiplier;
            if (maxTop < 0 || maxLeft < 0) {
                return false;
            }
            Velocity(this.background,
                {
                    translateX: -maxLeft,
                    translateY: -maxTop
                }, {
                    duration: duration,
                    easing: "linear"
                });
        }
    }
    stopBackgroundAnimation () {
        Velocity(this.background, 'stop');
    }

    bannerFrameAnimationIteration (duration) {
        Velocity(this.bannerShadow, { opacity: 0.5 },
            {
                duration: duration,
                complete: function(elements) {
                    Velocity(elements, {opacity: 1}, {duration: duration})
                }
            });
    }
    startBannerFrameAnimation () {
        let self = this;
        let duration = 500;
        this.bannerFrameAnimationIteration(duration);

        this.bannerFrameAnimationTimeout = setTimeout(function run () {
            self.bannerFrameAnimationIteration(duration);
            setTimeout(run, duration*2)
        }, duration*2)
    }
    stopBannerFrameAnimation () {
        clearTimeout(this.bannerFrameAnimationTimeout);
        Velocity(this.bannerShadow, {opacity: 0}, {duration: 500})
            .then(()=> {
                this.bannerShadow.style.background = '#fff';
                Velocity(this.bannerShadow, 'stop');
            })
    }

    setBackground () {
        let src = this.getSlideSrc(this.getActiveSlide());
        let image = this.getSlideImage(src);
        image.onload = () => {
            this.background.style.background = 'url('+ src + '?v=' + this.srcVersion +')';
            Object.assign(this.background.style, {
                width: image.width + 'px',
                height: image.height + 'px'
            });
        }
    }
    setBackgroundCoordsDefault () {
        Velocity(this.background, {
            translateX: 0,
            translateY: 0,
        }, {
            duration: 0
        });
    }
    setElemHeight (height) {
        this.elem.style.height = height + 'px';
    }

    getActiveSlide () {
        return this.data[this.slideNumber];
    }
    getSrcMode () {
        if (this.width >= 840) {
            return 'el';
        } else if (this.width >= 640) {
            return 'md';
        } else {
            return 'es';
        }
    }
    getSlideSrc (slide) {
        //return this.getActiveSlide().src[this.srcMode];
        return slide.src[this.srcMode];
    }
    getSlideImage(src) {
        let image = new Image();
        image.src = src + '?v=' + this.srcVersion;
        return image;
    }
    setNextSlideNumber () {
        this.slideNumber = this.slideNumber + 1 >= this.data.length ? 0 : this.slideNumber + 1;
    }

    getElem () {
        return this.elem;
    }

    checkImgLoaded (src) {
        return new Promise( resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve({src, status: 'ok'});
            img.onerror = () => rwsolve({src, status: 'error'});
        })
    }
}

export {Banner}