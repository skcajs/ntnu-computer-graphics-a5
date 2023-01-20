import * as THREE from 'three';

export default class Skyscraper extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        const loader = new THREE.TextureLoader();


        const cubeTextures = [
            'SkyscraperSide.png', 'SkyscraperSide.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'SkyscraperSide.png', 'SkyscraperSide.png'
        ];

        const textureCube = cubeTextures.map(texture => {
            return new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const cubeHeight = 2;
        const geometry = new THREE.BoxGeometry(1, cubeHeight, 1);
        const cube = new THREE.Mesh(geometry, textureCube);
        cube.position.y = cubeHeight / 2;
        cube.castShadow = true;
        this.add(cube);
    }
}