import {Calculator} from "../Calculator/Calculator"
import {ChooseCar} from "../ChooseCar/ChooseCar"
import {ModalWindow} from "../ModalWindow/ModalWindow"
import {CarReader} from "../commons/CarReader"

(function () {
    let chooseCar;
    let chooseCarModal;
    let calculator;

    if(document.readyState === "complete") {
        onLoad();
    } else {
        window.addEventListener("load", onLoad);
    }

    function onLoad () {
        let carsDataPromise = getCarData();

        carsDataPromise.then(data => {
            calculator = new Calculator({cars: JSON.parse(data)});
            document.body.addEventListener('calculator-choose-car-btn-click', handleCalculatorChooseCarBtnClick);
        });

    }

    function handleCalculatorChooseCarBtnClick() {
        // Создаём экземпляр ChooseCar
        let carsPromise = CarReader.getAll();
        carsPromise.then((data)=>{
            chooseCar = new ChooseCar({
                cars: JSON.parse(data),
                designOptions: {
                    orderButtonColor: '#78a576',
                    orderButtonText: 'Выбрать'
                }
            });

            // Создаём модальное окно и передаём в него содержимое chooseCar
            chooseCarModal = new ModalWindow({
                content: chooseCar.getElem(),
                windowWidth: '100%'
            });
            chooseCarModal.fire({
                animateFadeIn: 250
            });

            // Слушаем событие "машина выбрана"
            chooseCar.elem.addEventListener('choose-car-done', handleChooseCarDone);
        });
    }

    function handleChooseCarDone (event) {
        // Получаем индекс машины
        let carIndex = event.detail.carIndex;

        // Заменяем выборку машин в калькуляторе
        calculator.setCars(chooseCar.getCars());

        // Обновляем калькулятор
        calculator.cars.goToCar(carIndex);

        // Удаляем слушатель события "машина выбрана
        chooseCar.elem.removeEventListener('choose-car-done', handleChooseCarDone);

        // Удаляем экземпляр ChooseCar
        chooseCar = undefined;

        // Закрываем модальное окно
        chooseCarModal.close();
    }

    function getCarData() {
        let calculatorWrap = document.querySelector('.calculator__wrap');
        if (calculatorWrap.dataset.type) {
            switch (calculatorWrap.dataset.type) {
                case 'tarif':
                    return CarReader.getByTarif(calculatorWrap.dataset.id);
                case 'car':
                    return CarReader.getByCar(calculatorWrap.dataset.id);
            }
        } else {
            return CarReader.getAll();
        }
    }

})(Calculator, ChooseCar, ModalWindow, CarReader);