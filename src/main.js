import * as THREE from 'three';
import CityScene from './cityScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import Plotly from 'plotly.js-dist-min';
import Skyscraper from './buildings/skyscraper';
import { Mesh } from 'three';

const scene = new CityScene();

var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 8;
canvas.height = 8;

ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#ff00ff';
ctx.strokeRect(0, 0, canvas.width, canvas.height);

var parser = new DOMParser();

let time = 0;
let sudoTime = 0;

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

let showHeatMap = false;

let showLights = false;
const lights = createLights();

// Raycast Helpers
var raycasterHelpers;
let showRaycasterHelpers = false;

let showDirectionalLightHelper = false;
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xffff00);

window.addEventListener('mousedown', event => {
    mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;
    switch (event.button) {
        case 0: // left
            if (draggable) {
                console.log(`dropping draggable ${draggable.userData.name}`);
                draggable.material = draggable.userData.baseMaterial;
                draggable = null;
                return;
            }
            raycaster.setFromCamera(mouseClick, camera);
            const found = raycaster.intersectObjects(scene.children);
            if (found.length > 0 && found[0].object.userData.draggable) {
                draggable = found[0].object;
                draggable.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
                console.log(`found draggable ${draggable.userData.name}`);
            }
            break;
        case 1: // middle
            break;
        case 2: // right
            if (draggable) {
                console.log(`dropping copy of draggable ${draggable.userData.name}`);
                const clone = draggable.parent.clone(false);
                draggable.parent.parent.add(clone);
                return;
            }
            break;
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
            break;
        }
        case "KeyJ": {
            showRaycasterHelpers = !showRaycasterHelpers;
            break;
        }
        case "KeyS": {
            showDirectionalLightHelper = !showDirectionalLightHelper;
            if (showDirectionalLightHelper) {
                scene.add(directionalLightHelper);
            } else {
                scene.remove(directionalLightHelper);
            }
            break;
        }

        case "KeyL": {
            showLights = !showLights;
            if (showLights) {
                lights.forEach(light => scene.add(light['light']).add(light['lightbar']).add(light['lightrchelper']));
            } else {
                lights.forEach(light => scene.remove(light['light']).remove(light['lightbar']).remove(light['lightrchelper']));
            }

        }
    }
});

