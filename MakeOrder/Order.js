
import {OrderWindow} from "./OrderWindow";


class MakeOrder {
    constructor({buttonClassName = 'make-order', className = 'order-window'} = {}){
        this.buttonClassName = buttonClassName;
        this.className = className;
        this.listenButtonClick();
    }

    listenButtonClick() {
        let buttons = document.querySelectorAll('.' + this.buttonClassName);
        for (let button of buttons) {
            button.addEventListener('click', this);
        }
    }

    handleEvent(e) {
        let button = e.target;

        this.orderWindow = new OrderWindow({
            className: this.className,
            photoSrc: button.dataset.photoSrc,
            photoName: button.dataset.photoName,
            dataOrderType: button.dataset.orderType
        });
    }
}

export {MakeOrder}