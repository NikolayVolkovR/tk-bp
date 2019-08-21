
class ZoneReader {

    static getYurLitsam() {
        return ZoneReader.getZones('/geo/map-zone/yur-litsam-json');
        /*return new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let data = csrfParam + '=' + csrfToken;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/geo/map-zone/yur-litsam-json');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(data);
            xhr.onload = function(){
                if (xhr.status != 200) {
                    reject( xhr.status + ': ' + xhr.statusTex );
                } else {
                    resolve( xhr.responseText );
                }
            };
        });*/
    }
    static getCalculator() {
        return ZoneReader.getZones('/geo/map-zone/calculator-json');
    }

    static test() {
        console.log(111)
    }

    static getZones($url) {
        return new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let data = csrfParam + '=' + csrfToken;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', $url);
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
    }
}

export {ZoneReader}