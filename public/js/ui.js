function creer_tag(prenom, popularite){
    let box = document.createElement('div');
    box.className = "box";

    let name = document.createElement('div');
    name.innerText = prenom;    
    name.className = "nom";   
    box.appendChild(name);

    let pop = document.createElement('div');
    pop.innerText = popularite + "p"; 
    pop.className = "pop";   
    box.appendChild(pop);


    document.body.appendChild(box);
    return box;
}

function set_position(element, coords){
    if(!element){ return; };

    let bcr = element.getBoundingClientRect();
    let halfWidth = bcr.width/2, halfHeight = bcr.height/2;

    if (coords.x + halfWidth > window.innerWidth || coords.y + halfHeight > window.innerHeight || coords.z > 20 || coords.z < 0){
        element.style.visibility = "hidden";
    } else {
        element.style.visibility = "visible";
        element.style.left = coords.x + 'px';
        element.style.top = coords.y + 'px';

        element.style.fontSize = 150/coords.z + "px";
    }
}

let input = document.getElementById("chat-input");

input.onkeydown = (event) => {   
    if (event.key == "Enter" && input.value != "") {
        sendMessage(input.value);
        input.value = "";
    }
}

let writting = false; 

input.addEventListener("focusin", (event) => {
    writting = true;
});

input.addEventListener("focusout", (event) => {    
    writting = false;
});

let chat = document.getElementById("chat");

function new_message(prenom, message) {
    let p = document.createElement("p");
    p.innerText = "[" + prenom + "] : " + message;
    p.className = "message";
    setTimeout(() => {
        p.remove();;
    }, 10000);
    chat.appendChild(p);
}

let info = document.getElementById("info");
let currentTimeout;

function set_info(text) {
    info.innerText = text;
    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(() => {
        info.innerText = "";;
    }, 3000);
}

let indication = document.getElementById("indication");

function set_indication(text) {
    indication.innerText = text;
}

function clear_indication() {
    indication.innerText = "";
}

let indice_popularite = document.getElementById("indice-popularite");

function set_popularite(points) {
    indice_popularite.innerText = "Vous avez "+Math.round(points)+" points de popularité";
}