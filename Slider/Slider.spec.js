import chai from 'chai';
import ChaiDom from 'chai-dom';
import {Slider} from './Slider'

class SliderSpec {
    constructor (params) {
        this.cars = params.cars;
        this.tests();
    }

    tests () {
        let sl;
        let expect = chai.expect;

        let slides = [];
        for (let car of this.cars) {
            let slide = {
                nameRus: car.name,
                nameEng: car.engName,
                src: car.photo
            };
            slides.push(slide)
        }

        let options = {
            slidesVisible: 4,
            slideClickEventName: 'car-description-slide-click'
        };

        let params = {
            slides: slides,
            options: options
        };

        describe ('Slider', ()=> {
            describe ('#constructor()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params)
                });
                it ('Получает массив слайдов', ()=> {
                    expect(sl._slides).to.be.an('array');
                });
                it ('Получает число видимых слайдов options.slidesVisible', ()=> {
                    expect(sl._options.slidesVisible).to.be.equal(4)
                });
                it ('Получает имя события, генерируемого при клике по слайду options.slideClickEventName', ()=> {
                    expect(sl._options.slideClickEventName).to.be.equal('car-description-slide-click')
                });
                it ('Вычисляет текущий шаг (_step)', ()=> {
                    expect(sl._step).to.be.equal(3)
                });
                it ('Запускает render()', ()=> {
                    expect(sl._elem).to.be.exist;
                });


            });
            describe ('#render()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params)
                });
                it ('Выводит элементы по шаблону', ()=> {
                    expect(sl._elem).to.be.exist;
                });
                it ('Шаблон добавляет к стрелочкам класс .disabled, если машин меньше 5', ()=> {
                    expect(sl._elem.querySelector('.cSlider__leftArrow').classList.contains('disabled')).to.be.false;
                });
                it ('Шаблон ограничивает количество слайдов this._options.slidesVisible', ()=> {
                    expect(sl._elem.querySelectorAll('.cSlider__slide').length).to.be.equal(4);
                });
                it ('Сохраняет ссылку на элемент контейнер слайдов', ()=> {
                    expect(sl._slidesElem.classList.contains('cSlider__slides')).to.be.true;
                })
            });
            describe ('#handleEvent', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params)
                });
                it ('При клике по левой стрелочке, если она активна, вызывает handleLeftArrowClick()', ()=> {
                    let elem = sl._elem.querySelector('.cSlider__leftArrow');
                    elem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(sl._step).to.be.equal(2);
                });
                it ('При клике по правой стрелочке, если она активна, вызывает handleRightArrowClick()', ()=> {
                    let elem = sl._elem.querySelector('.cSlider__rightArrow');
                    elem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    expect(sl._step).to.be.equal(4);
                });
                it ('При клике по слайду вызывает handleSlideCkick()', ()=> {
                    sl._elem.addEventListener(sl._options.slideClickEventName, (event)=> {
                        expect(event.detail.type).to.be.equal('Lada Largus')
                    });
                    sl._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                });
            });
            describe ('#handleLeftArrowClick()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params);
                    let elem = sl._elem.querySelector('.cSlider__leftArrow');
                    elem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                });
                it ('Получает ширину слайда в пикселях (не тестируется модульно...)', ()=> {});
                it ('Изменяет ширину контейнера слайдов (не тестируется модульно...)', ()=> {});
                it ('Прокручивает слайды влево за границу экрана (не тестируется модульно...)', ()=> {});
                it ('Вычисляет новый step', ()=> {
                    expect(sl._step).to.be.equal(2);
                });
                it ('Вычисляет следующий слайд и добавляет его вначало списка', ()=> {
                    expect(sl._slidesElem.firstElementChild.dataset.type).to.be.equal('Gazelle 4m');
                });
                it ('Устанавливает ширину всех слайдов в пикселях (не тестируется модульно...)', ()=> {});
                it ('Анимируем прокрутку влево', (done)=> {
                    setTimeout(function(){
                        expect(sl._slidesElem.style.marginLeft).to.be.equal('0px');
                        done();
                    }, 500);
                });
                it ('Удаляет последний элемент', (done)=> {
                    setTimeout(function(){
                        expect(sl._slidesElem.lastElementChild.dataset.type).to.be.equal('Zil Bichok');
                        done();
                    }, 500);
                });

            });
            describe ('#handleRightArrowClick()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params);
                    let elem = sl._elem.querySelector('.cSlider__rightArrow');
                    elem.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                });
                it ('Получает ширину слайда в пикселях (не тестируется модульно...)', ()=> {});
                it ('Изменяет ширину контейнера слайдов (не тестируется модульно...)', ()=> {});
                it ('Вычисляет новый step', ()=> {
                    expect(sl._step).to.be.equal(4);
                });
                it ('Вычисляет следующий слайд и добавляет его конец списка', ()=> {
                    expect(sl._slidesElem.lastElementChild.dataset.type).to.be.equal('Gazelle 3m');
                });
                it ('Устанавливает ширину всех слайдов в пикселях (не тестируется модульно...)', ()=> {});
                it ('Анимируем прокрутку вправо (не тестируется модульно...)', ()=> {});
                it ('Удаляет первый элемент', (done)=> {
                    setTimeout(function(){
                        expect(sl._slidesElem.firstElementChild.dataset.type).to.be.equal('Hyundai Porter');
                        done();
                    }, 500);
                });
                it ('Обнуляет отступ у контейнера слайдов', (done)=> {
                    setTimeout(function(){
                        expect(sl._slidesElem.style.marginLeft).to.be.equal('0px');
                        done();
                    }, 500);
                });
            });
            describe ('#handleSlideCkick()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params)
                });
                it ('Инициирует событие, имя которого передано в __options.slideClickEventName и передаёт ' +
                    'тип слайда', ()=> {
                    sl._elem.addEventListener(sl._options.slideClickEventName, (event)=> {
                        expect(event.detail.type).to.be.equal('Lada Largus')
                    });
                    sl._slidesElem.firstElementChild.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                });
            });
            describe ('#getSlidePixelWidth()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params)
                });
                it ('Возвращает ширину слайда в пикселях (не тестируется модульно...)', ()=> {
                    /*let container = document.createElement('div');
                    container.style.width = '400px';
                    container.append(sl.getElem());
                    throw new Error;*/
                });
            });
            describe ('#setSlidesWidth()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params)
                });
                it ('Устанавливает ширину для слайдов в пикселях (не тестируется модульно...)', ()=> {});
            });


            describe ('#()', ()=> {
                beforeEach(()=> {
                    sl = new Slider(params)
                });
                it ('', ()=> {

                });
            });


        })
    }
}

export {SliderSpec}