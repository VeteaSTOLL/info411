var playerCoords = {x:0, y:0};
const speed = 3;

const keysPressed = {};

document.addEventListener("keydown", (event) => {
    keysPressed[event.code] = true;
});

document.addEventListener("keyup", (event) => {
    keysPressed[event.code] = false;
});

function isKeyDown(keyCode) {
    return keysPressed[keyCode] || false;
}

function length(vect){
    return Math.sqrt(vect.x*vect.x + vect.y*vect.y);
}

function normalized(vect){
    let l = length(vect);
    if (l != 0) {        
        return {x: vect.x/l, y: vect.y/l};
    } else {
        return {x: 0, y: 0};
    }
}

function add(vect1, vect2){
    return {x: vect1.x+vect2.x, y: vect1.y+vect2.y};
}

function mult(vect, n){
    return {x: vect.x*n, y: vect.y*n};
}

function updatePos(dt) {
    let vect = {x:0, y:0};
    if (isKeyDown('KeyS')){
        multVitesse = 2;
    } else {
        multVitesse = 1;
    }
    if (isKeyDown('ArrowDown')) {
        vect.y -= (1);
    }if (isKeyDown('ArrowUp')) {
        vect.y += (1);
    }if (isKeyDown('ArrowLeft')) {
        vect.x -= (1);
    }if (isKeyDown('ArrowRight')) {
        vect.x += (1);
    }
    playerCoords = add(playerCoords, mult(normalized(vect), speed * dt * multVitesse));
    sendPosition();
}
