import * as THREE from 'three';
import Centerpiece from './buildings/centerpiece';
import Lbuilding from './buildings/lbuilding';
import Mall from './buildings/mall';
import Skyscraper from './buildings/skyscraper';
import TallSkyscraper from './buildings/tallSkyscraper';

export default class CityBlock extends THREE.Group {
    constructor(type) {
        super();
        this.type = type;
        this.initialise();
    }

    initialise() {
        this.addPlane(3.8, 3.8, 0x60a880);
        this.addPlane(0.1, 4, 0xFFFFFF, { x: 1.95, y: 0, z: 0 });
        this.addPlane(0.1, 4, 0xFFFFFF, { x: -1.95, y: 0, z: 0 });
        this.addPlane(4, 0.1, 0xFFFFFF, { x: 0, y: 0, z: 1.95 });
        this.addPlane(4, 0.1, 0xFFFFFF, { x: 0, y: 0, z: -1.95 });

        switch (this.type) {
            case 1: {
                this.typeOne();
                break;
            }
            case 2: {
                this.typeTwo();
                break;
            }
            case 3: {
                this.typeThree();
                break;
            }
            case 4: {
                this.typeFour();
                break;
            }
            case 5: {
                this.typeFive();
                break;
            }
            default: break;
        }
    }

    addPlane(len, wid, color, offset = { x: 0, y: 0, z: 0 }) {
        const planeGeometry = new THREE.PlaneGeometry(len, wid).rotateX(-Math.PI / 2);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: color });
        // const planeGeometry = new THREE.BoxGeometry(len, wid, 0.2).rotateX(-Math.PI / 2);
        // const planeMaterial = new THREE.MeshPhongMaterial({ color: color });
        planeMaterial.polygonOffset = true;
        planeMaterial.polygonOffsetFactor = -0.4;
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.position.x = offset.x;
        plane.position.y = offset.y;
        plane.position.z = offset.z;
        this.add(plane);
    };

    typeOne() {
        const skyscraper1 = new Skyscraper();
        skyscraper1.position.x = 1;
        skyscraper1.position.z = 1;
        skyscraper1.updateMatrixWorld();
        this.add(skyscraper1);

        const lbuilding1 = new Lbuilding();
        lbuilding1.position.x = -0.75;
        lbuilding1.position.z = 1;
        this.add(lbuilding1);
    }

    typeTwo() {
        const skyscraper1 = new Skyscraper();
        skyscraper1.position.x = -1;
        skyscraper1.position.z = 1;
        skyscraper1.updateMatrixWorld();
        this.add(skyscraper1);

        const skyscraper2 = new Skyscraper();
        skyscraper2.position.z = -1;
        skyscraper2.updateMatrixWorld();
        this.add(skyscraper2);

        const skyscraper3 = new Skyscraper();
        skyscraper3.position.x = 1;
        skyscraper3.position.z = 0.5;
        skyscraper3.updateMatrixWorld();
        this.add(skyscraper3);
    }

    typeThree() {
        const mall = new Mall();
        this.add(mall);
    }

    typeFour() {
        const skyscraper1 = new Skyscraper();
        skyscraper1.position.x = -1;
        skyscraper1.position.z = 1;
        skyscraper1.updateMatrixWorld();
        this.add(skyscraper1);

        const skyscraper2 = new Skyscraper();
        skyscraper2.position.x = 1;
        skyscraper2.position.z = 1;
        skyscraper2.updateMatrixWorld();
        this.add(skyscraper2);

        const tallSkyscraper = new TallSkyscraper();
        tallSkyscraper.rotateY(-Math.PI / 6);
        tallSkyscraper.position.x = 0;
        tallSkyscraper.position.z = -0.75;
        tallSkyscraper.updateMatrixWorld();
        this.add(tallSkyscraper);
    }

    typeFive() {
        const centerpiece = new Centerpiece();
        this.name = 'feature';
        this.add(centerpiece);
    }
}