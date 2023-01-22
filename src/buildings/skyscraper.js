import * as THREE from 'three';

export default class Skyscraper extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        const loader = new THREE.TextureLoader();


        const skyscraperTextures = [
            'SkyscraperSide.png', 'SkyscraperSide.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'SkyscraperSide.png', 'SkyscraperSide.png'
        ];

        const textureSkyscraper = skyscraperTextures.map(texture => {
            return new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const skyscraperHeight = 2;
        const geometry = new THREE.BoxGeometry(1, skyscraperHeight, 1);
        const skyscraper = new THREE.Mesh(geometry, textureSkyscraper);
        skyscraper.position.y = skyscraperHeight / 2;
        skyscraper.castShadow = true;
        skyscraper.userData.draggable = true;
        skyscraper.userData.name = 'skyscraper';
        skyscraper.userData.baseMaterial = skyscraper.material;
        this.add(skyscraper);
    }
}