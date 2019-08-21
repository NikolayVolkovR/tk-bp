'use strict';
import css from './calculator.styl';
import template from './calculator.pug';
//import {Params} from './params/params';
import {Support} from '../Support';
import {Inputs} from './inputs/Inputs.js';
import {Map} from './map/Map.js';
import {Cars} from './cars/Cars.js';
import {Price} from './price/Price.js';
import {ZoneReader} from '../readers/ZoneReader';
import anime from 'animejs';
//import {Preloader} from '../Preloader/Preloader';
class Calculator {
    constructor (params) {
        this.support = new Support();
        this.click_or_touch = 'click';//this.support.isMobile ? 'touchstart' : 'click';
        this.points = []; // Адреса точек
        this.pointsCoords = []; // Коодринаты точек
        this.init();
        this.designParams = {
            regularRouteColor: '#0010ff',
            mkadRouteColor: '#06ff00'
        };
        this.carNumber = 0;
        this.carsData = params.cars;
    }

    init () {
        /*Если контейнер существует, дожидаемся загрузки Яндекс карт и рендерим калькулятор*/
        let container = document.querySelector('.calculator__wrap');
        if (container) {
            let zonesPromise = ZoneReader.getCalculator();
            zonesPromise.then((data) => {
                this.zones = JSON.parse(data);
                this._container = container;
                ymaps.ready(this.render.bind(this));
            });
        }
    }

    render () {
        let tmp = document.createElement('div');
        tmp.innerHTML = template();

        this._container.append(tmp.firstElementChild);

        this.map = new Map({
            designParams: this.designParams,
            zones: this.zones
        });
        this.inputs = new Inputs({
            support: this.support,
            click_or_touch: this.click_or_touch
        });

        let carsContainer = this._container.querySelector('.calculator__cars');
        this.cars = new Cars({
            container: carsContainer,
            click_or_touch: this.click_or_touch,
            carsData: this.carsData,
            carNumber: this.carNumber
        });
        this.map.fitToViewport();

        let priceContainer = this._container.querySelector('.calculator__map');
        this.price = new Price({
            container: priceContainer,
            click_or_touch: this.click_or_touch
        });

        this.listen();

        /*this.preloader = new Preloader();
        this._container.querySelector('.calculator').append(this.preloader.getElem());
        this.preloader.run();*/
    }

    listen () {
        this._container.addEventListener('input-suggest-select', (event) => {
            this.processCreateRoute();
        });
        this._container.addEventListener('route-create', (event) => {
            //this.preloader.stop();
            let pathsDescription = event.detail.pathsDescription;
            let realPointsQuantity = event.detail.realPointsQuantity;
            let scrollPromise = this.scrollWindowToCenterMap();
            scrollPromise.then(() => {
                this.price.show({
                    pathsDescription: pathsDescription,
                    realPointsQuantity: realPointsQuantity,
                    carData: this.carsData[this.carNumber],
                    passes: event.detail.passes
                });
            });
            this.inputs.enableResetButton();
        });
        this._container.addEventListener('reset-route-click', (event) => {
            this.inputs.clear();
            this.map.clearRoute();
            this.map.clearTmpRoute();
            this.map.clearRouteObjects();
            this.map.setCursorCross();
            this.price.clear();
        });
        this._container.addEventListener('add-point-input', (event) => {
            this.map.setCursorCross();
        });
        this._container.addEventListener('map-click', (event) => {
            let coords = event.detail.coords;
            this.inputs.handleMapClick(coords);
        });
        this._container.addEventListener('add-tmp-placemark', (event) => {
            let coords = event.detail.coords;
            let color = event.detail.color;

            this.map.addTempPlacemark(coords, color);
            this.handleMapCursor();
            this.processCreateRoute();
        });
        this._container.addEventListener('car-change', (event) => {
            this.carNumber = event.detail.carNumber;
            this.price.changeCar(this.carsData[this.carNumber]);
        });

        this._container.addEventListener('input-cross-click', (event) => {
            this.map.setCursorCross();
            this.processCreateRoute();

            let self = this;
            setTimeout(function() {
                //self.processCreateRoute();
            }, 0)
        });
        window.addEventListener('orientationchange', this.handleOrientationchange.bind(this));
    }
    handleOrientationchange () {
        this.map.handleOrientationchange();
    }
    processCreateRoute () {
        this.price.clear();
        if (!this.inputs.isCreateRouteAvaliable()) {
            return false;
        }
        //this.preloader.run();
        this.map.clearRouteObjects();
        this.points = this.inputs.getPoints();
        this.map.createTmpRoute(this.points);

        /*
        let coordsPromise = this.getCoordsPromiseAll();
        coordsPromise.then(value => {
            this.pointsCoords = this.getCoordsFromPromiseAll(value);
            if (this.map.isPointsCoordsHaveMoscow(this.pointsCoords)) { // Одна из точек в Москве
                this.createTmpRoute(); // Временный невидимый маршрут
            } else {
                this.map.createRoute(this.points);
            }
        });
        */
    }

    scrollWindowToCenterMap( ) {
        return new Promise((resolve,reject) => {
            let element = this._container.querySelector('.calculator__map');
            let elementHeight = element.clientHeight;
            let elementPageY = this.getCoords(element).top;
            let scrollToElementCenter = elementPageY - 40;// + elementHeight / 2;

            $('html, body').animate({
                scrollTop: scrollToElementCenter
            }, 1000, function() {
                resolve()
            });
        });

    }
    getCoords (elem) { // todo вынести в Support
        let box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    getCoordsPromiseAll () {
        let promises = []
        for (let point of this.points) {
            let promise = ymaps.geocode(point, {
                results: 1
            });
            promises.push(promise)
        }
        return Promise.all(promises);
    }
    getCoordsFromPromiseAll (values) {
        let coordsArr = [];
        for (let value of values) {
            let firstGeoObject = value.geoObjects.get(0);
            let coords = firstGeoObject.geometry.getCoordinates();
            coordsArr.push(coords);
        }
        return coordsArr;
    }
    handleMapCursor () {
        if (this.inputs.getEmptyInput()) {
            this.map.setCursorCross()
        } else {
            this.map.setCursorDefault();
        }
    }
    setCars(cars) {
        this.carsData = cars;
        this.cars.setCars(cars);
    }
}

export {Calculator};