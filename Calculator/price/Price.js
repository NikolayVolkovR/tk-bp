import css from './price.styl';
import template from './price.pug';
import anime from 'animejs';
import {AnchorScroll} from "../../commons/AnchorScroll"

class Price {
    constructor (params) {
        this.container = params.container;
        this.click_or_touch = params.click_or_touch;
        this.carData = {}; // Параметры машины.
        //this.render();
        //this.listen();
        this.listen();
        this.isMinimized = false; // Окошко свёрнуто?
    }
    render (mode) {
        let routeData = this.getRouteGeneralData({pathsDescription: this.pathsDescription, passes: this.passes});
        routeData.realPointsQuantity = this.realPointsQuantity;
        routeData.passes = this.passes;
        let calcData = this.getCalculations(routeData);
        let tmp = document.createElement('div');
        tmp.innerHTML = template({params: {
            routeData: routeData,
            calcData: calcData
        }});

        if (!mode) {
            this.elem = tmp.firstElementChild;
            this.container.append(this.elem);
        } else {
            let newElem = tmp.querySelector('.calculator__price-content');
            this.elem.innerHTML = '';
            $(newElem).fadeTo(0, 0);
            this.elem.append(newElem);
        }
        this.listenAnchorScroll();
    }
    listen () {
        this.container.addEventListener(this.click_or_touch, this)
    }
    handleEvent (event) {
        let target = event.target;
        if (target.classList.contains('calculator__price-close')) {
            this.minimize();
        } else if (target.classList.contains(('calculator__price-expand'))) {
            this.expand();
        }

    }
    show (params) {
        this.clear();
        this.container.style.overflow = 'visible';
        this.pathsDescription = params.pathsDescription;
        this.carData = params.carData;
        this.realPointsQuantity = params.realPointsQuantity;
        this.passes = params.passes;

        this.render();
        this.fitToContent({speed: 750});
    }
    minimize () {
        let elemsToHide = this.getExpandElements();
        let elemsToShow = this.getMinimizeElements();

        let hidePrimise = new Promise((res,reg)=>{
            $(elemsToHide).fadeOut(250,()=>{
                res();
            })
        });
        hidePrimise.then(()=> {
            return new Promise((res,req)=>{
                $(elemsToShow).fadeTo(0, 0.01,()=>{
                    res();
                })
            })
        }).then(()=> {
            this.elem.querySelector('.line-last').classList.add('minimize');
            return this.getFitToContentPromise({speed: 250});
        }).then(()=>{
            return new Promise((res, reg)=> {
                $(elemsToShow).fadeTo(250, 1, ()=> {
                    this.isMinimized = true;
                    res()
                })
            });
        })
    }
    expand () {
        let elemsToShow = this.getExpandElements();
        let elemsToHide = this.getMinimizeElements();

        /*  скрыть по анимации существующий контент ->
         *  показать мгновенно спрятанный контент с прозрачностью 0.1 ->
         *  показать по анимации спрятанный контент
         */
        let hidePromise = new Promise((res, reg)=>{
            $(elemsToHide).fadeOut(250, ()=> {
                res()
            })
        });
        hidePromise.then((res, reg) => {
            for (let elem of elemsToShow) {
                $(elem).fadeTo(0.01, 0);
            }
            this.elem.querySelector('.line-last').classList.remove('minimize');
            return this.getFitToContentPromise({speed: 250});
        }).then((res,req) => {
            this.isMinimized = false;
            $(elemsToShow).fadeTo(250, 1);
        })
    }
    clear () {
        if (this.elem) {
            this.elem.remove();
        }
    }
    changeCar (carData) {
        this.carData = carData;
        if (this.elem) {
            this.changeResult();
        }
    }
    changeResult () {
        let hidePromise = new Promise((res, reg) => {
            //let elem = this.elem.querySelector('.calculator__price-content')
            $('.calculator__price-content').fadeTo(500, 0.01, ()=> {
                res();
            })
        });

        hidePromise.then(() => {
            return new Promise((res, reg) => {
                this.render('update');
                if (this.isMinimized) {
                    $(this.getExpandElements()).hide();
                    $(this.getMinimizeElements()).show();
                    this.elem.querySelector('.line-last').classList.add('minimize');
                }
                this.fitToContent({speed: 500});
                $('.calculator__price-content').fadeTo(500, 1, ()=> {
                    res();
                })
            })
        });
    }

