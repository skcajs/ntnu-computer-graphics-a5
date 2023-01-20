import * as THREE from 'three';

export default class Centerpiece extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        const loader = new THREE.TextureLoader();

        const cubeTextures = [
            'CenterpieceSideInner.png', 'CenterpieceSideInner.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'CenterpieceSideInner.png', 'CenterpieceSideInner.png'
        ];

        const textureCube = cubeTextures.map(texture => {
            return new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const cubeHeight = 4;
        const geometry = new THREE.BoxGeometry(1, cubeHeight, 1);
        const cube = new THREE.Mesh(geometry, textureCube);
        cube.position.y = cubeHeight / 2;
        cube.castShadow = true;
        this.add(cube);

        this.createBlocks(loader, 1);
        this.createBlocks(loader, 2.5);
        this.createBlocks(loader, 4);

    }

    createBlocks(loader, n) {
        const cubeTextures = [
            'CenterpieceSideOuter.png', 'CenterpieceSideOuter.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'CenterpieceSideOuter.png', 'CenterpieceSideOuter.png'
        ];

        const textureCube = cubeTextures.map(texture => {
            return new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const cubeHeight = 1;
        const geometry = new THREE.BoxGeometry(1.25, cubeHeight, 1.25);
        const cube = new THREE.Mesh(geometry, textureCube);
        cube.position.y = cubeHeight * n;
        cube.castShadow = true;
        this.add(cube);
    }
}