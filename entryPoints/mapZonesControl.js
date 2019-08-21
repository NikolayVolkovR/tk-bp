import {MapZonesControl} from "../MapZonesControl/MapZonesControl"

(function () {
    if(document.readyState === "complete") {
        onLoad();
    } else {
        window.addEventListener("load", onLoad);
    }

    function onLoad () {
        let urlPrefix = window.location.href.indexOf("local") > -1 ? '' : '/backend/web';
        let zonesPromise = new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();

            let data = csrfParam + '=' + csrfToken;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', urlPrefix + '/geo/map-zone/all');
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
        zonesPromise.then((data)=>{
            let zones = JSON.parse(data);
            let mapZonesControl = new MapZonesControl({
                zones: zones,
                urlPrefix: urlPrefix
            });
            let container = document.querySelector('.map-zones-control');
            container.append(mapZonesControl.getElem());
        });
    }
})(MapZonesControl);