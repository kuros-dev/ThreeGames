import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Vectoring } from './Vectoring.mjs';
import { Char } from './Char.mjs';
import { Declarations } from './declarations.mjs';
import { FirstPersonControls } from 'three/examples/jsm/Addons.js';
import { color, PI } from 'three/examples/jsm/nodes/Nodes.js';

const loader = new GLTFLoader().setPath('./models/');
// immediately use the texture for material creation 

var lastSec = 0

const vectoring = new Vectoring();
var currentFov = 70;
const object = [];
const scene = new THREE.Scene();

const animators = {};

const axis = new THREE.AxesHelper(100)
scene.add(axis)

const hitboxMesh = new THREE.MeshPhongMaterial({color: 0x60ff60})

const APscale = new THREE.Vector3(0.012, 0.012, 0.012);
const char = new Char(vectoring);
char.hitbox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), hitboxMesh)

char.camera.camera = new THREE.PerspectiveCamera(currentFov, window.innerWidth / window.innerHeight, 0.1, 90);
const declarations = new Declarations();
const fpc = new FirstPersonControls(char.camera.camera, document);

console.log(char)

// light
const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(0, 0, 0).normalize();
ambientLight.intensity = 0.8;
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffcf, 3);
directionalLight.target.position.set(3, 0, -1.0);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x303030);

// INPUT CONTROLLER

const inputs = declarations.inputs();
const values = declarations.values();

const leftHand = {
	isReady: false,
	model: {}
}

const rightHand = {
	isReady: false,
	model: {}
}

// MODELS/

const models = {}
const ready = {}
const solids = {}

// ABILITIES

// BUILDING


function createMap() {
	
	solids.ground = [];

	solids.ground.push({		model: models.block1.clone()	})
	console.log(solids.ground[0])
	solids.ground[0].model.position.set(-10, -2, 10)
	solids.ground[0].model.scale.set(20, 0.5, 15)

	solids.ground.push({		model: models.block1.clone()	})
	solids.ground[1].model.position.set(10, 0, -4)
	solids.ground[1].model.scale.set(8, 0.7, 7)
	
	// +2
	for (let i = 0; i < 13; i++){
		solids.ground.push({		model: models.fence.clone()	})
		solids.ground[2 + i].model.position.set(-9.5 + (6 * i), 0, -48.5)
	}
	//+15
	for (let i = 0; i < 13; i++){
		solids.ground.push({		model: models.fence.clone()	})
		solids.ground[15 + i].model.position.set(-9.5 + (6 * i), 0, 10)
	}
	// +28
	for (let i = 0; i < 10; i++){
		solids.ground.push({		model: models.fence.clone()	})
		solids.ground[28 + i].model.rotation.y = Math.PI / 2
		solids.ground[28 + i].model.position.set(-9.2, 0, 9.5 - (i * 6))
	}
	// +38
	for (let i = 0; i < 10; i++){
		solids.ground.push({		model: models.fence.clone()	})
		solids.ground[38 + i].model.rotation.y = Math.PI / 2
		solids.ground[38 + i].model.position.set(68.5, 0, 9.5 - (i * 6))
	}

	// +48
	solids.ground.push({		model: models.wooden_box.clone()	})
	solids.ground.push({		model: models.wooden_box.clone()	})
	solids.ground.push({		model: models.wooden_box.clone()	})
	solids.ground.push({		model: models.wooden_box.clone()	})
	solids.ground.push({		model: models.wooden_box.clone()	})

	solids.ground[48].model.position.set(35, 0, 0);
	solids.ground[49].model.position.set(38, 0, 1);
	solids.ground[50].model.position.set(9, 0, -7)
	solids.ground[51].model.position.set(9, 0, -6)
	solids.ground[52].model.position.set(9, 1, -7)

	solids.ground.push({		model: models.asset_home.clone()	})
	solids.ground.push({		model: models.asset_home.clone()	})

	solids.ground[53].model.position.set(8, 0, -37)
	solids.ground[54].model.position.set(35, 2.7, -18)

	solids.ground.push({		model: models.radio.clone()	})

	solids.ground[55].model.position.set(34, 2.9, -16)

	solids.ground[53].model.rotation.y = Math.PI / 3.5
	solids.ground[55].model.rotation.y = Math.PI / 3.7
	
	for (let element of solids.ground) {
		scene.add(element.model)
	};
}


// model loading as 

function defaultLoader(model, size, extension = ".glb"){
	loader.load(model + extension, function (gltf) {
		models[model] = gltf.scene;
		models[model].scale.set(size.x, size.y, size.z);
	
		ready[model] = true;
	
	}, undefined, function (error) {
		console.error(error);
	});
}

loader.load('knife.glb', function (gltf) {

	models.knife = gltf.scene;
	models.knife.scale.set(0.024, 0.024, 0.024);
	
	// leftHand.isReady = true;
	leftHand.model = models.knife;
	scene.add(leftHand.model)
	leftHand.isReady = true;
	ready.knife = true;
}, undefined, function (error) {
	console.error(error);
});

loader.load('volt.glb', function (gltf) {
	models.volt = gltf.scene;
	
	// rightHand.model.position.set(1, 0, 5);

	models.volt.scale.set(APscale.x, APscale.y, APscale.z);
	rightHand.model = models.volt
	scene.add(rightHand.model);

	rightHand.model = models.volt;
	rightHand.isReady = true
	ready.volt = true;

}, undefined, function (error) {
	console.error(error);
});

