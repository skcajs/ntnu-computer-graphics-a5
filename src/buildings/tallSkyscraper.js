import * as THREE from 'three';

export default class TallSkyscraper extends THREE.Group {
    constructor() {
        super();
        this.initialise();
    }
    initialise() {
        const loader = new THREE.TextureLoader();


        const skyscraperTextures = [
            'TallSkyscraperSide.png', 'TallSkyscraperSide.png',
            'SkyscraperTop.png', 'SkyscraperTop.png',
            'TallSkyscraperSide.png', 'TallSkyscraperSide.png'
        ];

        const textureSkyscraper = skyscraperTextures.map(texture => {
            return new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: loader.load(`../../textures/${texture}`) });
        });

        const skyscraperHeight = 3;
        const geometry = new THREE.BoxGeometry(1.25, skyscraperHeight, 1.25);
        const skyscraper = new THREE.Mesh(geometry, textureSkyscraper);
        skyscraper.position.y = skyscraperHeight / 2;
        skyscraper.castShadow = true;
        skyscraper.userData.draggable = true;
        skyscraper.userData.name = 'tallSkyscraper';
        skyscraper.userData.baseMaterial = skyscraper.material;
        this.add(skyscraper);
    }
}