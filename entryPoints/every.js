import {FitUrLitsam} from "../commons/FitUrLitsam";
import {AnchorScroll} from "../commons/AnchorScroll";
import {MakeOrder} from "../MakeOrder/Order";

(function () {
    if(document.readyState === "complete") {
        onLoad();
    } else {
        window.addEventListener("load", onLoad);
    }

    function onLoad () {
        let fitUrLitsam = new FitUrLitsam();
        let anchorScroll = new AnchorScroll();
        let makeOrder = new MakeOrder();
    }
})(FitUrLitsam, AnchorScroll, MakeOrder);
