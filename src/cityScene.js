import * as THREE from 'three';
import CityBlock from './cityBlock';
import ParkBlock from './parkBlock';

export default class CityScene extends THREE.Scene {
    constructor() {
        super();
        this.initialise();
    }

    initialise() {
        const parkBlock = new ParkBlock();
        parkBlock.position.z = 0;
        parkBlock.position.x = 0;
        parkBlock.rotateY(-Math.PI / 2);
        this.add(parkBlock);


        this.addCityBlock(1, -2, 4);
        this.addCityBlock(2, 2, 4);
        this.addCityBlock(2, 6, 4, -Math.PI);

        this.addCityBlock(3, 6, 0, -Math.PI / 2);
        this.addCityBlock(1, 6, -4, -Math.PI / 2);
        this.addCityBlock(2, 2, -4);
        this.addCityBlock(4, -2, -4, -Math.PI / 2);

        this.addCityBlock(5, -6, 0);
        this.addCityBlock(2, -6, 4);
        this.addCityBlock(2, -6, -4);
    }

    addCityBlock(i, x = 0, z = 0, r = 0) {
        const cityBlock = new CityBlock(i);
        cityBlock.position.x = x;
        cityBlock.position.z = z;
        cityBlock.rotateY(r);
        this.add(cityBlock);
    }
}