import css from './mapZonesControl.styl';
import {Menu} from "./Menu/Menu"
import {Map} from './Map/Map';

class MapZonesControl {
    constructor({zones = [], urlPrefix = ''}={}) {
        this.data = {
            zones: zones
        };
        this.urlPrefix = urlPrefix;
        this.map = new Map();
        this.menu = new Menu({data:this.data, urlPrefix: urlPrefix});

        this.render();
        this.listen();
    }

    render() {
        this.elem = document.createElement('div');
        this.elem.classList.add('zones-control');

        ymaps.ready(()=>{
            this.elem.append(this.map.getElem());
            this.elem.append(this.menu.getElem());
        });
    }

    listen() {
        this.elem.addEventListener('menu-item-name-click', this.handleMenuItemNameClick.bind(this));
        this.elem.addEventListener('save-button-click', this.handleMenuSaveClick.bind(this));
        this.elem.addEventListener('zone-created', this.handleZoneCreated.bind(this));
        this.elem.addEventListener('item-color-changed', this.handleItemColorChanged.bind(this));
        this.elem.addEventListener('polygon-change', this.handlePolygonChange.bind(this));
    }

    handleMenuItemNameClick(event) {
        let item = event.detail.item,
            isOpened = event.detail.isOpened;

        this.setActiveItem(item, isOpened);
        this.menu.closeItems();
        this.menu.enableSaveButton();

        item.openOrClose(isOpened);

        this.map.handleItemClick({item: item, isOpened: isOpened});
    }
    handleMenuSaveClick(event) {
        this.menu.disableSaveButton();
        let coords = this.map.getCoords();
        if(this.activeItem) {
            this.activeItem.saveCoords(coords);
        }
    }
    handleZoneCreated(event) {
        let zone = event.detail.zone;
        this.data.zones.push(zone);

    }
    handleItemColorChanged(event) {
        let item = event.detail.item;
        this.map.changePolygonColor({color: item.color});
    }
    handlePolygonChange(event) {
        this.menu.enableSaveButton();
    }
    setActiveItem(item, isOpened) {
        if (isOpened) {
            this.activeItem = null;
        } else {
            this.activeItem = item;
        }
    }
    getElem() {
        return this.elem;
    }
}
export {MapZonesControl}