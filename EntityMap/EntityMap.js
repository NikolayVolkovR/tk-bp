

class EntityMap {
    constructor ({container = document.querySelector('.entityMap'), zones = []} = {}) {
        this.container = container;
        this.zones = zones;
        this.init();
    }
    init() {
        if (!this.container) {
            return false;
        }
        ymaps.ready(this.render.bind(this));
    }
    render() {
        this.createMap();
        this.addZones();
    }
    createMap () {
        this.ymap = new ymaps.Map(this.container, {
            center: [55.76, 37.64],
            zoom: 8,
            controls: ['smallMapDefaultSet']
        }, {
            searchControlProvider: 'yandex#search'
        });
    }
    addZones() {
        /*let coords = JSON.parse(this.zones[1].coords);

        let innercoords = JSON.parse(this.zones[0].coords)[0];
        coords.push(innercoords);

        this.addPolygon({coords: coords, color: '#cccccc'})*/

        for (let i = 0, l = this.zones.length; i < l; i++) {
            let zone = this.zones[i];
            let coords = JSON.parse(zone.coords);
            if (i !== 0) {
                let innerCoords = JSON.parse(this.zones[i-1].coords)[0];
                coords.push(innerCoords);
            }
            this.addPolygon({coords: coords, color: zone.color})
        }


        /*for(let zone of this.zones) {
            this.addPolygon({coords: JSON.parse(zone.coords), color: zone.color});
        }*/
    }
    addPolygon({coords = [], color = '#ccc'}) {
        let polygon = new ymaps.Polygon(coords, {
            //balloonContent: "Многоугольник"
        }, {
            fillColor: color,
            fillOpacity: 0.5,
            strokeWidth: 0
        });

        this.ymap.geoObjects.add(polygon);
        //polygon.balloon.open();
    }
}

export {EntityMap}