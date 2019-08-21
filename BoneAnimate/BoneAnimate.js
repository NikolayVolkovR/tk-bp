import Velocity from 'velocity-animate'

class BoneAnimate {
    constructor({parent, height = 100, color = '#ececec', duration = 350, maxOpacity = 0.4, className = 'boneAnimate'}) {
        this.parent = parent;
        this.height = height;
        this.color = color;
        this.duration = duration;
        this.maxOpacity = maxOpacity;
        this.className = className;
        this.state = 'init';

        this.create();
    }
    create () {
        this.elem = document.createElement('div');
        this.elem.classList.add(this.className);
        Object.assign(this.elem.style, {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            background: this.color,
            height: this.height + 'px'
        });
        this.parent.append(this.elem);
    }
    start () {
        let self = this;
        this.timeout = setTimeout ( function animate () {
            if (self.isStopped()) {return false}
            self.iteration().then(()=>{
                if (self.isStopped()) {return false}
                setTimeout(animate, this.duration * 2);
            });
        }, this.duration * 2);
        this.state = 'playing'
    }
    iteration () {
        return Velocity(this.elem, {opacity: this.maxOpacity}, {duration: this.duration})
            .then(()=>{
                Velocity(this.elem, {opacity: 1}, {duration: this.duration})
            })
    }
    stop () {
        this.state = 'stopped';
        clearTimeout(this.timeout);
        Velocity(this.elem, {opacity: 0}, {duration: this.duration})
            .then(()=> {
                this.elem.remove();
        })

    }
    isStopped () {
        return this.state === 'stopped';
    }
}

export {BoneAnimate}