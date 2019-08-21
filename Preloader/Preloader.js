import css from './preloader.styl';
import template from './preloader.pug';
import anime from 'animejs';
import {Support} from '../Support.js';

class Preloader {
    constructor (params) {
        this.elem = null; // Елемент
        this.content = null; // Контейнер со всем интересным
        this.backgrounds = this.getBackgrounds();
        this.preloadImages();
        this.render();
        this.support = new Support();

        this.nowBgIndex = null;
        this.carTimeout = null;
        this.bgTimeout = null;
        this.animSpeedBase = 100 / 6;
        this.isStopped = false;
    }

    preloadImages () {
        for (let bg of this.backgrounds) {
            let img = new Image();
            img.src = bg.src;
        }
    }
    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();

        this.elem = tmp.firstElementChild;
        this.content = this.elem.querySelector('.preloader__content');
    }
    getElem () {
        return this.elem;
    }
    getBackgrounds () {
        return [
            {
                src: '/images/preloader/trees-1.svg',
                height: '50%',
                bottom: 0
            },
            {
                src: '/images/preloader/tree-big.svg',
                height: '50%',
                bottom: 0
            },
            {
                src: '/images/preloader/home-1.svg',
                height: '50%',
                bottom: 0
            },
            /*{
                src: '/images/preloader/spruce-big.svg',
                height: '50%',
                bottom: 0
            },*/
            {
                src: '/images/preloader/spruces-1.svg',
                height: '60%',
                bottom: 0
            },
            {
                src: '/images/preloader/hills-1.svg',
                height: '30%',
                bottom: 0
            }
        ]

    }
    run () {
        $(this.elem).fadeIn(200);
        this.runCar();
        this.prepareBackground();
        this.runBackground();
    }
    stop () {
        $(this.elem).fadeOut(200);
        clearTimeout(this.carTimeout);
        clearTimeout(this.bgTimeout);
    }
    runCar () {
        let self = this;
        let duration = 400;
        let carTop = this.content.querySelector('.preloader__car-top');
        //console.log('runCar')
        this.carTimeout = setTimeout(function go (){
            let carGoesUp = anime({
                targets: carTop,
                marginBottom: -5,
                deley: 0,
                duration: duration,
                easing: 'linear',
                complete: () => {
                    let carGoesDown = anime({
                        targets: carTop,
                        marginBottom: -8,
                        duration: duration,
                        easing: 'linear',
                        deley: 0,
                    })

                    self.carTimeout = setTimeout(go, duration * 2)
                }
            });
        },duration * 3)
    }
    prepareBackground () {
        let bg = this.elem.querySelector('.preloader__background');
        bg.style.marginLeft = 0;

        this.addBgImage({marginLeft: 0});
        this.addBgImage({});
        this.addBgImage({});
        this.addBgImage({});
        this.addBgImage({});
        this.addBgImage({});
    }
    addBgImage (params) {
        this.getRandomBackgroundIndex()
        let marginLeft = params.marginLeft || this.support.getRandomInteger(-10, 55);
        let bgContainer = this.elem.querySelector('.preloader__background');
        let bg = this.backgrounds[this.nowBgIndex];
        let img = new Image();
        img.src = bg.src;
        img.style.marginLeft = marginLeft + 'px';
        img.style.height = bg.height;

        bgContainer.append(img);
    }
    runBackground () {
        let self = this;
        this.bgTimeout = setTimeout(function run(){
            self.flickBg();
            if (!self.isStopped) {
                self.bgTimeout = setTimeout(run, self.animSpeedBase);
            }
        }, self.animSpeedBase)
        /*this.bgTimeout = setTimeout(function runBg(){
            self.getRandomBackgroundIndex();
            let bg = self.backgrounds[self.nowBgIndex];

            img.src = bg.src;
            img.style.height = bg.height;
            img.style.marginBottom = bg.bottom + 'px';

            let preAnime = anime({
                targets: img,
                translateX: 300,
                duration: 0,
                delay: 0
            });

            /!*$(img).fadeIn(250);
            setTimeout(()=>{
                $(img).fadeOut(250);
            }, 1000);*!/

            let moveAnime = anime({
                targets: img,
                translateX: -300,
                duration: 2000,
                easing: 'linear',
                delay: 0
            });

            if (true) {
                self.bgTimeout = setTimeout(runBg, 2000)
            }
        }, 1000);*/
    }
    getRandomBackgroundIndex () {
        let bg = Math.floor(Math.random() * this.backgrounds.length);

        if (bg === this.nowBgIndex) {
            this.getRandomBackgroundIndex();
            return;
        }
        this.nowBgIndex = bg;
    }
    flickBg () {
        let bg = this.elem.querySelector('.preloader__background');
        let firstElem = this.elem.querySelectorAll('img')[0];
        let firstElemWidth = parseInt(firstElem.clientWidth);
        let firstElemMargin = parseInt(firstElem.style.marginLeft);
        let nowMargin = parseInt(bg.style.marginLeft);
        let moveValue = 3;
        if (Math.abs(nowMargin) >= firstElemWidth + firstElemMargin) {
            firstElem.remove();
            bg.style.marginLeft = 0 + 'px';
            this.addBgImage({});
            return false;
        }
        bg.style.marginLeft = nowMargin - moveValue + 'px';
    }
}

export {Preloader}