//import IMask from 'imask';
import Inputmask from "inputmask";

class Input {
    constructor({
                    type = this.TYPE_REGULAR,
                    className = null,
                    placeHolder = null
    }={}) {
        this.type = type;
        this.className = className;
        this.placeHolder = placeHolder;
        this.render();
        this.mask();
    }

    render(){
        this.elem = document.createElement('input');
        if (this.className) {
            this.elem.classList.add(this.className);
        }
        if (this.placeHolder) {
            this.elem.setAttribute('placeholder', this.placeHolder);
        }
    }
    mask() {
        if (this.type === Input.TYPE_REGULAR()) {
            this.maskRegular();
        } else if (this.type === Input.TYPE_PHONE()) {
            this.maskPhone();
        }
    }

    maskRegular() {
        this.elem.addEventListener('keydown', (event)=> {this.handleKeydown(event)});
    }

    maskPhone() {
        let mask = new Inputmask("+7(999)-999-99-99");
        mask.mask(this.elem);

        this.elem.addEventListener('complete', (event)=> {this.handleComplete(event)});
        this.elem.addEventListener('keydown', (event)=> {this.handleKeydown(event)});
    }

    complete() {
        this.elem.classList.add(this.className + '-complete');
    }

    uncomplete() {
        this.elem.classList.remove(this.className + '-complete');
    }

    getElem() {
        return this.elem;
    }

    handleComplete (event) {
        this.complete();
    }

    handleKeydown (event) {
        setTimeout(()=>{
            if (this.isComplete()) {
                this.complete()
            } else {
                this.uncomplete();
            }
        },0);
    }
    isComplete() {
        if (this.type === Input.TYPE_PHONE()) {
            return this.elem.inputmask.isComplete();
        } else if (this.type === Input.TYPE_REGULAR()) {
            return this.elem.value.length > 0;
        }
    }

    static TYPE_REGULAR() {
        return 1;
    }
    static TYPE_PHONE() {
        return 2;
    }
}

export {Input}