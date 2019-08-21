import {Tests} from '../tests'
import {CarReader} from "../commons/CarReader"


let carsDataPromise = CarReader.getAll();

carsDataPromise.then((data)=> {
    let params = {
        cars: JSON.parse(data)
    }
    let tests = new Tests(params);
});

