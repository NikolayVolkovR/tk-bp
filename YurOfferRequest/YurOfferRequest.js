import css from './yurOfferRequest.styl';
import {Input} from "../MakeOrder/Input/Input";
import {ModalWindow} from "../ModalWindow/ModalWindow";
import {Button} from "../MakeOrder/Button/Button"
import succesTemplate from './templates/succesTemplate.pug';
import falseTemplate from './templates/falseTemplate.pug';

class YurOfferRequest {
    constructor({
        initButton = document.querySelector('.personal-offer-request-button'),
        className = 'yur-offer-request'
                } = {}) {

        this.initButton = initButton;
        this.className = className;

        this.listeninitButtonClick();
        this.render();
        this.listen();
    }
    listeninitButtonClick() {
        this.initButton.addEventListener('click', this.handleInitinitButtonClick.bind(this))
    }
    handleInitinitButtonClick () {
        this.modal = new ModalWindow({content: this.getElem(), windowWidth: 0});
        this.modal.fire();
    }
    render() {
        this.elem = this.createContainer();
        this.headerElem = this.createHeader();
        this.phoneInput = this.createPhoneInput();
        this.nameInput = this.createNameInput();
        this.formButton = this.getFormButton();


        this.elem.append(this.headerElem);
        this.elem.append(this.phoneInput.getElem());
        this.elem.append(this.nameInput.getElem());
        this.elem.append(this.formButton.getElem());
    }
    createContainer() {
        let elem = document.createElement('div');
        elem.classList.add(this.className);
        return elem;
    }
    createHeader() {
        let elem = document.createElement('header');
        elem.classList.add(this.className + '__header');
        elem.innerHTML = 'Получить индивидуальное коммерческое предложение';
        return elem;
    }
    createPhoneInput() {
        return new Input({
            type: Input.TYPE_PHONE(),
            className: this.className + '__input',
            placeHolder: 'Телефон'
        });
    }
    createNameInput() {
        return new Input({
            type: Input.TYPE_REGULAR(),
            className: this.className + '__input',
            placeHolder: 'Ваше имя'
        });
    }
    getFormButton() {
        return new Button({className: this.className + '__button'});
    }
    getElem() {
        return this.elem;
    }

    listen() {
        this.phoneInput.elem.addEventListener('complete', this.enableSending.bind(this));
        this.phoneInput.elem.addEventListener('keydown', this.handlePhoneInputKeydown.bind(this));
        this.elem.addEventListener('sendButtonClick', this.handleSendButtonClick.bind(this));
    }
    enableSending() {
        this.formButton.setEnable();
    }
    disableSending() {
        this.formButton.setDisable();
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
            name: name
        });
    }
    sendData(params) {
        let sending = new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let name = encodeURIComponent(params.name),
                phone = encodeURIComponent(params.phone);

            let data = csrfParam + '=' + csrfToken
                +'&phone=' + phone
                +'&name=' + name;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/yur-litsam/offer-request');
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
                this.modal.close();
                this.informSuccess();
            } else {
                this.modal.close();
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
}

export {YurOfferRequest}