import {EntityMap} from "../EntityMap/EntityMap"
import {ZoneReader} from "../readers/ZoneReader"
import {YurOfferRequest} from "../YurOfferRequest/YurOfferRequest"

(function () {

    if(document.readyState === "complete") {
        onLoad();
    } else {
        window.addEventListener("load", onLoad);
    }
    function onLoad() {
        initEntityMap();
        enableOfferRequest();
    }

    function initEntityMap() {
        let zonesPromise = ZoneReader.getYurLitsam();
        zonesPromise.then((data) => {
            let zones = JSON.parse(data);
            let yurMap = new EntityMap({zones: zones});
        });
    }
    function enableOfferRequest() {
        let offerRequest = new YurOfferRequest();
    }

})(EntityMap, ZoneReader, YurOfferRequest);