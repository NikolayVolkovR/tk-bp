
import chai from 'chai';
import {ModalWindow} from "./ModalWindow"

class ModalWindowSpec {
    constructor (params) {
        this.params = params;
        this.tests();
    }

    tests () {
        let unit;
        let expect = chai.expect;

        describe ('ModalWindow', ()=> {
            describe ('#constructor()', ()=> {
                beforeEach(()=> {
                    unit = new ModalWindow(this.params)
                });
                it ('Параметр params.shadowColor имеет значение по умолчанию "#000"', ()=> {
                    unit = new ModalWindow({});
                    expect(unit.params.shadowColor).to.be.equal("#000");
                });
                it ('Параметр params.shadowOpacity имеет значение по умолчанию "0.7"', ()=> {
                    expect(unit.params.shadowOpacity).to.be.equal(0.7);
                });
                it ('Параметр elems хранит ссылки на HTML элементы', ()=> {
                    expect(unit.elems).to.be.an('object');
                });
            });
        });



        describe ('', ()=> {
            beforeEach(()=> {
                unit = new ModalWindow(this.params)
            });
            it ('', ()=> {

            });
        });
    }
}

export {ModalWindowSpec}