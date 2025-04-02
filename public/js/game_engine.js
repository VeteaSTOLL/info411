// Gestion du clavier

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

// Gestion des vecteurs

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

function opposite(vect) {
    return {x: -vect.x, y: -vect.y};
}

function distance(vect1, vect2) {
    return length(add(vect1, opposite(vect2)));
}

// Gestion du déplacement

var playerCoords = {x:0, y:0};
const speed = 3;

function updatePos(dt) {
    let vect = {x:0, y:0};
    
    if (!writting && !interraction) {
        multVitesse = isKeyDown('ShiftLeft') ? 2 : 1; 

        if (isKeyDown('ArrowDown') || isKeyDown('KeyS')) {
            vect.y -= 1;
        }if (isKeyDown('ArrowUp') || isKeyDown('KeyW')) {
            vect.y += 1;
        }if (isKeyDown('ArrowLeft') || isKeyDown('KeyA')) {
            vect.x -= 1;
        }if (isKeyDown('ArrowRight') || isKeyDown('KeyD')) {
            vect.x += 1;
        }
    }
    
    playerCoords = add(playerCoords, mult(normalized(vect), speed * dt * multVitesse));
    sendPosition();

    let np = getNearestPlayer();
    if (!interraction && np) {
        get_interraction(np).then((int) => {
            if (int.interracting) {
                set_indication("Appuyez sur E pour interrompre");
            } else {
                set_indication("Appuyez sur E pour harceler");
            }
        })
    } else {
        clear_indication();
    }
}

function getNearestPlayer() {
    let nearestPlayer;
    let minDist;

    for (const [id, pos] of Object.entries(position_table)) {
        if (id != user.id) {
            let dist = distance(pos, playerCoords);
            if (!minDist || dist < minDist) {
                minDist = dist;
                nearestPlayer = id;
            }
        }
    }

    if (minDist <= 2) {
        return nearestPlayer;
    }
}

document.addEventListener("keydown", (event) => {
    if (!writting && !interraction && event.code == "KeyE") {
        let  np = getNearestPlayer();
        if (np) {
            get_interraction(np).then((int) => {
                if (int.interracting) {
                    if (int.role == "harceleur"){
                        interrompre(np, int.other);
                    } else {
                        interrompre(int.other, np);
                    }
                } else {
                    harceler(np);
                }
            })
        }

    }
});