import * as THREE from 'three';
import CityScene from './cityScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new CityScene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

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

const light = new THREE.AmbientLight(0xFFFFFF, 0.25);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.position.set(10, 2, 15);
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

const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
var draggable;


window.addEventListener('click', event => {
    if (draggable) {
        console.log(`dropping draggable ${draggable.userData.name}`);
        draggable = null;
        return;
    }
    mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouseClick, camera);
    const found = raycaster.intersectObjects(scene.children);
    if (found.length > 0 && found[0].object.userData.draggable) {
        draggable = found[0].object;
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
                console.log(draggable);
                // draggable.geometry.dispose();
                draggable.material.dispose();
                scene.remove(draggable);
                animate();
            }
        }
    }
});



function dragObject() {
    // if (draggable != null) {
    //     raycaster.setFromCamera(mouseMove, camera);
    //     const found = raycaster.intersectObjects(scene.children);
    //     if (found.length > 0) {
    //         for (let o of found) {
    //             if (!o.object.userData.ground) continue;

    //             draggable.position.x = o.point.x - draggable.position.x;
    //             draggable.position.z = o.point.z - draggable.position.z;

    //             console.log(draggable.position.x, o.point.x);
    //             console.log(draggable.position.y, o.point.z);
    //         }
    //     }
    // }
}


function addPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(50, 50).rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.userData.ground = true;
    scene.add(plane);
};




function animate() {
    // const time = Date.now() * 0.005;
    // directionalLight.position.x = Math.sin(time * 0.02) * 20;
    // directionalLight.position.y = Math.sin(time * 0.02) * 20;
    // directionalLight.position.z = Math.cos(time * 0.02) * 20;
    dragObject();
    requestAnimationFrame(animate);
    // controls.update();
    renderer.render(scene, camera);
}
animate();



renderer.render(scene, camera);




