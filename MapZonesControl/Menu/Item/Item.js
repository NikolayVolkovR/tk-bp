import template from './template.pug';
import Picker from 'vanilla-picker';

class Item {
    constructor({name = 'Название', coords = [], color = '#ccc', urlPrefix = ''}) {
        this.name = name;
        this.color = color;
        this.coords = Array.isArray(coords) ? coords : JSON.parse(coords);
        this.urlPrefix = urlPrefix;

        this.render();
        this.listen();
    }

    render() {
        let tmp = document.createElement('div');
        tmp.innerHTML = template({
           name: this.name,
           color: this.color
        });

        this.elem = tmp.firstElementChild;

        this.nameElem = this.elem.querySelector('.zones-control__menuItemName');
        this.inputElem = this.elem.querySelector('.zones-control__menuItemInput');
        this.colorElem = this.elem.querySelector('.zones-control__menuItemColor');
        this.picker = new Picker({
            parent: this.colorElem,
            color: this.color,
            popup: 'left'
        });
    }

    listen() {
        this.nameElem.addEventListener('click', this.handleNameClick.bind(this));
        this.inputElem.addEventListener('keypress', this.handleInputKeypress.bind(this));
        this.inputElem.addEventListener('blur', this.handleInputBlur.bind(this));
        this.picker.onChange = (color) => {
            this.colorElem.style.background = color.rgbaString;
        };
        this.picker.onClose = (color) => {
            this.colorElem.style.background = this.color;
        };
        this.picker.onDone = (color) => {
            this.changeColor(color.rgbaString);
        };
    }

    handleNameClick() {
        this.elem.dispatchEvent(new CustomEvent('menu-item-name-click', {
            bubbles: true,
            detail: {
                item: this,
                isOpened: this.isOpened()
            }
        }))
    }
    handleInputBlur() {
        let value = this.inputElem.value;
        if (value) {
            this.changeName(value);
        }
    }
    handleInputKeypress(event) {
        const key = event.which || event.keyCode;
        if (key === 13) {
            this.inputElem.blur();
        }
    }

    changeName(value) {
        let sending = new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let newValue = encodeURIComponent(value),
                name = encodeURIComponent(this.name),
                data = csrfParam + '=' + csrfToken
                    +'&value=' + newValue
                    +'&name=' + name;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.urlPrefix + '/geo/map-zone/name-change');
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
                this.setName(value);
                this.inputElem.value = '';
            } else {
                console.log(JSON.parse(data))
            }
        })
    }
    changeColor(value) {
        let sending = new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let newValue = encodeURIComponent(value),
                name = encodeURIComponent(this.name),
                data = csrfParam + '=' + csrfToken
                    +'&value=' + newValue
                    +'&name=' + name;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.urlPrefix + '/geo/map-zone/color-change');
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
                this.setColor(value);
                this.elem.dispatchEvent(new CustomEvent('item-color-changed', {bubbles: true, detail: {item: this}}))
            } else {
                console.log(JSON.parse(data))
            }
        })
    }
    saveCoords(coords) {
        let value = JSON.stringify(coords);

        let sending = new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let name = encodeURIComponent(this.name),
                data = csrfParam + '=' + csrfToken
                    +'&value=' + value
                    +'&name=' + name;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.urlPrefix + '/geo/map-zone/coords-save');
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
                this.coords = coords;
            } else {
                console.log(JSON.parse(data))
            }
        })
    }
    setName(value) {
        this.name = value;
        this.nameElem.innerHTML = value;
    }
    setColor(value) {
        this.color = value;
        this.colorElem.style.background = value;
    }
    getElem() {
        return this.elem;
    }

    close() {
        if (!this.isOpened()) {
            return false;
        }
        this.elem.classList.remove('opened');
    }
    open() {
        if (this.isOpened()) {
            return false;
        }
        this.elem.classList.add('opened');
    }
    openOrClose(isOpened) {
        if (isOpened){
            this.close()
        } else {
            this.open()
        }
    }

    isOpened() {
        return this.elem.classList.contains('opened');
    }
}

export {Item}