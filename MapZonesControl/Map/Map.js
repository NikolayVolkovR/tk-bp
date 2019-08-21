
class Map {
    constructor() {
        this.render()
    }

    render() {
        this.elem = document.createElement('div');
        this.elem.classList.add('zones-control__map');

        this.ymap = new ymaps.Map(this.elem, {
            center: [55.76, 37.64],
            zoom: 9,
            controls: ['zoomControl']
        }, {
            searchControlProvider: 'yandex#search'
        });
    }

    getElem() {
        return this.elem;
    }

    handleItemClick(params) {
        let item = params.item,
            isOpened = params.isOpened;
        if (isOpened) {
            this.removePolygon();
        } else {
            this.createPolygon({coords: item.coords, fillColor: item.color});
        }
    }

    createPolygon({coords = [], fillColor = ''}) {
        if (this.polygon) {
            this.removePolygon();
        }
        this.polygon = new ymaps.Polygon(coords, {}, {
            // Курсор в режиме добавления новых вершин.
            editorDrawingCursor: "crosshair",
            // Максимально допустимое количество вершин.
            editorMaxPoints: 999999,
            // Цвет заливки.
            fillColor: fillColor,
            fillOpacity: 0.3,
            // Цвет обводки.
            strokeColor: '#0000FF',
            // Ширина обводки.
            strokeWidth: 2
        });

        // Добавляем многоугольник на карту.
        this.ymap.geoObjects.add(this.polygon);
        // Включаем режим редактирования с возможностью добавления новых вершин.
        this.polygon.editor.startDrawing();

        this.polygon.geometry.events.add('change', () => {
            this.elem.dispatchEvent(new CustomEvent('polygon-change', {bubbles: true}))
        });
    }
    changePolygonColor(params) {
        this.polygon.options.set("fillColor", params.color);
    }
    removePolygon() {
        this.ymap.geoObjects.remove(this.polygon);
    }
    getCoords() {
        return this.polygon.geometry.getCoordinates();
    }
}
export {Map}


/*

createCustomPolygon () {
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
*/
