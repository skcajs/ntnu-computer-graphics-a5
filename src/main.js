import * as THREE from 'three';
import CityScene from './cityScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new CityScene();

let animateDNCycle = true;

let time = 0;
let imageTime = 0;
let heatMapData = [];

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

camera.position.set(10, 5, 0);

camera.position.z = 5;

controls.update();

addPlane(scene);

const hmCamera = new THREE.PerspectiveCamera(75, 8 / 4, 0.1, 3);
hmCamera.rotateX(-Math.PI / 2);
hmCamera.position.set(0, 2.6, 0);
scene.add(hmCamera);

const light = new THREE.AmbientLight(0xFFFFFF, 0.25);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
// directionalLight.position.set(10, 0, 15);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);


const d = 10;
directionalLight.shadow.camera.left = - d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = - d;

directionalLight.shadow.mapSize.width = 1024; // default
directionalLight.shadow.mapSize.height = 1024; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 1024; // default

// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(helper);

// const helper = new THREE.CameraHelper(hmCamera);
// scene.add(helper);

const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
var draggable;


window.addEventListener('click', event => {
    if (draggable) {
        console.log(`dropping draggable ${draggable.userData.name}`);
        console.log(draggable);
        draggable.material = draggable.userData.baseMaterial;
        draggable = null;
        return;
    }
    mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouseClick, camera);
    const found = raycaster.intersectObjects(scene.children);
    if (found.length > 0 && found[0].object.userData.draggable) {
        draggable = found[0].object;
        draggable.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        console.log(`found draggable ${draggable.userData.name}`);
    }
});

window.addEventListener('mousemove', event => {
    mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseMove.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('keydown', event => {
    switch (event.code) {
        case "Delete": {
            // delete
            if (draggable) {
                parent = draggable.parent;
                parent.remove(draggable);
                draggable = null;
                animate();
            }
            break;
        }
    }
});



function dragObject() {
    if (draggable != null) {
        raycaster.setFromCamera(mouseMove, camera);
        const found = raycaster.intersectObjects(scene.children);
        if (found.length > 0) {
            for (let o of found) {
                if (!o.object.userData.ground) continue;

                const building = draggable.parent;
                const parent = draggable.parent.parent;

                building.position.x = o.point.x.toPrecision(2) - parent.position.x.toPrecision(2);
                building.position.z = o.point.z.toPrecision(2) - parent.position.z.toPrecision(2);
            }
        }
    }
}


function addPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(20, 15).rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.MeshPhongMaterial({});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.visible = false;
    plane.userData.ground = true;
    scene.add(plane);
};

function calculateHeatMap() {
    time = 0;
    heatMapData = [];
    directionalLight.position.set(10, 0, 15);

    if (animateDNCycle) {
        animateDayNightCycle();
    }

}

function animateDayNightCycle() {
    time += 0.001;
    imageTime += 1;
    if (directionalLight.position.x >= 0) {
        if (imageTime % 50 == 1) {
            renderer.render(scene, hmCamera);
            const imgData = renderer.domElement.toDataURL();
            heatMapData.push(imgData);
            renderer.render(scene, camera);
        }
        directionalLight.position.x = Math.sin(time * 0.02) * 20;
        directionalLight.position.y = Math.sin(time * 0.02) * 20;
        directionalLight.position.z = Math.cos(time * 0.02) * 20;
    }
    else {
        animateDNCycle = false;
        directionalLight.position.set(10, 5, 15);
        console.log(heatMapData);
        return;
    }
    requestAnimationFrame(animateDayNightCycle);
}



function animate() {

    time += 0.03;
    // animateDayNightCycle(time);

    dragObject();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

renderer.render(scene, camera);

calculateHeatMap(renderer, scene, hmCamera);






