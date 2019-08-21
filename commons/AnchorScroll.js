import Velocity from 'velocity-animate';

class AnchorScroll {
    constructor () {
        const anchors = document.querySelectorAll('.anchor-scroll');
        for (let anchor of anchors) {
            anchor.onclick = () => {
                const fullHref = anchor.getAttribute('href')
                const href = fullHref.slice(1);
                const elem = document.querySelector('a[name="' + href + '"]');
                Velocity(elem, "scroll", { duration: 700, easing: "linear" });
                history.pushState({},'', fullHref);
                return false
            }
        }
    }
}

export {AnchorScroll}