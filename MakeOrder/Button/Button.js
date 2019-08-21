
class Button {
    constructor({text = 'Готово', className = null} = {}) {
        this.text = text;
        this.className = className;

        this.render();
        this.listen();
    }

    render() {
        this.elem = document.createElement('button');
        if (this.className) {
            this.elem.classList.add(this.className);
        }
        this.elem.innerHTML = this.text;
    }

    listen() {
        this.elem.addEventListener('click', this);
    }

    handleEvent() {
        if(!this.isEnable()) {
            return false;
        }

        this.elem.dispatchEvent(new CustomEvent('sendButtonClick', {
            bubbles: true,
            cancelable: true,
        }));
    }

    getElem() {
        return this.elem;
    }

    isEnable() {
        return this.elem.classList.contains(this.getEnableClassName());
    }

    setEnable() {
        this.elem.classList.add(this.getEnableClassName());
    }

    setDisable() {
        this.elem.classList.remove(this.getEnableClassName());

    }

    getEnableClassName() {
        return this.className + '-enable';
    }
}

export {Button}