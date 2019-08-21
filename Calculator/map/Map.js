import css from './map.styl';

class Map {
    constructor(params) {
        this.designParams = params.designParams;
        this.zones = params.zones;
        this.render();
        this._tmpPlacemarks = []; // Ссылки на временные метки;
        this.routeObjects = []; // Хранилище ссылок на routeObjects
        this.pointObjs = []; // Хранилище ссылок на объекты опысывающие точки
        this.passes = []; // Нужны пропуска?
    }

    render() {
        let self = this;
        this.container = document.querySelector('.calculator__map');
        if (!this.container) {
            console.log('Нет контейнера карты');
            return false;
        }
        //this.adaptContainerHeight();

        let mkadCoords = this.getZoneCoordsByName('mkad')
        let ttkCoords = this.getZoneCoordsByName('ttk')
        let skCoords = this.getZoneCoordsByName('sk')

        // получаем координаты пользователя
        ymaps.geolocation.get({
            provider: 'yandex',
            mapStateAutoApply: true
        }).then(function (result) {
            let userGeoCoords = result.geoObjects.position;
            self.createMap(userGeoCoords);
            self.listen();
            self.setCursorCross();
            self.addMkadOuterPoligon(mkadCoords);
            self.add_TTK_poligon(ttkCoords);
            self.add_SK_poligon(skCoords);
            //self.createCustomPolygon();
        });
    }
    getZoneCoordsByName(name) {
        for (let i = 0, l = this.zones.length; i < l; i ++) {
            let zone = this.zones[i]
            if (zone.name === name) {
                return JSON.parse(zone.coords);
            }
        }
    }
    addMkadOuterPoligon (coords) {
        this.mkadOuterPoligon = new ymaps.Polygon(coords, {},{
            visible: false,
            //visible: true,
            fillOpacity: 0.35
        });
        this.ymap.geoObjects.add(this.mkadOuterPoligon);
    }
    add_TTK_poligon (coords) {
        this.TTK_poligon = new ymaps.Polygon(coords, {},{
            visible: false,
            fillOpacity: 0.5
        });
        this.ymap.geoObjects.add(this.TTK_poligon);
    }
    add_SK_poligon (coords) {
        this.SK_poligon = new ymaps.Polygon(coords, {},{
            visible: false,
            fillOpacity: 0.5
        });
        this.ymap.geoObjects.add(this.SK_poligon);
    }

    createMap (userGeoCoords) {
        // создаём карту по полученным координатам
        this.ymap = new ymaps.Map(this.container, {
            center: userGeoCoords,//userGeoCoords, //[55.73, 37.75]
            zoom: 10,
            controls: ['zoomControl']
        }, {
            searchControlProvider: 'yandex#search'
        });
    }

    listen () {
        this.ymap.events.add('click', this.handleMapClick, this);
        this.ymap.events.add('sizechange', ()=>{
            this.container.style.overflow = 'visible';
        })
    }

    handleMapClick (event) {
        let coords = event.get('coords');
        let detail = {coords: coords}
        this.container.dispatchEvent(new CustomEvent('map-click', {
            bubbles: true,
            detail: detail
        }));
    }
    addTempPlacemark (coords, color) {
        let placemark = new ymaps.Placemark(coords, {}, {
            // Задаем стиль метки (метка в виде круга).
            preset: "islands#circleDotIcon",
            // Задаем цвет метки (в формате RGB).
            iconColor: color//'#ff0000'
        });
        this.ymap.geoObjects.add(placemark);

        this._tmpPlacemarks.push(placemark)
    }

