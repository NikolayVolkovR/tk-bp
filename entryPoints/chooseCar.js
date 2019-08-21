import {ChooseCar} from "../ChooseCar/ChooseCar"
import {CarReader} from "../commons/CarReader"

(function () {
    if(document.readyState === "complete") {
        onLoad();
    } else {
        window.addEventListener("load", onLoad);
    }

    function onLoad () {
        let carsDataPromise = CarReader.getAll();

        carsDataPromise.then((data)=> {
            let container = document.querySelector('.chooseCar__indexContainer');
            let chooseCar = new ChooseCar({
                cars: JSON.parse(data),
                designOptions: {
                    orderButtonColor: '#747ea6',
                    orderButtonText: 'Заказать'
                }
            });
            container.append(chooseCar.getElem());
        });
    }
})(ChooseCar, CarReader);





