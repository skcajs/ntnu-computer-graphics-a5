import * as THREE from 'three';
import CityScene from './cityScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import Plotly from 'plotly.js-dist-min';

const scene = new CityScene();

// Plotly.newPlot('myDiv', []);

let time = 0;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

camera.position.set(10, 5, 0);

camera.position.z = 5;

addPlane(scene);

const hmCamera = new THREE.PerspectiveCamera(75, 8 / 4, 0.1, 3);
hmCamera.rotateX(-Math.PI / 2);
hmCamera.position.set(0, 2.6, 0);
scene.add(hmCamera);

const light = new THREE.AmbientLight(0xFFFFFF, 0.25);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.position.set(10, 0, 15);
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

const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
var draggable;

var raycasters;
var hmCoords;

let toggleHeatMap = false;

// Raycast Helpers
var raycasterHelpers;
// for (let x = -hmResX; x <= hmResX; x++) {
//     for (let z = -hmResZ / 2; z <= hmResZ / 2; z++) {
//         hmCoords.push([x * 4 / hmResX, z * 4 / hmResZ]);
//         const hmRayCaster = new THREE.Raycaster(new Vector3(x * 4 / hmResX, 0, z * 4 / hmResZ));
//         // const raycasterHelper = new THREE.ArrowHelper(hmRayCaster.ray.direction, hmRayCaster.ray.origin, 300, 0xFFFFFF);
//         raycasters.push(hmRayCaster);
//         // raycasterHelpers.push(raycasterHelper);
//         // scene.add(raycasterHelper);
//     }
// }

// Raycast Helper
// const rayCasterHelper = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xFFFFFF);
// scene.add(rayCasterHelper);


const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xffffff);
scene.add(directionalLightHelper);


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
        case "KeyH": {
            calculateHeatMap();
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

function animate() {
    time += 0.03;
    directionalLight.position.x = Math.sin(time * 0.02) * 20;
    directionalLight.position.y = Math.sin(time * 0.02) * 20;
    directionalLight.position.z = Math.cos(time * 0.02) * 20;

    // // TESTING INTERSECTON POINTS
    // const rayCasterLighDir = new THREE.Vector3(directionalLight.position.x, directionalLight.position.y, directionalLight.position.z);
    // raycaster.set(new THREE.Vector3(0, 0, 2), rayCasterLighDir.normalize());

    // const found = raycaster.intersectObjects(scene.children);
    // if (found.length > 0 && found.some(obj => obj.object.castShadow == true)) {
    //     rayCasterHelper.line.material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // } else {
    //     rayCasterHelper.line.material = new THREE.LineBasicMaterial({ color: 0xffffff });
    // }
    // rayCasterHelper.setDirection(raycaster.ray.direction);
    // rayCasterHelper.position.set(raycaster.ray.origin.x, raycaster.ray.origin.y, raycaster.ray.origin.z);
    // // ----------

    // TESTING WITH MANY POINTS

    if (toggleHeatMap) {
        const rayCasterLighDir = new THREE.Vector3(directionalLight.position.x, directionalLight.position.y, directionalLight.position.z);
        raycasters.map((raycaster, i) => {
            raycaster.set(raycaster.ray.origin, rayCasterLighDir.normalize());
            raycasterHelpers[i].setDirection(raycaster.ray.direction);
            const found = raycaster.intersectObjects(scene.children);
            if (found.length > 0 && found.some(obj => obj.object.castShadow == true)) {
                raycasterHelpers[i].line.material = new THREE.LineBasicMaterial({ color: 0xff0000 });
                hmCoords[i][2] += 1;
            } else {
                raycasterHelpers[i].line.material = new THREE.LineBasicMaterial({ color: 0xffffff });
            }
        });

        // let data = heatmapData(hmCoords);
        // Plotly.newPlot('myDiv', data);
    }


    dragObject();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

renderer.render(scene, camera);


function calculateHeatMap() {
    if (toggleHeatMap) {
        directionalLightHelper.color = 0xffffff;
        directionalLightHelper.update();
        toggleHeatMap = !toggleHeatMap;
        let data = heatmapData(hmCoords);
        Plotly.newPlot('myDiv', data, {
            marker: false,
            width: 800,
            height: 400,

        });
        console.log(data);
        console.log(hmCoords);
        return;
    }
    directionalLightHelper.color = 0xff0000;
    directionalLightHelper.update();
    raycasters = [];
    raycasterHelpers = [];
    hmCoords = [];
    toggleHeatMap = !toggleHeatMap;

    const xLen = 8;
    const zLen = 4;

    const hmResX = 16;
    const hmResZ = 8;

    for (let z = - zLen / 2; z <= zLen / 2; z += zLen / hmResZ) {
        for (let x = -xLen / 2; x <= xLen / 2; x += xLen / hmResX) {
            hmCoords.push([x, z, 0]);
            const hmRayCaster = new THREE.Raycaster(new Vector3(x, 0, z));
            const raycasterHelper = new THREE.ArrowHelper(hmRayCaster.ray.direction, hmRayCaster.ray.origin, 300, 0xFFFFFF);
            raycasters.push(hmRayCaster);
            raycasterHelpers.push(raycasterHelper);
            // scene.add(raycasterHelper);
        }
    }
    time = 0;
    directionalLight.position.set(10, 0, 15);
}

function heatmapData(data) {
    let x = [], y = [], z = [];
    let zInt = [];
    let lasty = -2;
    data.forEach(obj => {
        let currentx = obj[0];
        let currenty = obj[1];
        if (currenty == lasty) {
            zInt.push(obj[2]);
            if (!x.some(i => i == currentx)) {
                x.push(currentx);
            }
        } else {
            if (!y.some(i => i == lasty)) {
                y.push(lasty);
            }
            lasty = currenty;
            z.push(zInt);
            zInt = [];
            zInt.push(obj[2]);
        }
    });
    return [{ x: x, y: y, z: z, type: 'heatmap' }];
}


