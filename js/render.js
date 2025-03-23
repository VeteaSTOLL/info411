import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

const floorGeometry = new THREE.PlaneGeometry( 10, 10 );
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor= new THREE.Mesh( floorGeometry, floorMaterial );
scene.add( floor );

const playerGeometry = new THREE.CapsuleGeometry( .5, 1, 8, 16 );
const playerMaterial = new THREE.MeshStandardMaterial( { color: 0x3333ff } );
const player = new THREE.Mesh( playerGeometry, playerMaterial );
player.castShadow = true;
scene.add( player );

const otherPlayersMaterial = new THREE.MeshStandardMaterial( { color: 0xff3333 } );
var otherPlayers = {};

export function initOtherPlayers(){
    for (const [key, value] of Object.entries(position_table)) {
        if (!otherPlayers[key] && key != user.id){
            let p = new THREE.Mesh( playerGeometry, otherPlayersMaterial );
            p.castShadow = true;
            p.position.y = 1;
            scene.add(p);
            otherPlayers[key] = p;
        }        
    }
}
initOtherPlayers();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);


camera.position.z = 4;
camera.position.y = 4;
camera.rotation.x = -0.5;

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

player.position.y = 1;

const clock = new THREE.Clock;
var dt = 0;

function animate() {
    dt = clock.getDelta();
    updatePos(dt);

    player.position.x = playerCoords.x;
    player.position.z = -playerCoords.y;

    for (const [key, value] of Object.entries(otherPlayers)) {
        value.position.x = position_table[key].x;
        value.position.z = -position_table[key].y;
    }

	renderer.render( scene, camera );

}

window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}