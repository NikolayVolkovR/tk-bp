
import chai from 'chai';
//impost sinon from 'sinon';
import {ChooseCar} from "./ChooseCar"
import {TypeIcon} from './carTypes/typeIcon/typeIcon';
import {Param} from './cargoParams/param/param';
import {Slider} from '../Slider/Slider';

class ChooseCarSpec {
    constructor (params) {
        this.cars = params.cars;
        this.tests();
    }

    tests () {
        let cCar, typeIcon, param;
        let expect = chai.expect;
        let params = {
            cars: this.cars,
            designOptions: {
                orderButtonColor: '#747ea6',
                orderButtonText: 'Заказать'
            }
        };

        describe('ChooseCar', () => {
            describe ('#constructor()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                });
                it ('Принимает массив машин', ()=> {
                    expect(cCar.cars).to.be.an('array');
                });
                it ('Принимает настройки дизайна', ()=> {
                    expect(cCar.designOptions).to.be.an('object');
                });

                it ('Получает начальные требования к машине', ()=> {
                   expect(cCar.demands).to.be.an('object');
                });
                it ('Получает подходящие машины', ()=> {
                    expect(cCar.suitableCars).to.be.an('array');
                });
                it ('Получает номер (индекс) подходящей машины', ()=> {
                    expect(cCar.suitableCarNumber).to.be.equal(0);
                });
                it ('Создаёт экземпляр CarTypes', ()=> {
                    expect(cCar.carTypes).to.be.an('object');
                });
                it ('Создаёт экземпляр CarDescription', ()=> {
                    expect(cCar.carDescription).to.be.an('object');
                });
                it ('Создаёт экземпляр CargoParams', ()=> {
                    expect(cCar.cargoParams).to.be.an('object');
                });

                it ('Запускает render()', ()=> {
                    expect(cCar.elem).to.be.exist;
                });
              });
            describe ('#render()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                });
                it ('Создаёт элемент с классом .chooseCar, записывает его в this.elem', ()=> {
                    expect(cCar.elem.classList.contains('chooseCar')).to.be.true;
                });
                it ('Добавлет элемент carTypes', ()=> {
                    expect(cCar.elem.querySelector('.chooseCar__carTypes')).to.be.exist;
                });
                it ('Добавляет элемент carDescription', ()=> {
                    expect(cCar.elem.querySelector('.chooseCar__carDescription')).to.be.exist;
                });
                it ('Добавляет элемент cargoParams', ()=> {
                    expect(cCar.elem.querySelector('.chooseCar__cargoParams')).to.be.exist;
                });
                it ('Шаблон передаёт цвет кнопки из designOptions.orderButtonColor', ()=> {
                    expect(cCar.elem.querySelector('.chooseCar__carDescription-params-order-btn').style.background)
                        .to.be.equal('rgb(116, 126, 166)');
                });
                it ('Шаблон передаёт тексе кнопки из designOptions.orderButtonText', ()=> {
                    expect(cCar.elem.querySelector('.chooseCar__carDescription-params-order-btn').innerHTML)
                        .to.be.equal(cCar.designOptions.orderButtonText);
                });
            });
            describe ('#listen()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                });
                it ('Слушает событие "car-type-icon-click", вызывает handleCarTypeIconClick(event)', ()=> {
                    let icon = cCar.elem.querySelector('.chooseCar__carTypes-icon[data-type="heel"]');
                    icon.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                    expect(cCar.carTypes.types.heel.elem.classList.contains('active')).to.be.true;
                });
                it ('Слушает событие "checkbox-click", вызывает handleCheckboxClick(event)', ()=> {
                    let cb = cCar.elem.querySelector('.cCheckbox[data-type="sideLoading"]');
                    cCar.elem.addEventListener('checkbox-click', (event)=>{
                        expect(event.detail.type).to.be.equal('sideLoading');
                    });
                    cb.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                });
                it ('Слушает событие "change-suitable-car", вызывает handleSuitableCarChange(event)', ()=> {
                    let elem = cCar.elem.querySelector('.chooseCar__carDescription-prev');
                    cCar.elem.addEventListener('change-suitable-car', (event)=> {
                        expect(event.detail.newNumber).to.be.equal(2);
                    });
                    elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                });
                it ('Слушает событие "cargo-param-value-change", вызывает handleCargoParamValueChange(event)', ()=> {
                    cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    cCar.elem.addEventListener('cargo-param-value-change', (event)=> {
                        expect(event.detail.type).to.be.equal('ton');
                        expect(event.detail.value).to.be.equal(3);
                    })
                })
                it ('Слушает событие "car-description-slide-click", вызывает handleCarDescriptionSlideClick(event)', ()=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click'));
                    cCar.elem.addEventListener('car-description-slide-click', (event)=> {
                        expect(event.detail.type).to.be.equal('Lada Largus');
                    });
                })
            });
            describe ('#getDefaultDemands()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                });
                it ('Возвращает объект начальных требований к машине', ()=> {
                    expect(cCar.getDefaultDemands()).to.be.an('object');
                })
            });
            describe ('#isCarSuitable()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                });
                it ('Возвращает true, если машина подходит', ()=> {
                    expect(cCar.isCarSuitable(cCar.cars[1])).to.be.true;
                });
                it ('Возвращает false, если машина не подходит', ()=> {
                    expect(cCar.isCarSuitable(cCar.cars[0])).to.be.false;
                });
            });
            describe ('#getSuitableCars()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                });
                it ('Возвращает массив подходящих машин', ()=> {
                    expect(cCar.getSuitableCars()).to.be.an('array').that.lengthOf.above(1);
                });
            });
            describe ('#handleCarTypeIconClick()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                    let icon = cCar.elem.querySelector('.chooseCar__carTypes-icon[data-type="heel"]');
                    icon.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                });
                it ('Если выбран "Поиск среди всех типов" снимает класс acitve с chooseCar__carTypes-icons', ()=> {
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    cCar.carTypes.types.van.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.getElem().querySelector('.chooseCar__carTypes-icons').classList.contains('active'))
                        .to.be.false;
                });
                it ('Если выбран "Поиск среди всех типов" снимает галочку "Поиск среди всех...', ()=> {
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    cCar.carTypes.types.van.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.carTypes.allTypesCheckbox.getState()).to.be.equal('ready');
                });
                it ('Делает прудыдущий значок не активным, если не выбран "Поиск среди всех типов"', ()=> {
                    expect(cCar.carTypes.types.van.elem.classList.contains('active')).to.be.false;
                });
                it ('Очищает требования к машине, eстанавливая только тип в требованиях', ()=> {
                    expect(cCar.demands.type).to.be.equal('heel');
                });
                it ('Передаёт новые требования в carTypes', ()=> {
                    expect(cCar.carTypes.demands.type).to.be. equal('heel');
                });
                it ('Делает выбранных значок активным', ()=> {
                    expect(cCar.carTypes.types.heel.elem.classList.contains('active')).to.be.true;
                });
                it ('Вызывает handleChangeDemands()', ()=> {
                    expect(cCar.carDescription.elem.querySelector('.chooseCar__carDescription-name').innerHTML)
                        .to.be.equal('Лада Ларгус');
                });
            });
            describe ('#updateCarDescriptionContent()', function() {
                this.timeout(500);

                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                    let icon = cCar.elem.querySelector('.chooseCar__carTypes-icon[data-type="heel"]');
                    icon.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                });

                it ('Обновляет контент carDescription', function(done) {
                    setTimeout(function(){
                        let nemeElem = cCar.elem.querySelector('.chooseCar__carDescription-name');
                        expect(nemeElem.innerHTML).to.be.equal('Лада Ларгус');
                        done();
                    }, 400);

                });
            });
            describe ('#handleCheckboxClick()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                    let checkbox = cCar.elem.querySelector('.cCheckbox[data-type="sideLoading"]');
                    checkbox.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                });
                it ('Выбор "Поиск среди всех типов" -> вызывает enableAllTypesSearch()',()=> {
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click',{bubbles: true}));
                    expect(cCar.carTypes.types.van.getElem().classList.contains('active')).to.be.false;
                });
                it ('Снятие "Поиск среди всех типов" -> вызывает disableAllTypesSearch()',()=> {

                });

                it ('Для галочек со значением, добавляем значение в demands', ()=>{
                    let checkbox = cCar.elem.querySelector('.cCheckbox[data-type="sideLoading"]');
                    checkbox.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));

                    let elem = (cCar.cargoParams.params.ton.elem.querySelector('.cCheckbox'));
                    elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    expect(cCar.demands.ton).to.be.equal(1);
                });
                it ('Добавляет требование, если галочка установлена', ()=> {
                    expect(cCar.demands.sideLoading).to.be.true;
                });
                it ('Удаляет требование, если галочка снята', ()=> {
                    let checkbox = cCar.elem.querySelector('.cCheckbox[data-type="sideLoading"]');
                    checkbox.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    expect(cCar.demands.sideLoading).to.be.equal(undefined);
                });
                it ('Вызывает handleChangeDemands()', ()=> {
                    expect(cCar.carDescription.elem.querySelector('.chooseCar__carDescription-name').innerHTML)
                        .to.be.equal('Зил Бычок');
                });
            });
            describe ('#handleSuitableCarChange()', ()=> {
                beforeEach(()=> {
                    cCar = new ChooseCar(params);
                    cCar.carTypes.setSuitableCarNumber(1);
                    cCar.carTypes.updateCheckboxes({suitableCars: cCar.suitableCars});
                    cCar.cargoParams.update({
                        demands: cCar.demands,
                        suitableCars: cCar.suitableCars,
                        suitableCarNumber: 1
                    });
                });
                it ('Изменяет suitableCarNumber в carTypes', ()=> {
                    expect(cCar.carTypes.suitableCarNumber).to.be.equal(1);
                });
                it ('Запускает carTypes.updateCheckboxes()', ()=> {
                    expect(cCar.carTypes.sideLoading.getState()).to.be.equal('checked-disabled')
                });
                it ('Запускает cargoParams.update()', ()=> {
                    expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(3);
                });
            });
            describe ('#handleCargoParamValueChange()', ()=> {
                beforeEach(()=> {
                    cCar = new ChooseCar(params);
                });
                it ('Принимает type и value', ()=> {
                    cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    cCar.elem.addEventListener('cargo-param-value-change', (event)=> {
                        expect(event.detail.type).to.be.equal('ton');
                        expect(event.detail.value).to.be.equal(3);
                    })
                });
                it ('Добавляет требование в demands', ()=>{
                    cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.demands.ton).to.be.equal(3);
                });
                it ('Вызывает handleChangeDemands()', ()=> {
                    cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.carDescription.elem.querySelector('.chooseCar__carDescription-name').innerHTML)
                        .to.be.equal('Зил Бычок');
                });
            });
            describe ('#handleChangeDemands()', ()=> {
                beforeEach(()=> {
                    cCar = new ChooseCar(params);
                    cCar.demands.ton = 3;
                    cCar.handleChangeDemands();
                });
                it ('Обновляет массив suitableCars', ()=> {
                    expect(cCar.suitableCars[0].name).to.be.equal('Зил Бычок')
                });
                it ('Обнуляет suitableCarNumber', ()=> {
                    expect(cCar.suitableCarNumber).to.be.equal(0);
                });
                it ('Запускает carTypes.setSuitableCarNumber', ()=> {
                    expect(cCar.carTypes.suitableCarNumber).to.be.equal(0);
                });
                it ('Запускает carTypes.updateCheckboxes', ()=> {
                    expect(cCar.carTypes.sideLoading.state).to.be.equal('checked-disabled');
                });
                it ('Запускает carDescription.updateSuitableCars', ()=> {
                    expect(cCar.carDescription.suitableCars[0].name).to.be.equal('Зил Бычок');
                });
                it ('Запускает updateCarDescriptionContent()', ()=> {
                    expect(cCar.carDescription.elem.querySelector('.chooseCar__carDescription-name').innerHTML)
                        .to.be.equal('Зил Бычок');
                });
                it ('Запускает .cargoParams.update()', ()=> {
                    expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(3);
                })

            });
            describe ('#handleCarDescriptionSlideClick()', ()=> {
                beforeEach(()=>{
                    cCar = new ChooseCar(params);
                });
                it ('Принимает тип слайда', ()=> {
                    cCar.elem.addEventListener('car-description-slide-click', (event)=> {
                        expect(event.detail.type).to.be.equal('Zil Bichok');
                    });
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                });
                it ('Получает ноый номер (индекс) машины', ()=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.suitableCarNumber).to.be.equal(1);
                });
                it ('Изменяет carDescription.suitableCarNumber', ()=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.carDescription.suitableCarNumber).to.be.equal(1);
                });
                it ('Вызывает carDescription.render()', ()=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.carDescription.elem.querySelector('.chooseCar__carDescription-name').innerHTML)
                        .to.be.equal('Зил Бычок');
                });
                it ('Вызывает updateCarDescriptionContent()', (done)=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    setTimeout(function(){
                        expect(cCar.elem.querySelector('.chooseCar__carDescription-name').innerHTML)
                            .to.be.equal('Зил Бычок');
                        done();
                    }, 500);
                });
                it ('Вызывает carTypes.setSuitableCarNumber()', ()=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.carTypes.suitableCarNumber).to.be.equal(1);
                });
                it ('Вызывает carTypes.updateCheckboxes()', ()=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.carTypes.sideLoading.getState()).to.be.equal('checked-disabled');
                });
                it ('Вызывает cargoParams.update()', ()=> {
                    cCar.carDescription.slider._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click',{bubbles: true}));
                    expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(3);
                });

            });
            describe ('#getCarIndexByName()', ()=> {
                beforeEach(()=> {
                    cCar = new ChooseCar(params);
                });
                it ('Возвращает индекс машины по её имени', ()=> {
                    expect(cCar.getCarIndexByName('Zil Bichok')).to.be.equal(1)
                });
            });
            describe ('#enableAllTypesSearch()', ()=> {
                beforeEach(()=> {
                    cCar = new ChooseCar(params);
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                });
                it ('Снимает класс active с активного значка группы', ()=> {
                    expect(cCar.carTypes.types.van.getElem().classList.contains('active')).to.be.false;
                });
                it ('Добавляет класс active элементу .chooseCar__carTypes-icons', ()=> {
                    expect(cCar.getElem().querySelector('.chooseCar__carTypes-icons')
                        .classList.contains('active')).to.be.true;
                });
                it ('Очищает demands.type',()=> {
                    expect(cCar.demands.type).to.be.undefined;
                });
                it ('Запускает handleChangeDemands()', ()=> {
                    expect(cCar.suitableCars[0].name).to.be.equal('Лада Ларгус')
                });
            });
            describe ('#disableAllTypesSearch()', ()=> {
                beforeEach(()=> {
                    cCar = new ChooseCar(params);
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                });
                it ('Снимает класс active с элемента .chooseCar__carTypes-icons', ()=> {
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.getElem().querySelector('.chooseCar__carTypes-icons')
                        .classList.contains('active')).to.be.false;
                });
                it ('Устанавливает demands.type в зависимости требваний (demands). Если есть требования, ' +
                    'то получает подходящие машины и берёт тип (type) первой.',()=> {
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.demands.type).to.be.equal('van');
                });
                it ('Устанавливает класс active подходящему типу', ()=> {
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.carTypes.types.van.getElem().classList.contains('active')).to.be.true;
                });
                it ('Запускает handleChangeDemands()', ()=> {
                    cCar.carTypes.allTypesCheckbox.getElem().dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(cCar.suitableCars[0].name).to.be.equal('Хёндай Портер фургон')
                });
            });

            describe('CarTypes', ()=> {
                describe('#constructor()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Принимает массив всех машин', ()=> {
                        expect(cCar.carTypes.cars).to.be.an('array');
                    });
                    it ('Принимает массив объект требований к машине', ()=> {
                        expect(cCar.carTypes.demands).to.be.an('object');
                    });
                    it ('Принимает массив подходящих машин', ()=> {
                        expect(cCar.carTypes.suitableCars).to.be.an('array').that.lengthOf.above(2);
                    });
                    it ('Принимает номер подходящей машины', ()=> {
                        expect(cCar.carTypes.suitableCarNumber).to.be.equal(0);
                    });
                    it ('Массив this.loadingTypes содержит имена видов погрузки', ()=> {
                        expect(cCar.carTypes.loadingTypes).to.be.an('array').that.length(3);
                    });
                    it ('Массив this.passTypes содержит имена пропусков', ()=> {
                        expect(cCar.carTypes.passTypes).to.be.an('array').that.length(3);
                    });
                    it ('Массив this.types объект содержащий ссылки на экземпляры кнопок типов машин', ()=> {
                        expect(cCar.carTypes.types).to.be.an('object');
                    });

                    it ('Запускает render()', ()=> {
                        expect(cCar.carTypes.elem).to.be.exist;
                    })
                });
                describe('#render()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Создаёт элемент с классом .chooseCar__carTypes, ' +
                        'записывает его в this.elem', ()=> {
                        expect(cCar.carTypes.elem.classList.contains('chooseCar__carTypes')).to.be.true;
                    });
                    it ('Запускает renderAllTypesCheckbox()', ()=> {
                        expect(cCar.carTypes.allTypesCheckbox.getElem()).to.be.exist;
                    });
                    it ('Запускает renderTypeIcons', ()=> {
                        expect(cCar.elem.querySelectorAll('.chooseCar__carTypes-icon').length).to.be.equal(6)
                    });
                    it ('Запускает renderLoadTypes()', ()=> {
                        expect(cCar.elem.querySelectorAll('.chooseCar__carTypes-half.loading .cCheckbox')
                            .length).to.be.equal(3);
                    });
                    it ('Запускает renderPassTypes()', ()=> {
                        expect(cCar.elem.querySelectorAll('.chooseCar__carTypes-half.passes .cCheckbox')
                            .length).to.be.equal(3);
                    });
                });
                describe('#renderAllTypesCheckbox()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Добавляет чекбокс "Поиск среди всех типов машин"', ()=> {
                        expect(cCar.carTypes.allTypesCheckbox.getElem()).to.be.exist;
                    })
                });
                describe('#renderTypeIcons()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Добавляет значки групп', ()=> {
                        expect(cCar.elem.querySelectorAll('.chooseCar__carTypes-icon').length).to.be.equal(6)
                    });
                    it ('Создаёт объект ссылок на значки типов вида this.types.van', ()=> {
                        expect(cCar.carTypes.types).to.be.an('object');
                    });
                    it ('Делает активной значок выбранного типа', ()=> {
                        expect(cCar.carTypes.types.van.elem.classList.contains('active')).to.be.true;
                    });
                });
                describe('#renderLoadTypes()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Добавляет чекбоксы типов погрузки', ()=> {
                        expect(cCar.elem.querySelectorAll('.chooseCar__carTypes-half.loading .cCheckbox')
                            .length).to.be.equal(3);
                    });
                    it ('Создаёт массив ссылок на экземпляры чекбоксов вида carTypes.sideLoading', ()=> {
                        expect(cCar.carTypes.sideLoading).to.be.an('object');
                    });
                });
                describe('#renderPassTypes()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Добавляет чекбоксы пропусков', ()=> {
                        expect(cCar.elem.querySelectorAll('.chooseCar__carTypes-half.passes .cCheckbox')
                            .length).to.be.equal(3);
                    })
                });
                describe('#getElem()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Возвращяет this.elem', ()=> {
                        expect(cCar.carTypes.getElem().classList.contains('chooseCar__carTypes')).to.be.true;
                    })
                });/*
                describe('#constructor()', ()=> {

                })
                describe('#constructor()', ()=> {

                })*/
                describe('#getCheckboxState()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Возвращает checked-disabled, если параметр присутствует у активной машины', ()=> {
                        expect(cCar.carTypes.getCheckboxState('topLoading')).to.be.equal('checked-disabled')
                    });
                    it ('Возвращает ready, если параметр доступен среди подходящих машин', ()=> {
                        expect(cCar.carTypes.getCheckboxState('sideLoading')).to.be.equal('ready')
                    });
                    it ('Возвращает disabled, если параметр недоступен среди подходящих машин', ()=> {
                        //expect(cCar.carTypes.getCheckboxState('sideLoading')).to.be.equal('disabled')
                    });
                });
                describe('#isParamAvailable()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });

                    it ('Вернёт true, если параметр доступен среди подходящих машин', ()=> {
                        expect(cCar.carTypes.isParamAvailable('sideLoading')).to.be.true;
                    });
                });
                describe('#updateCheckboxes()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                        cCar.demands = {sideLoading: true};
                    });
                    it ('Принимает и обновляет suitableCars', ()=> {
                        let suitableCars = cCar.getSuitableCars();
                        cCar.carTypes.updateCheckboxes({suitableCars: suitableCars});
                        expect(cCar.carTypes.suitableCars[0].name).to.be.equal('Зил Бычок');
                    });
                    it ('Обновляет состояние чекбоксов', ()=> {
                        let suitableCars = cCar.getSuitableCars();
                        cCar.carTypes.updateCheckboxes({suitableCars: suitableCars});
                        expect(cCar.carTypes.sideLoading.state).to.be.equal('checked-disabled');
                    })
                });

                describe('TypeIcon', ()=> {
                    describe('#constructor()', ()=> {
                        beforeEach(()=>{
                            typeIcon = new TypeIcon({cars: this.cars, type: {name: 'van', rusName: 'фургон'}});
                        });
                        it ('Принимает массив всех машин', ()=> {
                            expect(typeIcon.cars).to.be.an('array');
                        });
                        it ('Принимает объект type, который сдержит имя на русском и английском', ()=> {
                            expect(typeIcon.type.name).to.be.equal('van');
                        });
                        it ('Запускает render()', ()=> {
                            expect(typeIcon.elem).to.be.exist;
                        })
                    });
                    describe('#render()', ()=> {
                        beforeEach(()=>{
                            typeIcon = new TypeIcon({cars: this.cars, type: {name: 'van', rusName: 'фургон'}});
                        });
                        it ('Создаёт элемент и записывает его в this.elem', ()=> {
                            expect(typeIcon.getElem()).to.be.exist;
                        });
                        it ('Добавляет класс .disabled, если кнопка заблокирована', ()=> {
                            typeIcon = new TypeIcon({cars: this.cars, type: {name: 'manipulator', rusName: 'манипулятор'}});
                            expect(typeIcon.elem.classList.contains('disabled')).to.be.true;
                        });
                    });
                    describe('#isDisabled()', ()=> {
                        it ('Возвращяет true, если кнопка заблокирована, т.е. данного типа нет среди всех машин', ()=> {
                            typeIcon = new TypeIcon({cars: this.cars, type: {name: 'manipulator', rusName: 'Манипулятор'}});
                            expect(typeIcon.isDisabled()).to.be.true;
                        });
                        it ('Возвращяет false, если кнопка доступна, т.е. данного тип есть среди всех машин', ()=> {
                            typeIcon = new TypeIcon({cars: this.cars, type: {name: 'van', rusName: 'Фургон'}});
                            expect(typeIcon.isDisabled()).to.be.false;
                        });
                    });
                    describe('#handleEvent()', ()=> {
                        beforeEach(()=>{
                            cCar = new ChooseCar(params);
                            let icon = cCar.elem.querySelector('.chooseCar__carTypes-icon[data-type="heel"]')

                            icon.dispatchEvent(new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true
                            }));
                        });
                        it ('При клике инициирует событие "car-type-icon-click" и передаёт type',()=>{
                            cCar.elem.addEventListener('car-type-icon-click', (event)=> {
                                expect(event.detail.type).to.be.equal('heel');
                            })
                        })
                    });
                    describe('#makeActive()', ()=> {
                        beforeEach(()=>{
                            typeIcon = new TypeIcon({cars: this.cars, type: {name: 'van', rusName: 'фургон'}});
                            typeIcon.makeActive();
                        });
                        it ('Добавляет класс .active', ()=> {
                            expect(typeIcon.elem.classList.contains('active')).to.be.true;
                        })
                    });
                    describe('#makeUnactive()', ()=> {
                        beforeEach(()=>{
                            typeIcon = new TypeIcon({cars: this.cars, type: {name: 'van', rusName: 'фургон'}});
                            typeIcon.makeActive();
                            typeIcon.makeUnactive();
                        });
                        it ('Удаляет класс .active', ()=> {
                            expect(typeIcon.elem.classList.contains('active')).to.be.false;
                        });
                    })

                });
            });

            describe('CarDescription', ()=> {
                describe('#constructor()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Принимает массив всех машин', ()=> {
                        expect(cCar.carDescription.cars).to.be.an('array');
                    });
                    it ('Принимает массив подходящих машин', ()=> {
                        expect(cCar.carDescription.suitableCars).to.be.an('array');
                    });
                    it ('Принимает объект настроек дизайна', ()=> {
                        expect(cCar.carDescription.designOptions).to.be.an('object');
                    });
                    it ('Принимает номер (идентификатор) выбранной машины', ()=> {
                        expect(cCar.carDescription.suitableCarNumber).to.be.equal(0);
                    });
                    it ('Запускает render()', ()=> {
                        expect(cCar.carDescription.getElem()).to.be.exist;
                    });
                });
                describe('#render()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Создаёт элемент .chooseCar__carDescription', ()=> {
                        expect(cCar.carDescription.elem.classList.contains('chooseCar__carDescription')).to.be.true;
                    });
                });
                describe('#renderSlider()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Создаёт экземпляр Slider, если полходящих машин больше 1', ()=> {
                        expect(cCar.carDescription.slider).to.be.an.instanceof(Slider);
                    });
                    it ('Добавляет слайдер', ()=> {
                        let elem = cCar.carDescription.elem.querySelector('.cSlider');
                        expect(elem).to.be.exist;
                    });
                });
                describe('#updateSuitableCars()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                        let icon = cCar.elem.querySelector('.chooseCar__carTypes-icon[data-type="heel"]');
                        icon.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    });
                    it ('Принимает массив suitableCars', ()=> {
                        expect(cCar.carDescription.suitableCars[0].name).to.be.equal('Лада Ларгус');
                    });
                    it ('Обнуляет номер текущей машины', ()=> {
                        expect(cCar.carDescription.suitableCarNumber).to.be.equal(0);
                    });
                    it ('Запускает render()', ()=> {
                        let nemeElem = cCar.carDescription.elem.querySelector('.chooseCar__carDescription-name');
                        expect(nemeElem.innerHTML).to.be.equal('Лада Ларгус');
                    })
                });
                describe('#handleEvent()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                    });
                    it ('Перехватывает клик по стрелочке "назад" и "вперёд"', ()=> {
                        let elem = cCar.elem.querySelector('.chooseCar__carDescription-prev');
                        elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.carDescription.suitableCarNumber).not.to.be.equal(0);
                    });
                    it ('Перехватывает клик по кнопке "заказать"', ()=> {
                        let elem = cCar.elem.querySelector('.chooseCar__carDescription-params-order-btn');
                        cCar.elem.addEventListener('choose-car-done', (event)=> {
                            expect(event.detail.carIndex).to.be.equal(1)
                        });
                        elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    });
                });
                describe('#handlePrevCarClick()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                        let elem = cCar.elem.querySelector('.chooseCar__carDescription-prev');
                        elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    });
                    it ('Изменяет suitableCarNumber', ()=> {
                        expect(cCar.carDescription.suitableCarNumber).to.be.equal(2);
                    });
                    it ('Вызывает changeSuitableCar()', ()=> {

                    })
                });
                describe('#handleNextCarClick()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                        let elem = cCar.elem.querySelector('.chooseCar__carDescription-next');
                        elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    });
                    it ('Изменяет suitableCarNumber', ()=> {
                        expect(cCar.carDescription.suitableCarNumber).to.be.equal(1);
                    });
                });
                describe('#handleChooseCarBtnClick()', ()=> {
                    beforeEach(()=>{
                        cCar = new ChooseCar(params);
                    });
                    it ('Инициирует событие "choose-car-done" и передаёт индекс машины', ()=> {
                        let elem = cCar.elem.querySelector('.chooseCar__carDescription-params-order-btn');
                        cCar.elem.addEventListener('choose-car-done', (event)=> {
                            expect(event.detail.carIndex).to.be.equal(1)
                        });
                        elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    });
                });

                describe('#changeSuitableCar()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                        cCar.carDescription.suitableCarNumber = 1;
                    });

                    it ('Инициирует событие "change-suitable-car", передаёт новый номер',()=> {
                        let target = cCar.elem.querySelector('.chooseCar__carDescription-next');
                        cCar.elem.addEventListener('change-suitable-car', (event)=> {
                            expect(event.detail.newNumber).to.be.equal(2);
                        });
                        target.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}))

                    });
                    it ('Вызывает render()', ()=> {
                        cCar.carDescription.changeSuitableCar();
                        let name = cCar.carDescription.elem.querySelector('.chooseCar__carDescription-name');
                        expect(name.innerHTML).to.be.equal('Зил Бычок');
                    });

                });
                describe('#getSlides()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                    });
                    it ('Возвращает массив слайдов, без текущей машины', ()=> {
                        expect(cCar.carDescription.getSlides()).to.be.an('array').that.length(2);
                    })
                });
                describe('#getCarIndex()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                    });
                    it ('Возвращает индекс активной машины (среди всех машин)', ()=> {
                        expect(cCar.carDescription.getCarIndex()).to.be.equal(1);
                    })
                });
            });

            describe('CargoParams', ()=> {
                describe('#constructor()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Принимает массив всех машин', ()=> {
                        expect(cCar.cargoParams.cars).to.be.an('array');
                    });
                    it ('Принимает объект требований к машине', ()=> {
                        expect(cCar.cargoParams.demands).to.be.an('object');
                    });
                    it ('Принимает массив подходящих машин', ()=> {
                        expect(cCar.cargoParams.suitableCars).to.be.an('array');
                    });
                    it ('Принимает номер машины', ()=> {
                        expect(cCar.cargoParams.suitableCarNumber).to.be.equal(0);
                    });
                    it ('В массиве names хранятся объекты, опысывающие параметры', ()=> {
                        expect(cCar.cargoParams.names).to.be.an('array');
                    });
                    it ('Пустой объект params для хранения ссылок на экземпляры Params', ()=> {
                        expect(cCar.cargoParams.params).to.be.an('object');
                    });
                    it ('Запускает render()', ()=> {
                        expect(cCar.cargoParams.elem).to.be.exist;
                    });


                });
                describe('#renderParams()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Добавляет параметры в elem', ()=> {
                        let namesLength = cCar.cargoParams.names.length;
                        let elemsLength = cCar.elem.querySelectorAll('.chooseCar__cargoParams-param').length;
                        expect(namesLength).to.be.equal(elemsLength);
                    })
                });
                describe('#update(params)', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                        cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click',{bubbles:true}));
                    });
                    it ('Обновляет suitableCars', ()=> {
                        expect(cCar.cargoParams.suitableCars[0].name).to.be.equal('Зил Бычок');
                    });
                    it ('Обновляет suitableCarNumber', ()=> {
                        expect(cCar.cargoParams.suitableCarNumber).to.be.equal(0);
                    });
                    it ('Обновляет demands', ()=> {
                        expect(cCar.cargoParams.demands).to.be.an('object');
                    });
                    it ('Запускает updateParams', ()=> {
                        expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(3)
                    });
                });
                describe('#updateParams()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                        let param = cCar.cargoParams.params.ton;
                        cCar.demands.ton = 3;
                        param.update({
                            demands: cCar.demands,
                            suitableCars: cCar.getSuitableCars(),
                            suitableCarNumber: 0
                        });
                    });
                    it ('Запускает update для каждого экземпляра Param', ()=> {
                        expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(3)
                    })
                });
            });
            describe('Param', ()=> {
                describe('#constructor()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Принимает параметр name (имя параметра на английском и русском)', ()=> {
                        expect(cCar.cargoParams.params.width.name.eng).to.be.equal('width');
                    });
                    it ('Принимает массив всех машин (cars)', ()=> {
                        expect(cCar.cargoParams.params.width.cars).to.be.an('array');
                    });
                    it ('Принимает объект требований', ()=> {
                        expect(cCar.cargoParams.params.width.demands).to.be.an('object');
                    });
                    it ('Принимает массив подходящих машин (suitableCars)', ()=> {
                        expect(cCar.cargoParams.params.width.suitableCars).to.be.an('array');
                    });
                    it ('Принимает номер машины (suitableCarNumber)', ()=> {
                        expect(cCar.cargoParams.params.width.suitableCarNumber).to.be.equal(0);
                    });
                    it ('Вычисляет доступные значения (steps)', ()=> {
                        expect(cCar.cargoParams.params.ton.steps[2]).to.be.equal(5);
                    });
                    it ('Устанавливает текущий шаг = 0', ()=> {
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(0);
                    });
                    it ('Создаёт экземпляр checkbox', ()=> {
                        expect(cCar.cargoParams.params.width.checkbox).to.be.an('object');
                    });
                    it ('Запускает render()', ()=> {
                        expect(cCar.cargoParams.params.width.elem).to.be.exist;
                    });
                    it ('Записывает ссылку на элемент value',()=> {
                        expect(cCar.cargoParams.params.ton.valueElem).to.be.exist;
                    });
                    it ('Записывает ссылку на элемент minus',()=> {
                        expect(cCar.cargoParams.params.ton.minusElem).to.be.exist;
                    });
                    it ('Записывает ссылку на элемент plus',()=> {
                        expect(cCar.cargoParams.params.ton.plusElem).to.be.exist;
                    });

                });
                describe('#renderCheckbox()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Добавляет чекбокс в elem', ()=> {
                        expect(cCar.cargoParams.params.width.elem.querySelector('.cCheckbox')).to.be.exist;
                    });

                });
                describe('#handleEvent()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it('При клике по кнопке "минус", если кнопка заблокирована ничего не происходит', ()=> {
                        cCar.cargoParams.params.ton.minusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(0);
                    });
                    it('При клике по кнопке "минус", если она доствпна, вызывает handleMinusClick()', ()=> {
                        cCar.cargoParams.params.ton.minusElem.classList.remove('disabled');
                        cCar.cargoParams.params.ton.step = 1;
                        cCar.cargoParams.params.ton.minusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(0);
                    });
                    it('При клике по кнопке "плюс", если кнопка заблокирована ничего не происходит', ()=> {
                        cCar.cargoParams.params.passenger.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(0);
                    });
                    it('При клике по кнопке "минус", если она доствпна, вызывает handlePlusClick()', ()=> {
                        cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(1);
                    });
                });
                describe('#getValue()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Возвращает значение', ()=> {
                        expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(1);
                    })
                });
                describe('#setValue(value)', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                        cCar.cargoParams.params.ton.setValue(3)
                    });
                    it ('Возвращает значение', ()=> {
                        expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(3);
                    })
                });
                describe('#getSteps()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Возвращает массив доступных значений', ()=> {
                        expect(cCar.cargoParams.params.ton.getSteps()).to.be.an('array');
                    });
                    it ('Если чекбокс отмечен, то получает новые подходящие машины, при помощи getSuitableCarsWithoutOwnParam()', ()=> {
                        cCar.cargoParams.params.ton.demands.ton = 3;
                        cCar.cargoParams.params.ton.checkbox.setState('checked');
                        expect(cCar.cargoParams.params.ton.getSteps()).to.be.an('array').that.length(3);
                    });
                });
                describe('#getCurrentStep()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                    });
                    it ('Возвращает текущий шаг (из доступных)', ()=> {
                        let height = cCar.cargoParams.params.height;
                        height.steps = [0.4, 1.6, 2.05, 2.4]
                        expect(height.getCurrentStep()).to.be.equal(1);
                    });
                });
                describe('#handleButtonsDisable ()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Добавляет класс disabled к кнопочке "минус", если доступные значения ' +
                        'не позволяют уменьшить текущее значение',()=>{
                        let elem = cCar.cargoParams.params.ton.elem.querySelector('.chooseCar__cargoParams-minus');
                        expect(elem.classList.contains('disabled')).to.be.true;
                    });
                    it ('Добавляет класс disabled к кнопочке "плюч", если доступные значения ' +
                        'не позволяют увеличить текущее значение',()=>{
                        let elem = cCar.cargoParams.params.passenger.elem.querySelector('.chooseCar__cargoParams-plus');
                        expect(elem.classList.contains('disabled')).to.be.true;
                    });
                    it ('Не добавляют или снимают класс disabled, если значение можно уменьшить или увиличить',()=>{
                        let elem = cCar.cargoParams.params.ton.plusElem;
                        expect(elem.classList.contains('disabled')).to.be.false;
                    });

                });
                describe('#handleMinusClick()',()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Уменьшает step', ()=> {
                        cCar.cargoParams.params.ton.minusElem.classList.remove('disabled');
                        cCar.cargoParams.params.ton.step = 1;
                        cCar.cargoParams.params.ton.minusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(0);
                    });
                    it ('Вызывает changeValue()', ()=> {
                        let param = cCar.cargoParams.params.ton;
                        param.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(param.valueElem.innerHTML).to.be.equal('3');
                    });
                });
                describe('#handlePlusClick()',()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Увеличивает step', ()=> {
                        cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(1);
                    });
                    it ('Вызывает changeValue()', ()=> {
                        let param = cCar.cargoParams.params.ton;
                        param.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(param.valueElem.innerHTML).to.be.equal('3');
                    });
                });
                describe('#changeValue()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Изменяет значение', ()=> {
                        let param = cCar.cargoParams.params.ton;
                        param.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(param.valueElem.innerHTML).to.be.equal('3');
                    });
                    it ('Вызывает handleButtonsDisable()', ()=> {
                        let param = cCar.cargoParams.params.ton;
                        param.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                        expect(cCar.cargoParams.params.length.minusElem.classList.contains('disabled')).to.be.true;
                    });
                    it ('Отмечаем чекбокс, если он не отмечен', ()=> {
                        cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                        expect(cCar.cargoParams.params.ton.checkbox.getState()).to.be.equal('checked');
                    });
                    it ('Если чекбокс уже отмечен, инициирует событие "cargo-param-value-change", ' +
                        'передаёт type и value', ()=> {
                        cCar.cargoParams.params.ton.plusElem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                        cCar.elem.addEventListener('cargo-param-value-change', (event)=> {
                            expect(event.detail.type).to.be.equal('ton');
                            expect(event.detail.value).to.be.equal(3);
                        })

                    });
                });
                describe('#isAvailablePrevStep()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params)
                    });
                    it ('Возвращает true, если значение можно уменьшить', ()=> {
                        cCar.cargoParams.params.ton.valueElem.innerHTML = 3;
                        expect(cCar.cargoParams.params.ton.isAvailablePrevStep()).to.be.true;
                    });
                    it ('Возвращает false, если значение нельзя уменьшить', ()=> {
                        expect(cCar.cargoParams.params.ton.isAvailablePrevStep()).to.be.false;
                    });
                });
                describe('#isAvailableNextStep()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                    });
                    it ('Возвращает true, если значение можно увеличить', ()=> {
                        expect(cCar.cargoParams.params.ton.isAvailableNextStep()).to.be.true;
                    });
                    it ('Возвращает false, если значение нельзя увеличить', ()=> {
                        cCar.cargoParams.params.ton.valueElem.innerHTML = 5;
                        expect(cCar.cargoParams.params.ton.isAvailableNextStep()).to.be.false;
                    });
                });
                describe('#update()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                        cCar.demands.type = 'van';
                        cCar.demands.ton = 3;
                        cCar.suitableCars = cCar.getSuitableCars();
                        cCar.cargoParams.params.ton.update({
                            demands: cCar.demands,
                            suitableCars: cCar.suitableCars,
                            suitableCarNumber: 0
                        })
                    });
                    it ('Заменяет demands', ()=> {
                        expect(cCar.cargoParams.params.ton.demands).to.be.an('object');
                    });
                    it ('Заменяет suitableCars', ()=> {
                        expect(cCar.cargoParams.params.ton.suitableCars[0].name).to.be.equal('Зил Бычок')
                    });
                    it ('Заменяет suitableCarNumber', ()=> {
                        expect(cCar.cargoParams.params.ton.suitableCarNumber).to.be.equal(0)
                    });
                    it ('Заменяет значение setValue()', ()=> {
                        expect(cCar.cargoParams.params.ton.getValue()).to.be.equal(3)
                    });
                    it ('Обновляет доступные значения (steps)', ()=> {
                        expect(cCar.cargoParams.params.ton.steps[0]).to.be.equal(3)
                    });
                    it ('Обновляет step, вызывая getCurrentStep()', ()=> {
                        expect(cCar.cargoParams.params.ton.step).to.be.equal(0)
                    });
                    it ('Вызывает handleButtonsDisable()', ()=> {
                        expect(cCar.cargoParams.params.ton.plusElem.classList.contains('disabled')).to.be.true;
                    });

                });
                describe('#isCarSuitableWithoutOwnParam()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                        cCar.cargoParams.params.ton.demands.type = 'van';
                        cCar.cargoParams.params.ton.demands.ton = 3;
                    });
                    it ('Вернёт true, если машина подходоит под требования, но без учёта данного параметра', ()=>{
                        let param = cCar.cargoParams.params.ton;
                        expect(param.isCarSuitableWithoutOwnParam(params.cars[1])).to.be.true;
                    });
                    it ('Вернёт false, если НЕ машина подходоит под требования, даже без учёта данного параметра', ()=>{
                        let param = cCar.cargoParams.params.ton;
                        expect(param.isCarSuitableWithoutOwnParam(params.cars[0])).to.be.false;
                    });
                });
                describe('#getSuitableCarsWithoutOwnParam()', ()=> {
                    beforeEach(()=> {
                        cCar = new ChooseCar(params);
                        cCar.cargoParams.params.ton.demands.type = 'van';
                        cCar.cargoParams.params.ton.demands.ton = 3;

                    });
                    it ('Получает массив подходящих машин без учёта данного параметра', () =>{
                        let cars = cCar.cargoParams.params.ton.getSuitableCarsWithoutOwnParam();
                        expect(cars).to.be.an('array').that.length(3);
                    })
                });
            });


            /*
            describe ('#()', ()=> {
                beforeEach(()=> {
                    cCar = new ChooseCar(params);
                });
                it ('', ()=> {

                });
            });
            */
        });
    }
}

export {ChooseCarSpec}