import * as THREE from 'three';

export default class Mall extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        const loader = new THREE.TextureLoader();


        const cubeTextures = [
            'MallFront.png', 'MallFront.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'MallFront.png', 'MallFront.png'
        ];

        const textureCube = cubeTextures.map(texture => {
            return new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: loader.load(`/textures/${texture}`) });
        });

        const cubeHeight = 1.25;
        const geometry = new THREE.BoxGeometry(1, cubeHeight, 1);
        const cube = new THREE.Mesh(geometry, textureCube);
        cube.position.y = cubeHeight / 2;
        cube.position.z = 0.25;
        cube.castShadow = true;
        cube.name = 'building';
        this.add(cube);

        const cubeTextures2 = [
            'MallSide2.png', 'MallSide2.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'MallFront2.png', 'MallFront2.png'
        ];

        const textureCube2 = cubeTextures2.map(texture => {
            return new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const cubeHeight2 = 0.8;
        const geometry2 = new THREE.BoxGeometry(2.5, cubeHeight2, 1);
        const cube2 = new THREE.Mesh(geometry2, textureCube2);
        cube2.position.z = -0.25;
        cube2.position.y = cubeHeight2 / 2;
        cube2.castShadow = true;
        cube2.name = 'building';
        this.add(cube2);
    }
}