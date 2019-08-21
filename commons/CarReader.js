
class CarReader {
    constructor() {

    }

    static getAll () {
        return new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let data = csrfParam + '=' + csrfToken;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/car/all');
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

    static getByTarif (id) {
        return new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let data = csrfParam + '=' + csrfToken
                + '&id=' + id;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/car/get-by-tarif');
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
    static getByCar(id) {
        return new Promise((resolve, reject)=> {
            const csrfParam = yii.getCsrfParam();
            const csrfToken = yii.getCsrfToken();
            let data = csrfParam + '=' + csrfToken
                + '&id=' + id;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/car/get-by-car');
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

export {CarReader}