import * as THREE from 'three';

export default class BaseBlock extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        this.addPlane(3.8, 3.8, 0x60a880);
        this.addPlane(0.1, 4, 0xFFFFFF, { x: 1.95, y: 0, z: 0 });
        this.addPlane(0.1, 4, 0xFFFFFF, { x: -1.95, y: 0, z: 0 });
        this.addPlane(4, 0.1, 0xFFFFFF, { x: 0, y: 0, z: 1.95 });
        this.addPlane(4, 0.1, 0xFFFFFF, { x: 0, y: 0, z: -1.95 });
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
        // plane.userData.ground = true;
        this.add(plane);
    };
}