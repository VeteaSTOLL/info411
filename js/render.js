import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

const texture = new THREE.TextureLoader().load( "./img/texture_herbe.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 20, 20 );

const floorGeometry = new THREE.PlaneGeometry( 100, 100 );
floorGeometry.rotateX( - Math.PI / 2 );
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
floorMaterial.map = texture;
const floor= new THREE.Mesh( floorGeometry, floorMaterial );
floor.receiveShadow = true;
scene.add( floor );

const playerGeometry = new THREE.CapsuleGeometry( .5, 1, 8, 16 );
const playerMaterial = new THREE.MeshStandardMaterial( { color: 0x3333ff } );
const player = new THREE.Mesh( playerGeometry, playerMaterial );
player.castShadow = true;
scene.add( player );

const otherPlayersMaterial = new THREE.MeshStandardMaterial( { color: 0xff3333 } );

var otherPlayers = {};
export function updateOtherPlayers(){
    for (const [id, pos] of Object.entries(position_table)) {
        if (!otherPlayers[id] && id != user.id){
            let p = new THREE.Mesh( playerGeometry, otherPlayersMaterial );
            p.castShadow = true;
            p.position.y = 1;
            p.position.x = pos.x;
            p.position.z = -pos.y;
            scene.add(p);
            otherPlayers[id] = p;
        }        
    }

    for (const [id, p] of Object.entries(otherPlayers)) {
        if (!position_table[id]) {
            scene.remove(otherPlayers[id]);
            delete otherPlayers[id];
        }
    }
}

var playerTags = {};
export function updateTags(){
    for (const [id, u] of Object.entries(user_table)) {
        if (!playerTags[id] && id != user.id){
            playerTags[id] = creer_texte(u.prenom);
        }
    }

    for (const [id, tag] of Object.entries(playerTags)) {
        if (!position_table[id]) {
            tag.remove();
            delete playerTags[id];
        }
    }
}

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);
var setShadowSize=(light1, sz, mapSz)=>{
    light1.shadow.camera.left = sz;
    light1.shadow.camera.bottom = sz;
    light1.shadow.camera.right = -sz;
    light1.shadow.camera.top = -sz;
    if(mapSz){
        light1.shadow.mapSize.set(mapSz,mapSz)
    }
}
setShadowSize(directionalLight,50.0,4096);


camera.position.z = 4;
camera.position.y = 4;
camera.rotation.x = -0.5;

player.position.y = 1;

const clock = new THREE.Clock;
var dt = 0;

function animate() {
    dt = clock.getDelta();
    updatePos(dt);

    player.position.x = playerCoords.x;
    player.position.z = -playerCoords.y;

    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 4;

    for (const [id, p] of Object.entries(otherPlayers)) {
        let pos = position_table[id];

        if (pos) {
            let destination = new THREE.Vector3(pos.x, p.position.y, -pos.y);
            let direction = new THREE.Vector3();
            direction.subVectors(destination, p.position);
            if (direction.length() < speed * dt){
                p.position.copy(destination);
            } else {
                direction.normalize();
                direction.multiplyScalar(speed * dt);
                p.position.add(direction);
            }
            
    
            let tag_pos = p.position.clone();
            tag_pos.y += 1.5;
            let sc = screenCoords(tag_pos);
            set_position(playerTags[id], sc);
        }
    }

	renderer.render( scene, camera );

}

window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function screenCoords(pos) {
    var vect = new THREE.Vector3();
    vect = pos.clone();
    vect.project(camera);

    var width = window.innerWidth, height = window.innerHeight;
    var widthHalf = width / 2, heightHalf = height / 2;

    vect.x = ( vect.x * widthHalf ) + widthHalf;
    vect.y = -( vect.y * heightHalf ) + heightHalf;
    vect.z = camera.position.distanceTo( pos );

    return vect;
}