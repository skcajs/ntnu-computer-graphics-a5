import * as THREE from 'three';
import Lbuilding from './buildings/lbuilding';
import Skyscraper from './buildings/skyscraper';

export default class ParkBlock extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }

    initialise() {
        this.addPlane(3.8, 7.8, 0x60a880);
        this.addPlane(0.1, 8, 0xFFFFFF, { x: 1.95, y: 0, z: 0 });
        this.addPlane(0.1, 8, 0xFFFFFF, { x: -1.95, y: 0, z: 0 });
        this.addPlane(4, 0.1, 0xFFFFFF, { x: 0, y: 0, z: 3.95 });
        this.addPlane(4, 0.1, 0xFFFFFF, { x: 0, y: 0, z: -3.95 });

    }

    addPlane(len, wid, color, offset = { x: 0, y: 0, z: 0 }) {
        const planeGeometry = new THREE.PlaneGeometry(len, wid).rotateX(-Math.PI / 2);
        const planeMaterial = new THREE.MeshPhongMaterial({ color: color });
        planeMaterial.polygonOffset = true;
        planeMaterial.polygonOffsetFactor = -0.4;
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.x = offset.x;
        plane.position.y = offset.y;
        plane.position.z = offset.z;
        plane.receiveShadow = true;
        this.add(plane);
    };
}