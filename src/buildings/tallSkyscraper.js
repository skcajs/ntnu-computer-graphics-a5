import * as THREE from 'three';

export default class TallSkyscraper extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        const loader = new THREE.TextureLoader();


        const cubeTextures = [
            'TallSkyscraperSide.png', 'TallSkyscraperSide.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'TallSkyscraperSide.png', 'TallSkyscraperSide.png'
        ];

        const textureCube = cubeTextures.map(texture => {
            return new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const cubeHeight = 3;
        const geometry = new THREE.BoxGeometry(1.25, cubeHeight, 1.25);
        const cube = new THREE.Mesh(geometry, textureCube);
        cube.position.y = cubeHeight / 2;
        cube.castShadow = true;
        this.add(cube);
    }
}