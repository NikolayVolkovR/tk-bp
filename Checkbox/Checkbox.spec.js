
import chai from 'chai';
import {Checkbox} from "./Checkbox"

class CheckboxSpec {
    constructor (params) {
        this.tests();
    }

    tests () {
        let cb;
        let expect = chai.expect;
        describe('Checkbox', ()=> {
            describe('#constructor()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox({
                        label: 'Текст',
                        type: 'sideLoading'
                    });
                });

                it ('Принимает начальное положение state, если оно передано', ()=> {
                    let cb = new Checkbox({state: 'disabled'});
                    expect(cb.state).to.be.equal('disabled');
                });
                it ('Если state не передано, устанавливает его в ready', ()=> {
                    expect(cb.state).to.be.equal('ready');
                });
                it ('Принимает labelText (текст лэйбла)', ()=> {
                    expect(cb.labelText).to.be.equal('Текст');
                });
                it ('Принимает type (значение data-type) если оно передано', ()=> {
                    expect(cb.type).to.be.equal('sideLoading');
                });
                it ('Запускает render()', ()=> {
                    expect(cb.elem).to.be.exist;
                });
                it ('Запускает setDate()', ()=> {
                    expect(cb.elem.dataset.type).to.be.equal('sideLoading');
                });
                it ('Запускает setSrcByState()', ()=> {
                    expect(cb.imageElem.src.indexOf('ready.svg') > 0).to.be.true;
                });
                it ('Запускает handleDisabledClass()', ()=> {
                    cb = new Checkbox({
                        state: 'disabled',
                        label: 'Текст',
                        type: 'sideLoading'
                    });
                    expect(cb.elem.classList.contains('disabled')).to.be.true;
                })

            });
            describe('#render()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox({
                        label: 'Текст'
                    });
                });

                it ('Создаёт корневой элемент с классом cCheckbox,' +
                    'добавляет в него картинку с классом cCheckbox-image, ' +
                    'добавляет в него div.cCheckbox-label и записывает в this.elem', ()=> {
                    expect(cb.elem.classList.contains('cCheckbox')).to.be.true;
                    expect(cb.elem.querySelector('.cCheckbox-image')).to.be.exist;
                    expect(cb.elem.querySelector('.cCheckbox-label')).to.be.exist;
                });
                it ('Присваивает текст лэйбла', ()=> {
                    expect(cb.labelElem.innerHTML).to.be.equal('Текст');
                })
            });
            describe('#handleEvent()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox({
                        type: 'sideLoading',
                        label: 'Текст'
                    });
                });

                it ('Инициирует событие "checkbox-click", передаёт свой тип и состояние', ()=> {
                    cb.elem.addEventListener('checkbox-click', (event)=> {
                        expect(event.detail.type).to.be.equal('sideLoading');
                        expect(event.detail.state).to.be.equal('checked');
                    });
                    cb.elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                });
            });
            describe('#getElem()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox();
                });
                it('Возвращяет элемент',()=> {
                    expect(cb.getElem().classList.contains('cCheckbox')).to.be.true;
                });
            });
            describe('#setData()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox({
                        label: 'Текст',
                        type: 'sideLoading'
                    });
                });
                it ('Устанавливает type в dataset элемента', ()=> {
                    expect(cb.elem.dataset.type).to.be.equal('sideLoading');
                })
            });
            describe('#getState()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox({
                        state: 'checked-disabled'
                    });
                });
                it ('Возвращает state', ()=> {
                    expect(cb.getState()).to.be.equal('checked-disabled');
                })
            });
            describe('#setSrcByState()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox({state: 'disabled'});
                });
                it ('Устанавливает src в соответствии со state', ()=> {
                    expect(cb.imageElem.src.indexOf('disabled') > 0).to.be.true;
                });
            });
            describe('#handleDisabledClass()', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox({state: 'disabled'});
                });
                it ('Добавляет сласс .disbled, если чекбокс заблокирован', ()=> {
                    expect(cb.elem.classList.contains('disabled')).to.be.true;
                });
            });
            describe('#setState(state)', ()=> {
                beforeEach(()=> {
                    cb = new Checkbox();
                    cb.setState('checked');
                });
                it ('Изменяет state', ()=> {
                    expect(cb.state).to.be.equal('checked');
                });
                it ('Изменяет src', ()=> {
                    expect(cb.imageElem.src.indexOf('checked.svg') > 0).to.be.true;
                });
                it ('Вызывает handleDisabledClass()', ()=> {
                    cb = new Checkbox();
                    cb.setState('disabled');
                    expect(cb.elem.classList.contains('disabled')).to.be.true;
                });
            });
            describe('#isDisabled()', ()=> {
                it ('Возвращает true, если чекбокс заблокирован', ()=> {
                    cb = new Checkbox({
                        state: 'disabled'
                    });
                    expect(cb.isDisabled()).to.be.true;
                });
                it ('Возвращает false, если чекбокс активен', ()=> {
                    cb = new Checkbox();
                    expect(cb.isDisabled()).to.be.false;
                });
            });

        })
    }
}

export {CheckboxSpec}