function animate() {
    time += 0.03;
    directionalLight.position.x = Math.sin(time * 0.02) * 20;
    directionalLight.position.y = Math.sin(time * 0.02) * 20;
    directionalLight.position.z = Math.cos(time * 0.02) * 20;
    const rayCasterLighDir = new THREE.Vector3(directionalLight.position.x, directionalLight.position.y, directionalLight.position.z).normalize();

    if (showHeatMap) {
        raycasters.map((raycaster, i) => {
            raycaster.set(raycaster.ray.origin, rayCasterLighDir);
            raycasterHelpers[i].setDirection(raycaster.ray.direction);
            const found = raycaster.intersectObjects(scene.children);
            if (found.length > 0 && found.some(obj => obj.object.castShadow == true)) {
                raycasterHelpers[i].line.material = new THREE.LineBasicMaterial({ color: 0xff0000 });
                hmCoords[i][2] += 1;
            } else {
                raycasterHelpers[i].line.material = new THREE.LineBasicMaterial({ color: 0xffffff });
            }
        });

        raycasterHelpers.forEach(helper => helper.visible = showRaycasterHelpers);

        if (sudoTime == 100) {
            sudoTime = 0;
            heatmapImage();
        }

        sudoTime += 1;
    }

    if (showLights) {
        lights.forEach(light => {
            light['lightrc'].set(light['lightrc'].ray.origin, rayCasterLighDir);
            let smallestHeight = 0.2;
            let intensity = (new THREE.Vector3(0, 1, 0).dot(rayCasterLighDir) / (Math.sqrt(1 + (rayCasterLighDir.x ** 2 + rayCasterLighDir.y ** 2 + rayCasterLighDir.z ** 2))));
            intensity = intensity > 0 ? intensity : 0;
            let inSun = 1;
            light['lightrchelper'].setDirection(light['lightrc'].ray.direction);
            const found = light['lightrc'].intersectObjects(scene.children);
            if (((found.length > 0 && found.some(obj => obj.object.castShadow == true)))) {
                light['lightrchelper'].line.material = new THREE.LineBasicMaterial({ color: 0xff0000 });
                inSun = 0;
            } else {
                light['lightrchelper'].line.material = new THREE.LineBasicMaterial({ color: 0xffffff });
            }

            light['lightval'] += intensity * inSun / 200;
            light['lightbar'].scale.y = light['lightval'];
        });
        console.log(lights[0]['lightval'], lights[1]['lightval'], lights[2]['lightval']);
    }

    directionalLightHelper.update();

    dragObject();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

renderer.render(scene, camera);

function calculateHeatMap() {
    if (showHeatMap) {
        // If we are already showing the heatmap, we want to switch it off
        showRaycasterHelpers = false;
        raycasterHelpers.forEach(raycasterHelper => scene.remove(raycasterHelper));
        scene.children[0].children[0].material = scene.children[0].children[0].userData.baseMaterial;
        showHeatMap = false;
        return;
    }
    showHeatMap = true;
    raycasters = [];
    raycasterHelpers = [];
    hmCoords = [];


    const xLen = 8;
    const zLen = 4;

    const hmResX = 16;
    const hmResZ = 8;

    for (let z = - zLen / 2; z <= zLen / 2; z += zLen / hmResZ) {
        for (let x = -xLen / 2; x <= xLen / 2; x += xLen / hmResX) {
            hmCoords.push([x, z, 0]);
            const hmRayCaster = new THREE.Raycaster(new Vector3(x, 0, z));
            raycasters.push(hmRayCaster);
            const raycasterHelper = new THREE.ArrowHelper(hmRayCaster.ray.direction, hmRayCaster.ray.origin, 300, 0xFFFFFF);
            raycasterHelpers.push(raycasterHelper);
            if ((x % 2 == 0) && (z % 2 == 0) && ((Math.abs(x) + Math.abs(z) != 0))) {
                scene.add(raycasterHelper);
            }
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

function heatmapImage() {
    let data = heatmapData(hmCoords);
    Plotly.newPlot('myDiv', data, {
        marker: false,
        width: 800,
        height: 400,

    });
    let image = new Image();
    const el = document.getElementsByClassName('hm')[0].innerHTML;
    const doc = parser.parseFromString(el, "text/html");
    rotate(doc.body.children[0].getAttribute("xlink:href"), 90, function (resultBase64) {
        image.setAttribute('src', resultBase64);
        let texture = new THREE.Texture();
        texture.image = image;
        image.onload = function () {
            texture.needsUpdate = true;
        };
        scene.children[0].children[0].material = new THREE.MeshPhongMaterial({ map: texture });
    });
}

function rotate(srcBase64, degrees, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = function () {
        canvas.width = degrees % 180 === 0 ? image.width : image.height;
        canvas.height = degrees % 180 === 0 ? image.height : image.width;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.scale(-1, 1);
        ctx.drawImage(image, image.width / -2, image.height / -2);

        callback(canvas.toDataURL());
    };

    image.src = srcBase64;
}

function createLights() {
    const light1 = addLightElement(0xff00ff, 0.2, -7, 1);
    const light2 = addLightElement(0xffff00, 0.2, 5, 4);
    const light3 = addLightElement(0x00ffff, 0.2, 7, -5);

    const lightbar1 = addLightElement(0xff00ff, 0.4, 2, 1);
    const lightbar2 = addLightElement(0xffff00, 0.4, 2, 0);
    const lightbar3 = addLightElement(0x00ffff, 0.4, 2, -1);

    const lightrc1 = new THREE.Raycaster(new Vector3(-7, 0, 1));
    const lightrc2 = new THREE.Raycaster(new Vector3(5, 0, 4));
    const lightrc3 = new THREE.Raycaster(new Vector3(7, 0, -5));

    const lightrchelper1 = new THREE.ArrowHelper(lightrc1.ray.direction, new THREE.Vector3(-7, 0, 1), 300, 0xFFFFFF);
    const lightrchelper2 = new THREE.ArrowHelper(lightrc2.ray.direction, new THREE.Vector3(5, 0, 4), 300, 0xFFFFFF);
    const lightrchelper3 = new THREE.ArrowHelper(lightrc3.ray.direction, new THREE.Vector3(7, 0, -5), 300, 0xFFFFFF);


    return [
        { light: light1, lightbar: lightbar1, lightrc: lightrc1, lightrchelper: lightrchelper1, lightval: 0 },
        { light: light2, lightbar: lightbar2, lightrc: lightrc2, lightrchelper: lightrchelper2, lightval: 0 },
        { light: light3, lightbar: lightbar3, lightrc: lightrc3, lightrchelper: lightrchelper3, lightval: 0 },];
}

function addLightElement(color, size, offsetx = 0, offsetz = 0) {
    const lightPlaneGeometery = new THREE.BoxGeometry(size, 0.2, size);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const plane = new THREE.Mesh(lightPlaneGeometery, material);
    plane.position.x = offsetx;
    plane.position.y = 0.2 / 2;
    plane.position.z = offsetz;
    return plane;
}

function dragObject() {
    if (draggable != null) {
        raycaster.setFromCamera(mouseMove, camera);
        const found = raycaster.intersectObjects(scene.children);
        if (found.length > 0) {
            for (let o of found) {
                if (!o.object.userData.ground) continue;
                const building = draggable.parent;
                const parent = draggable.parent.parent;
                building.position.x = o.point.x - parent.position.x;
                building.position.z = o.point.z - parent.position.z;
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