    getCalculations (routeData) {
        let car = this.carData;
        let minOrderCost = car.minHours * car.hourCost;
        // Пропуска
        let mkadPassCost = (this.passes.mkad && !car.mkadPass) ? car.hourCost : 0;
        let ttkPassCost = this.passes.ttk && !car.ttkPass ? car.hourCost : 0;
        let skPassCost = this.passes.sk && !car.skPass ? car.hourCost : 0;
        let totalPassCost = mkadPassCost + ttkPassCost + skPassCost;

        if (routeData.distanceObl >= 350) { // Межгород
            let totalDistance = routeData.distanceMsk + routeData.distanceObl;
            let distanceCost = totalDistance * 2 * (car.kmCost + car.intercityPlus);

            return {
                type: 'intercity',
                typeRus: 'междугородняя',
                distanceCost: distanceCost,
                totalCost: distanceCost + totalPassCost,
                mkadPassCost: mkadPassCost,
                ttkPassCost: ttkPassCost,
                skPassCost: skPassCost,
                totalPassCost: totalPassCost
            }
        } else if (!routeData.distanceMsk) { // Нет пробега по Москве - первозка по области
            let distanceCost = routeData.distanceObl * 2 * car.kmCost;
            return {
                type: 'obl',
                typeRus: 'по области',
                distanceCost: distanceCost,
                minOrderCost: minOrderCost,
                totalCost: distanceCost + minOrderCost + totalPassCost,
                mkadPassCost: mkadPassCost,
                ttkPassCost: ttkPassCost,
                skPassCost: skPassCost,
                totalPassCost: totalPassCost
            }
        } else if (!routeData.distanceObl) { // Нет пробега вне Москвы - только почасовая тарификация
            let distanceCostMsk = routeData.distanceMsk > 100
                ? (routeData.distanceMsk - 100) * car.kmCost
                : 0;
            let feedCost = car.hourCost;
            let durationCost = routeData.durationMsk * car.hourCost;
            let waitCost = routeData.realPointsQuantity * car.hourCost;
            let totalCost = distanceCostMsk + feedCost + durationCost + waitCost > minOrderCost
                ? distanceCostMsk + feedCost + durationCost + waitCost
                : minOrderCost;
            return {
                type: 'msk',
                typeRus: 'по Москве',
                feedCost: feedCost,
                distanceCostMsk: distanceCostMsk,
                durationCost: durationCost,
                waitCost: waitCost,
                minOrderCost: minOrderCost,
                totalCost: totalCost + totalPassCost,
                mkadPassCost: mkadPassCost,
                ttkPassCost: ttkPassCost,
                skPassCost: skPassCost,
                totalPassCost: totalPassCost
            }
        } else { // Пробег и по Москве и по области, но не превышает 350 км от МКАД
            let distanceCostObl = routeData.distanceObl * 2 > 20
                    ? routeData.distanceObl * 2 * car.kmCost
                    : 0;
            let distanceCostMsk = routeData.distanceMsk > 100
                ? (routeData.distanceMsk - 100) * car.kmCost
                : 0;
            let feedCost = car.hourCost;
            let durationCost = routeData.durationMsk * car.hourCost;
            let waitCost = routeData.realPointsQuantity * car.hourCost;
            let totalCost = distanceCostMsk + feedCost + durationCost + waitCost > minOrderCost
                ? distanceCostMsk + feedCost + durationCost + waitCost + distanceCostObl
                : minOrderCost + distanceCostObl;

            return {
                type: 'mix',
                typeRus: 'по Москве и области',
                distanceCostObl: distanceCostObl,
                distanceCostMsk: distanceCostMsk,
                feedCost: feedCost,
                durationCost: durationCost,
                waitCost: waitCost,
                minOrderCost: minOrderCost,
                totalCost: totalCost + totalPassCost,
                mkadPassCost: mkadPassCost,
                ttkPassCost: ttkPassCost,
                skPassCost: skPassCost,
                totalPassCost: totalPassCost
            }
        }

        let distanceOblCost = routeData.distanceObl * 2 <= 20 ? 0 : routeData.distanceObl * 2 * car.kmCost;
        let distanceMskCost = 0;
        let durationMskCost = 0;
        let durationMskTrafficCost = 0; // Нужно ли?
        let feedCost = 0; // Цена подачи
    }

    /*  Возвращяет обобщёныне данные маршрута
     *  distanceObl - Общее расстояние вне МКАД
     *  distanceMsk - Общее расстояние внутри МКАД
     *  durationMsk - Общее время по Москве
     *  durationMskTraffic - Общее время по Москве с учётом пробок
    */
    getRouteGeneralData (params) {
        let distanceObl = 0;
        let distanceMsk = 0;
        let durationMsk = 0;
        let durationMskTraffic = 0;

        for (let path of params.pathsDescription) {
            if (path.type === 'obl') {
                distanceObl += parseInt(path.distance.value / 1000)
            } else if (path.type === 'msk') {
                distanceMsk += parseFloat(path.distance.text);
                durationMsk += parseFloat((path.duration.value / 60 / 60).toFixed(1));
                durationMskTraffic += parseFloat((path.durationInTraffic.value / 60 / 60).toFixed(1));
            }
        }

        // Округлить продолжительность (15 минут округляется до 1 часа)
        durationMsk = this.getRoundedDuration(durationMsk);
        durationMskTraffic = this.getRoundedDuration(durationMskTraffic);

        return {
            distanceObl: distanceObl,
            distanceMsk: distanceMsk,
            distanceTotal: distanceObl + distanceMsk,
            durationMsk: durationMsk,
            durationMskTraffic: durationMskTraffic,
            mkadPass: params.passes.mkad,
            ttkPass: params.passes.ttk,
            skPass: params.passes.sk
        }
    }
    getExpandElements () {
        return this.elem.querySelectorAll('.line, .expanded')
    }
    getMinimizeElements () {
        return this.elem.querySelectorAll('.minimized');
    }

    fitToContent (params) {
        let height = this.elem.querySelector('.calculator__price-content').offsetHeight;
        let anim = anime({
            targets: this.elem,
            height: params.height || height,
            duration: params.speed,
            delay: 0,
            easing: 'linear'
        });
    }
    getFitToContentPromise (params) {
        return new Promise ((res, reg) => {
            let height = this.elem.querySelector('.calculator__price-content').offsetHeight;
            let anim = anime({
                targets: this.elem,
                height: params.height || height,
                duration: params.speed,
                delay: 0,
                easing: 'linear',
                complete: () => {
                    res();
                }
            });
        })
    }
    getRoundedDuration (duration) {
        if (duration === 0) {
            return 0;
        }
        if (duration < 1) {
            return 1;
        }
        // Целая часть
        let int = parseInt(duration);

        // Десятичная часть
        let decimal = duration - Math.floor(duration);
        decimal = decimal > 0.15 ? 1 : 0;

        return int + decimal;
    }

    listenAnchorScroll () {
        let anchorScroll = new AnchorScroll();
    }
}

export {Price}