import css from './order.styl';

import {Input} from "./Input/Input"
import {Button} from "./Button/Button"
import {ModalWindow} from "../ModalWindow/ModalWindow"
import succesTemplate from './templates/succesTemplate.pug';
import falseTemplate from './templates/falseTemplate.pug';

class OrderWindow {
    constructor (params = {}) {
        this.className = params.className;
        this.photoSrc = params.photoSrc;
        this.photoName = params.photoName;
        this.dataOrderType = params.dataOrderType;

        this.modalWindow = new ModalWindow({
            content: this.getContent(),
            windowWidth: 0
        });
        this.testModal = new ModalWindow();
        this.modalWindow.fire();
        this.listen();
    }

    getContent() {
        return this.createTemplate()
    }

    createTemplate() {
        this.container = this.createContainer();
        this.header = this.createHeader();
        this.subHeader = this.createSubheader();
        this.phoneInput = new Input({
            type: Input.TYPE_PHONE(),
            className: this.className + '__input',
            placeHolder: 'Телефон'
        });
        this.nameInput = new Input({
            type: Input.TYPE_REGULAR(),
            className: this.className + '__input',
            placeHolder: 'Ваше имя'
        });
        if (this.photoSrc) {
            this.carBlock = this.createCar();
        }
        this.button = new Button({className: this.className + '__button'});


        this.container.append(this.header);
        if (this.photoSrc) {
            this.container.append(this.carBlock);
        }
        this.container.append(this.subHeader);
        this.container.append(this.phoneInput.getElem());
        this.container.append(this.nameInput.getElem());
        this.container.append(this.button.getElem());

        return this.container;

        /*if (!this.photoSrc) {
            return this.createSimpleTemplate()
        } else {
            return this.createRegularTemplate()
        }*/
    }
    createSimpleTemplate() {
        this.container = this.createContainer();
        this.header = this.createHeader('Просто заказать машину');
        this.subHeader = this.createSubheader();
        this.phoneInput = new Input({
            type: Input.TYPE_PHONE(),
            className: this.className + '__input',
            placeHolder: 'Телефон'
        });
        this.nameInput = new Input({
            type: Input.TYPE_REGULAR(),
            className: this.className + '__input',
            placeHolder: 'Ваше имя'
        });
        this.button = new Button({className: this.className + '__button'});

        this.container.append(this.header);
        this.container.append(this.subHeader);
        this.container.append(this.phoneInput.getElem());
        this.container.append(this.nameInput.getElem());
        this.container.append(this.button.getElem());
        return this.container;
    }
    createRegularTemplate() {
        this.container = this.createContainer();
        this.header = this.createHeader();
        this.subHeader = this.createSubheader();
        this.phoneInput = new Input({
            type: Input.TYPE_PHONE(),
            className: this.className + '__input',
            placeHolder: 'Телефон'
        });
        this.nameInput = new Input({
            type: Input.TYPE_REGULAR(),
            className: this.className + '__input',
            placeHolder: 'Ваше имя'
        });
        this.carBlock = this.createCar();
        this.button = new Button({className: this.className + '__button'});

        this.container.append(this.header);
        this.container.append(this.carBlock);
        this.container.append(this.subHeader);
        this.container.append(this.phoneInput.getElem());
        this.container.append(this.nameInput.getElem());
        this.container.append(this.button.getElem());

        return this.container;
    }
    createContainer() {
        let elem = document.createElement('div');
        elem.classList.add(this.className);
        return elem;
    }
    createCar() {
        let elem = document.createElement('div');
        elem.classList.add(this.className + '__car');

        let photo = document.createElement('img');
        photo.src = this.photoSrc;

        let carName = document.createElement('div');
        carName.innerHTML = this.photoName;

        elem.append(photo);
        elem.append(carName);
        if (this.dataOrderType) {
            let orderType = document.createElement('div');
            orderType.innerHTML = '"' + this.dataOrderType + '"';
            elem.append(orderType);
        }

        return elem;
    }

    enableSending() {
        this.button.setEnable();
    }
    disableSending() {
        this.button.setDisable();
    }
    handlePhoneInputKeydown() {
        if (this.phoneInput.isComplete()) {
            this.enableSending();
        } else {
            this.disableSending()
        }
    }
    handleSendButtonClick() {
        let phone = this.phoneInput.elem.value;
        let name = this.nameInput.elem.value;

        this.sendData({
            phone: phone,
            name: name,
            carPhoto: this.photoSrc,
            carName: this.photoName,
            orderType: this.dataOrderType,
        });
    }

    sendData(params) {
        let sending = new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let name = encodeURIComponent(params.name),
                phone = encodeURIComponent(params.phone),
                carPhoto = encodeURIComponent(params.carPhoto),
                carName = params.carName ? encodeURIComponent(params.carName) : '',
                orderType = params.orderType ? encodeURIComponent(params.orderType) : '';

            let data = csrfParam + '=' + csrfToken
                +'&phone=' + phone
                +'&name=' + name
                +'&carPhoto=' + carPhoto
                +'&carName=' + carName
                +'&orderType=' + orderType;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/car/order');
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

        sending.then(data => {
            let response = JSON.parse(data);
            if (response.success) {
                this.modalWindow.close();
                this.informSuccess();
            } else {
                this.modalWindow.close();
                this.informFalse();
            }
        });
    }
    informSuccess() {
        let success = new ModalWindow({
            content: this.getSuccesContent(),
            windowWidth: 0
        });
        success.fire();
        setTimeout(()=>{
            success.close();
        }, 3000);
    }
    informFalse() {
        let success = new ModalWindow({
            content: this.getFalseContent(),
            windowWidth: 0
        });
        success.fire();
        setTimeout(()=>{
            success.close();
        }, 3000);
    }

    getSuccesContent() {
        let tmp = document.createElement('div');
        tmp.innerHTML = succesTemplate();
        return tmp.firstElementChild;
    }

    getFalseContent() {
        let tmp = document.createElement('div');
        tmp.innerHTML = falseTemplate();
        return tmp.firstElementChild;
    }
    createHeader(text = 'Заказать машину') {
        let elem = document.createElement('header');
        elem.innerHTML = text;
        return elem;
    }
    createSubheader(text = 'Оставьте Ваш номер<br>мы позвоним и уточним детали') {
        let elem = document.createElement('div');
        elem.classList.add('subheader');
        elem.innerHTML = text;
        return elem;
    }

    listen() {
        this.phoneInput.elem.addEventListener('complete', this.enableSending.bind(this));
        this.phoneInput.elem.addEventListener('keydown', this.handlePhoneInputKeydown.bind(this));
        this.container.addEventListener('sendButtonClick', this.handleSendButtonClick.bind(this));
    }
}

export {OrderWindow}