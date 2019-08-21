import {Item} from './Item/Item'

class Menu {
    constructor({data={}, urlPrefix =''}) {
        this.data = data;
        this.urlPrefix = urlPrefix;
        this.items = [];

        this.render();
        this.listen();
    }

    render() {
        this.elem = document.createElement('div');
        this.elem.classList.add('zones-control__menu');

        this.createButton = document.createElement('div');
        this.createButton.classList.add('zones-control__createButton');
        this.createButton.innerHTML = 'Создать';

        this.elem.append(this.createButton);

        this.renderItems();

        this.saveButton = document.createElement('div');
        this.saveButton.classList.add('zones-control__saveButton');
        this.saveButton.innerHTML = 'Сохранить';
        this.elem.append(this.saveButton);
    }
    listen() {
        this.createButton.addEventListener('click', this.handleCreateButtonClick.bind(this));
        this.saveButton.addEventListener('click', this.handleSaveButtonClick.bind(this));
    }
    handleSaveButtonClick() {
        if (!this.isSavingEnable()) {
            return false;
        }
        this.elem.dispatchEvent(new CustomEvent('save-button-click', {bubbles: true}));
    }
    handleCreateButtonClick() {
        this.createSection = this.getCreateSection();
        this.createSectionInput = this.createSection.querySelector('input');

        this.elem.insertBefore(this.createSection, this.itemsElem);
        this.createSectionInput.focus();
    }
    handleSaveCreatedItemClick() {
        let name = this.createSectionInput.value;
        if (!name) {
            return false;
        }
        this.saveCreatedItem(name);
    }
    saveCreatedItem(value) {
        let zone = {name: value, color: '#cccccc', coords: []};
        let sending = new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let name = encodeURIComponent(zone.name),
                color  = encodeURIComponent(zone.color),
                coords = JSON.stringify(zone.coords),
                data = csrfParam + '=' + csrfToken
                    +'&name=' + name
                    +'&color=' + color
                    +'&coords=' + coords;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.urlPrefix + '/geo/map-zone/create');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(data);
            xhr.onload = function(){
                if (xhr.status != 200) {
                    reject( xhr.status + ': ' + xhr.statusTex );
                } else {
                    resolve( xhr.responseText );
                }
            };
        });
        sending.then((data)=>{
            if (JSON.parse(data).success) {
                this.elem.dispatchEvent(new CustomEvent('zone-created', {
                    bubbles: true,
                    detail: {zone: zone}
                }));
                this.createSection.remove();
                this.addItem(zone);
            } else {
                console.log(JSON.parse(data))
            }
        })
    }
    getCreateSection() {
        let elem = document.createElement('div');
        elem.classList.add('zones-control__createSection');

        let input = document.createElement('input');
        let button = document.createElement('button');
        button.innerHTML = 'Сохранить';

        button.addEventListener('click', this.handleSaveCreatedItemClick.bind(this));

        elem.append(input);
        elem.append(button);
        return elem;
    }
    renderItems() {
        this.itemsElem = document.createElement('div');
        this.itemsElem.classList.add('zones-control__menuItems');
        this.elem.append(this.itemsElem);

        for (let zone of this.data.zones) {
            let item = new Item({name: zone.name, color: zone.color, coords: zone.coords, urlPrefix: this.urlPrefix});
            this.itemsElem.append(item.getElem());

            this.items.push(item);
        }
    }
    addItem(zone){
        let item = new Item({name: zone.name, color: zone.color, coords: zone.coords, urlPrefix: this.urlPrefix});
        this.items.push(item);
        this.itemsElem.append(item.getElem());
    }
    enableSaveButton() {
        this.saveButton.classList.add('enable');
    }
    disableSaveButton() {
        this.saveButton.classList.remove('enable');
    }
    getElem() {
        return this.elem;
    }
    closeItems() {
        for(let item of this.items) {
            item.close();
        }
    }
    isSavingEnable() {
        return this.saveButton.classList.contains('enable')
    }
}


export {Menu}