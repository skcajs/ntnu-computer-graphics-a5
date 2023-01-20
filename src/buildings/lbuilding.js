import * as THREE from 'three';

export default class Lbuilding extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        const loader = new THREE.TextureLoader();

        const cubeTextures = [
            'LbuildingShort.png', 'LbuildingShort.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'LbuildingLong.png', 'LbuildingLong.png'
        ];

        const textureCube = cubeTextures.map(texture => {
            return new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const cubeHeight = 1;
        const geometry = new THREE.BoxGeometry(1.5, cubeHeight, 1);
        const cube = new THREE.Mesh(geometry, textureCube);
        cube.position.y = cubeHeight / 2;
        cube.castShadow = true;

        this.add(cube);

        const cubeTextures2 = [
            'LbuildingLong2.png', 'LbuildingLong2.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'LbuildingShort2.png', 'LbuildingShort2.png'
        ];

        const textureCube2 = cubeTextures2.map(texture => {
            return new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const cubeHeight2 = 1.5;
        const geometry2 = new THREE.BoxGeometry(1, cubeHeight2, 2);
        const cube2 = new THREE.Mesh(geometry2, textureCube2);
        cube2.position.y = cubeHeight2 / 2;
        cube2.position.x = -0.25;
        cube2.position.z = -1.5;
        cube2.castShadow = true;

        this.add(cube2);



    }
}