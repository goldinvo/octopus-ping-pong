import * as THREE from 'three';
import { Ball } from '/ball';
import { Vector3 } from 'three';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import {CONST} from './parameters';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

//first person camera
const controls = new FlyControls(camera, renderer.domElement);
const CAM_MOVE_SPD = 100;
const CAM_ROLL_SPD = Math.PI / 4;
controls.movementSpeed = CAM_MOVE_SPD;
controls.domElement = renderer.domElement;
controls.rollSpeed = CAM_ROLL_SPD;
controls.autoForward = false;
controls.dragToLook = true;
let cam_on = false;


let ball = new Ball();
scene.add( ball.getBall() );

//plane
const planeGeo = new THREE.PlaneGeometry( CONST.TABLE_X, CONST.TABLE_Z );
const planeMat = new THREE.MeshPhongMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );
plane.receiveShadow = true;
scene.add( plane );
plane.rotateX(Math.PI/2);

//net
const netGeo = new THREE.PlaneGeometry( CONST.NET_X, CONST.NET_Y );
const netMat = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
const net = new THREE.Mesh( netGeo, netMat );
net.position.y = CONST.NET_Y / 2;
scene.add( net );

//floor
const floorGeo = new THREE.PlaneGeometry( CONST.FLOOR_XZ, CONST.FLOOR_XZ );
const floorMat = new THREE.MeshPhongMaterial( {color: 0x765432, side: THREE.DoubleSide} );
const floor = new THREE.Mesh( floorGeo, floorMat );
// floor.receiveShadow = true;
scene.add( floor );
floor.position.y = CONST.FLOOR_Y_POS;
floor.rotateX(Math.PI/2);

//add light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 50, 0);
light.castShadow = true;
scene.add(light);
light.shadow.camera.left = -1 * (CONST.TABLE_X / 2);
light.shadow.camera.right = CONST.TABLE_X / 2;
light.shadow.camera.bottom = -1 * (CONST.TABLE_Z / 2);
light.shadow.camera.top = CONST.TABLE_Z / 2;

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

//camera position
camera.position.z = 0;
camera.position.x = 0;
camera.position.y = 180;
camera.lookAt(0, 0, 0);

function animate() {
	requestAnimationFrame( animate );
	const deltaT = clock.getDelta();
	ball.update(deltaT);
	if (cam_on) {
		controls.update(deltaT);
	}
	// camera.lookAt(ball.sphere.position);
	renderer.render( scene, camera );
}
animate();

addEventListener("keydown", (event) => {
	switch(event.key) {
		//Reset Round
		case('p'):
			ball.reset();
			break;
		//Turn Fly Camera On/Off
		case('o'):
			cam_on = !cam_on;
			break;
		default:
			break;
	}
});