    createTmpRoute (points) {
        this.clearTmpRoute();
        this.tmpRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: points,
            params: {
                results: 1
            }
        }, {
            routeVisible: false
        });
        this.ymap.geoObjects.add(this.tmpRoute);
        this.tmpRoute.model.events.once("requestsuccess", this.onTmpRouteSuccess, this);
        this.setCursorDefault();
    }
    createRoute () {
        this.clearRoute();
        this.clearTmpRoute();

        let points = this.getPointsFromObj(this.pointObjs);

        this.route = new ymaps.multiRouter.MultiRoute({
            referencePoints: points,
            params: {
                results: 1
            }
        }, {
            routeVisible: false,
            routeStrokeWidth: 3,
            boundsAutoApply: true,
        });
        this.ymap.geoObjects.add(this.route);
        this.route.model.events.once("requestsuccess", this.onRouteSuccess, this);
        this.setCursorDefault();
    }

    onTmpRouteSuccess () {
        this.pointObjs = []; // Очищаем хранилище
        this.passes = [];
        let route = this.tmpRoute.getActiveRoute(); // Берём активный маршрут
        let paths = route.model.getPaths(); // Его отрезки
        let newPoints = []; // Новые точки для маршрута с учётом точек пересечения МКАД (если они есть)

        for (let i = 0, l = paths.length; i < l; i++) {
            let routeObjects = this.getRouteObjectsFromPath(paths[i]);
            routeObjects.addToMap(this.ymap);

            this.routeObjects.push(routeObjects);

            // Первая и послелдняя точки
            let routeObjectsLength = routeObjects.getLength();
            let firstObjectCoords = routeObjects.get(0).geometry.getCoordinates()[0];
            let lastObjectCoords = routeObjects.get(routeObjectsLength - 1).geometry.getCoordinates()[1];

            // Части участка внутри МКАД
            let mkadObjects = routeObjects.searchIntersect(this.mkadOuterPoligon);
            let regularObjects = routeObjects.remove(mkadObjects);

            // Стилизуем
            mkadObjects.setOptions({
                strokeColor: this.designParams.mkadRouteColor,
                strokeWidth: 3
            });
            regularObjects.setOptions({
                strokeColor: this.designParams.regularRouteColor,
                strokeWidth: 3
            });


            // Есть часть участка маршрута проходит внутри МКАД
            if (mkadObjects.getLength()) {
                // Пропуски:
                this.passes.mkad = true;
                // Части участка внутри ТТК
                let ttkObjects = routeObjects.searchIntersect(this.TTK_poligon);
                if (ttkObjects.getLength()) {
                    this.passes.ttk = true;
                }
                // Части участка внутри СК
                let skObjects = routeObjects.searchIntersect(this.SK_poligon);
                if (skObjects.getLength()) {
                    this.passes.sk = true;
                }

                // Точки внутри МКАД или снаружи
                let firstPointIsInMoscow = this.isPointInMoscow(firstObjectCoords); // Первая точка в МКАД?
                let lastPointIsInMoscow = this.isPointInMoscow(lastObjectCoords); // Последняя точка в МКАД?

                let lastBoundaryIndex = mkadObjects.getLength() - 1;
                let firstBoundaryCoords = mkadObjects.get(0).geometry.getCoordinates()[0];
                let lastBoundaryCoords = mkadObjects.get(lastBoundaryIndex).geometry.getCoordinates()[1];


                if (firstPointIsInMoscow && lastPointIsInMoscow) {
                    /** Всё внутри МКАД
                     *  Участок начинается и завершается внутри МКАД
                     *  Пересечения нет.
                     */

                    // Первая точка
                    newPoints.push({
                        coords: firstObjectCoords,
                        type: 'msk'
                    });
                } else if (!firstPointIsInMoscow && !lastPointIsInMoscow) {
                    /** Обе точки вне МКАД
                     *  Начинается за МКАД и заканчивается за МКАД.
                     *  Два пересечения:
                     *  Первое - первый участок первый координат
                     *  Второе - последний участок второй координат
                     */

                    // Первая точка
                    newPoints.push({
                        coords: firstObjectCoords,
                        type: 'obl'
                    });

                    // Заезд в МКАД
                    newPoints.push({
                        coords: firstBoundaryCoords,
                        type: 'mkad'
                    });

                    // Съезд со МКАД
                    newPoints.push({
                        coords: lastBoundaryCoords,
                        type: 'mkad'
                    });
                } else if (firstPointIsInMoscow && !lastPointIsInMoscow) {
                    /** Выехали из МКАД
                     *  Начинается внутри МКАД и заканчивается за МКАД
                     *  Пересечение в последнем участке последний координат
                     */

                    // Первая точка
                    newPoints.push({
                        coords: firstObjectCoords,
                        type: 'msk'
                    });

                    // Выезд из МКАД
                    newPoints.push({
                        coords: lastBoundaryCoords,
                        type: 'mkad'
                    });
                } else if (!firstPointIsInMoscow && lastPointIsInMoscow) {
                    /** Заехали в МКАД
                     *  Начинается за МКАД и заканчивается внутри МКАД
                     *  Пересечение в первом участоке првый координат
                     *  */

                    // Первая точка
                    newPoints.push({
                        coords: firstObjectCoords,
                        type: 'obl'
                    });

                    // Заезд в МКАД
                    newPoints.push({
                        coords: firstBoundaryCoords,
                        type: 'mkad'
                    });
                }

                // Добавляем последнюю точку участка, если он последний.
                let lastPointType = lastPointIsInMoscow ? 'msk' : 'obl';
                if (i == l - 1) {
                    newPoints.push({
                        coords: lastObjectCoords,
                        type: lastPointType
                    });
                }
            } else {
                newPoints.push({
                    coords: firstObjectCoords,
                    type: 'obl'
                });
                newPoints.push({
                    coords: lastObjectCoords,
                    type: 'obl'
                });
            }
        }
        this.pointObjs = newPoints;
        this.createRoute()

        this.removeTempPlacemarks();
    }
    onRouteSuccess () {
        this.removeTempPlacemarks();
        this.colorMkadPoints();
        this.calculateRoute();
    }

    clearTmpRoute () {
        if (this.tmpRoute) {
            this.ymap.geoObjects.remove(this.tmpRoute);
        }
    }
    clearRoute () {
        if (this.route) {
            this.ymap.geoObjects.remove(this.route);
            // todo this.disableResetButton();
        }
    }
    clearRouteObjects () {
        for (let object of this.routeObjects) {
            object.removeFromMap(this.ymap);
        }
        this.routeObjects = [];
    }

    setCursorCross () {
        if (!this._cursor) {
            this._cursor = this.ymap.cursors.push('crosshair');
        } else {
            this._cursor.setKey('crosshair');
        }
    }
    setCursorDefault () {
        this._cursor.setKey('grab');
    }
    removeTempPlacemarks () {
        for (let placemark of this._tmpPlacemarks) {
            this.ymap.geoObjects.remove(placemark);
        }

    }
    colorMkadPoints () {
        for (let i = 0, l = this.pointObjs.length; i < l; i++) {
            let point = this.pointObjs[i];
            if (point.type !== 'mkad') {
                continue;
            }
            let mkadPoint = this.route.getWayPoints().get(i);
            mkadPoint.options.set({
                preset: "islands#grayCircleDotIcon"
            });
        }
    }
    calculateRoute () {
        let route = this.route.getActiveRoute();
        let paths = route.model.getPaths();
        let wayPoints = this.route.getWayPoints();

        let pointType;
        let wayPoint;
        let pathsDescription = [];
        let realPointsQuantity = 0; // Количество "ностоящих" точек
        let passes = {
            mkad: null,
            ttk: null,
            sk: null
        };

        for (let i = 0, l = this.pointObjs.length; i < l; i++) {
            let point = this.pointObjs[i];
            let newPointType = point.type;
            let newWayPoint = wayPoints.get(i);

            if (i === 0 ) {
                pointType = newPointType;
                wayPoint = newWayPoint;
                realPointsQuantity++;
                continue;
            }


            if (pointType === 'msk' || pointType === 'obl') {
                realPointsQuantity++;
            }

            let path = paths[i-1];

            if ((pointType === 'msk' || pointType === 'mkad') &&
                (newPointType === 'msk' || newPointType === 'mkad')) {
                pathsDescription.push({
                    type: 'msk',
                    duration: path.properties.get('duration'),
                    durationInTraffic: path.properties.get('durationInTraffic'),
                    distance: path.properties.get('distance')
                })
            } else if ((pointType === 'obl' || pointType === 'mkad') &&
                        (newPointType === 'obl' || newPointType === 'mkad')) {
                pathsDescription.push({
                    type: 'obl',
                    duration: null,
                    durationInTraffic: null,
                    distance: path.properties.get('distance')
                })
            }
            
            pointType = newPointType;
            wayPoint = newWayPoint
        }

        this.container.dispatchEvent(new CustomEvent('route-create', {
            bubbles: true,
            detail: {
                pathsDescription: pathsDescription,
                realPointsQuantity: realPointsQuantity,
                passes: this.passes
            }
        }));
    }
    fitToViewport () {
        if (parseInt(getComputedStyle(this.container, '').height) < 3) {
            this.container.style.height = this.container.clientWidth + 'px';
        }

        let self = this;
        setTimeout(function fit() {
            if (self.ymap) {
                self.ymap.container.fitToViewport();
            } else {
                setTimeout(fit, 100);
            }
        }, 0)
    }
    handleOrientationchange () {
        this.container.style.overflow = 'hidden';
        this.fitToViewport();
    }

    getRouteObjectsFromPath (path) {
        let segments = path.getSegments();
        let coords = this.getSegmentsCoords(segments); // Все координаты сегментов пути
        let edges = this.getEdgesFromCoords(coords); // Отрезки по координатам
        let routeObjects = ymaps.geoQuery(edges); // Создаём объекты
        return routeObjects;
    }
    getSegmentsCoords (segments) {
        // Все координаты в один массив
        let coords = [];

        for (let segment of segments) {
            coords = coords.concat(segment.geometry.getCoordinates())
        }
        return coords;
    }
    getEdgesFromCoords (coords) {
        // Собираем участки путей по координатам
        let edges = [];
        for (let i = 1, l = coords.length; i < l; i++) {
            edges.push({
                type: 'LineString',
                coordinates: [coords[i], coords[i - 1]]
            });
        }
        return edges;
    }

    getPointsFromObj(pointsObj) {
        let points = []
        for (let point of pointsObj) {
            points.push(point.coords);
        }
        return points;
    }

    /*isPointsCoordsHaveMoscow (pointsCoords) {
        let coords = pointsCoords;
        for (let coord of coords) {
            if (this.isPointInMoscow(coord)) {
                return true;
            }
        }
        return false;
    }*/
    isPointInMoscow (coords) {
        if (this.mkadOuterPoligon.geometry.contains(coords)) {
            return true;
        }
        return false;
    }
    createCustomPolygon () {
        /*this.tmp_polygon.push(coords)
        let placemark = new ymaps.Placemark(coords, {}, {
            // Задаем стиль метки (метка в виде круга).
            preset: "islands#circleDotIcon",
            // Задаем цвет метки (в формате RGB).
            iconColor: '#00ff00'
        });
        this._map.geoObjects.add(placemark);
        console.log(JSON.stringify(this.tmp_polygon))*/
        // Создаем многоугольник без вершин.

        let coords = []

        var myPolygon = new ymaps.Polygon(coords, {}, {
            // Курсор в режиме добавления новых вершин.
            editorDrawingCursor: "crosshair",
            // Максимально допустимое количество вершин.
            editorMaxPoints: 999999,
            // Цвет заливки.
            fillColor: '#00FF00',
            fillOpacity: 0.3,
            // Цвет обводки.
            strokeColor: '#0000FF',
            // Ширина обводки.
            strokeWidth: 2
        });
        // Добавляем многоугольник на карту.
        this.ymap.geoObjects.add(myPolygon);
        // В режиме добавления новых вершин меняем цвет обводки многоугольника.
        var stateMonitor = new ymaps.Monitor(myPolygon.editor.state);
        stateMonitor.add("drawing", function (newValue) {
            myPolygon.options.set("strokeColor", newValue ? '#FF0000' : '#0000FF');
        });

        // Включаем режим редактирования с возможностью добавления новых вершин.
        myPolygon.editor.startDrawing();

        let calculator__params = document.querySelector('.calculator');
        let button = document.createElement('div');
        button.innerHTML = 'Получить координаты полигона';
        calculator__params.appendChild(button)

        button.addEventListener('click', event => {
            let coords = myPolygon.geometry.getCoordinates()
            console.log(JSON.stringify(coords))
        })

    }
}

export {Map}