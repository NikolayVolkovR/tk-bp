
class FitUrLitsam {
    constructor() {
        if (document.readyState === "complete") {
            this.onload();
        } else {
            window.addEventListener("load", this.onload.bind(this));
        }
    }

    onload () {
        this.fit();
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize () {
        this.fit();
    }
    
    fit () {
        let elem = document.getElementById('ur-litsam-button');
        if (window.innerWidth <= 350) {
            elem.innerHTML = 'Юр.'
        } else {
            elem.innerHTML = 'Юридическим'
        }
    }
}

export {FitUrLitsam}