defaultLoader('volt_effects', APscale)
defaultLoader('fire', APscale)
defaultLoader('trap', APscale)
defaultLoader('frenzy', APscale)
defaultLoader('wooden_box', {x:0.05, y:0.05, z:0.05})
defaultLoader('tree1', {x:0.5, y:0.5, z:0.5})
defaultLoader('plataform', {x:0.5, y:0.5, z:0.5})
defaultLoader('block1', {x:0.5, y:0.5, z:0.5})
defaultLoader('fence', {x:0.035, y:0.02, z:0.02})
defaultLoader('asset_home', {x:0.02, y:0.02, z:0.02})
defaultLoader('raven', {x:0.02, y:0.02, z:0.02})
defaultLoader('wooden_box', {x:0.02, y:0.02, z:0.02})
defaultLoader('bot', {x:0.02, y:0.02, z:0.02})
defaultLoader('radio', {x:0.02, y:0.02, z:0.02})

// ---------------------------------------------------------------


function createWireframeBox(box3) {
    const size = new THREE.Vector3();
    box3.getSize(size);

    const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const wireframeGeometry = new THREE.WireframeGeometry(boxGeometry);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, material);

    return wireframe;
}


var lastMouseX = 0;
var lastMouseY = 0;

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

function changeFOV(newFOV) {
	camera.fov = newFOV; // Set the new FOV
	camera.updateProjectionMatrix(); // Update the camera's projection matrix
}

function isMoving(input) {
	if (input.W == 0 && input.A == 0 && input.S == 0 && input.D == 0) {
		return false;
	}
	return true;
}

// LISTENERS

document.addEventListener('keydown', function (event) {
	switch (event.key) {
		case 'w':
			inputs.W = values.move;
			break;
		case 's':
			inputs.S = values.move;
			break;
		case 'a':
			inputs.A = values.move;
			break;
		case 'd':
			inputs.D = values.move;
			break;

		case 'Space':
			if (!inputs.lastSpace) {
				// CHECK FLOOR COLLISION
				inputs.space = false;
				inputs.lastSpace = false;
			}
			break;
	}
});

document.getElementById("body").addEventListener("click", (event) => {
	document.body.requestPointerLock()
})

document.addEventListener('keyup', function (event) {
	switch (event.key) {
		case 'w':
			inputs.W = 0;
			break;
		case 's':
			inputs.S = 0;
			break;
		case 'a':
			inputs.A = 0;
			break;
		case 'd':
			inputs.D = 0;
			break;
		case 'Space':
			inputs.space = false;
			inputs.lastSpace = false;
			break;
	}


})


// FPS camera movement
document.addEventListener('mousemove', function (event) {

	const mouseX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;


	lastMouseX = event.clientX;
	lastMouseY = event.clientY;

	const theta = -mouseX * values.mSens * 0.004;
	const phi = -mouseY * values.mSens * 0.004;

	const spherical = new THREE.Spherical();
	spherical.setFromVector3(char.hands.pos.clone().sub(char.camera.camera.position));
	spherical.theta += theta;
	spherical.phi -= phi;

	spherical.makeSafe();

	char.hands.pos = new THREE.Vector3().setFromSpherical(spherical).add(char.camera.camera.position);
});

function checkCollisions() {
	if (char.hitboxMesh.intersectsBox(object[0])){
		console.log("kjhhbergikujbj")
	}
}

// createMap()
var temp = false;
function animate() {
	// COmPUTE ELEMENTS

	if (!temp && ready.hasOwnProperty('block1') && ready.hasOwnProperty("fence") && ready.hasOwnProperty("bot") && ready.hasOwnProperty("asset_home") && ready.hasOwnProperty("radio") && ready.hasOwnProperty("knife") && ready.hasOwnProperty("fire")){
		createMap();
		temp = true
	}
	// CHECKS
	char.checkGround();
	char.computeGravity();

	char.updateTransform(inputs, vectoring);
	fpc.lookAt(char.hands.pos)

	// PROCESS HANDS POSSITION AND ROTATION

	const cameraQuaternion = char.camera.camera.getWorldQuaternion(new THREE.Quaternion());

	// 4. Set the position of the model in front of the camera
	const distanceInFront = 0.3; // Adjust distance as needed

	if (rightHand.isReady) {

		const frontPosition = new THREE.Vector3(char.hands.right.x, char.hands.right.y, -distanceInFront);
		const axis = new THREE.Vector3(-1, 0, 0); // Adjust axis as needed
		const angle = Math.PI / 2; // 90 degrees in radians
		const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

		// 3. Combine the quaternions
		const combinedQuaternion = cameraQuaternion.clone().multiply(rotationQuaternion);
		frontPosition.applyQuaternion(cameraQuaternion); // Rotate the position vector by the camera's quaternion
		frontPosition.add(char.camera.camera.position); // Translate the position vector to the camera's position

		// 5. Apply the position and quaternion to the right hand model
		rightHand.model.position.copy(frontPosition);
		rightHand.model.quaternion.copy(combinedQuaternion);
	}

	if (leftHand.isReady) {

		const frontPosition = new THREE.Vector3(char.hands.left.x, char.hands.left.y, -distanceInFront);
		const axis = new THREE.Vector3(0, -1, 0); // Adjust axis as needed
		const angle = Math.PI / 8; // 90 degrees in radians
		const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

		// 3. Combine the quaternions
		const combinedQuaternion = cameraQuaternion.clone().multiply(rotationQuaternion);
		frontPosition.applyQuaternion(cameraQuaternion);
		frontPosition.add(char.camera.camera.position);

		leftHand.model.position.copy(frontPosition);
		leftHand.model.quaternion.copy(combinedQuaternion);
	}
	char.camera.animateWalk();

	char.isMoving = isMoving(inputs)

	char.applyCamEffects(vectoring);
	char.applyHandEffects();

	// START COMPUTING WORLD

	requestAnimationFrame(animate);
	renderer.render(scene, char.camera.camera);

	// checkCollisions();
}

animate();