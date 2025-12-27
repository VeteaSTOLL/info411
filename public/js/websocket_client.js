var user;

async function initUser() {
    await fetch(`${API_URL}/session_user`, { credentials:'include' })
    .then(response => response.json())
    .then(data => {
        if(data.id){
            user = data;
            set_popularite(user.id, user.popularite);
        } else {
            window.location.replace("./");
        }
    });
}

var position_table = {};
var user_table = {};

var playerTags = {};

function updateTag(u){
    let id = u.id;
    if (!playerTags[id] && id != user.id){
        playerTags[id] = creer_tag(u.prenom, u.popularite);
    }
}

function deleteUnusedTags(){
    for (const [id, tag] of Object.entries(playerTags)) {
        if (!position_table[id]) {
            tag.remove();
            delete playerTags[id];
        }
    }
}

async function import_user (id) {
    await fetch(`${API_URL}/user/${id}`, {
        credentials:'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let u = data;
        user_table[u.id] = u;
        updateTag(u);
    });
}

function update_user_table(){

    // on importe les utilisateurs qu'on ne connait pas
    for (const [key, value] of Object.entries(position_table)) {
        if (!user_table[key]){
            import_user(key);
        }
    }
    
    // on supprime les utilisateurs qui ne sont plus là
    for (const [id, u] of Object.entries(user_table)) {
        if (!position_table[id]) {
            delete user_table[id];
        }
    }
    
    // on rafraichit les tags pour supprimer ceux des utilisateurs disparus
    deleteUnusedTags();
}

async function get_interraction(id) {
    let res;
    await fetch(`${API_URL}/interraction/${id}`, { credentials:'include' })
    .then(response => response.json())
    .then(data => {
        res = data;
    });
    return res;
}

const socket = new WebSocket(WS_URL);

socket.onopen = (event) => {
    (async () => {
        await initUser();
        socket.send(JSON.stringify({header:"authentification", id:user.id}));
    })();
};

let interraction = false;

socket.onmessage = (event) => {
    let message_json = JSON.parse(event.data);

    switch (message_json.header) {
    case 'positionTable':
        if (user) {
            position_table = message_json.table;
            update_user_table();
            updateOtherPlayers();
        }
        break;
    case 'chat':
        if (user_table[message_json.id]){
            new_message(user_table[message_json.id].prenom, message_json.body);
        }
        break;
    case 'debut_harcelement':
        if (message_json.role == "harceleur") {
            set_info("Vous harcelez " + user_table[message_json.target].prenom + ".");
        } else if (message_json.role == "harcele") {
            set_info("Vous vous faites harceler par " + user_table[message_json.source].prenom + ", Appelez à l'aide !");
        }
        interraction = true;
        break;
    case 'fin_harcelement':
        if (message_json.status == "ok") {
            set_info("Le harcèlement s'est terminé avec succès.");
        } else if (message_json.status == "nok") {
            set_info("Le harcèlement a été interrompu par " + user_table[message_json.interrupter].prenom +".");
        }
        interraction = false;
        break;
    case 'update_popularite':
        let id = message_json.id;
        let points = message_json.points;
        user_table[id].popularite = points;
        set_popularite(id, points);
        break;
    }
};

socket.onclose = (event) => {
    window.location.replace("./");
};

function sendPosition() {
    if (user && socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify({header:"updatePos", id:user.id, pos:playerCoords}));
    }
}

function sendMessage(message) {
    if (user && socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify({header:"chat", id:user.id, body:message}));
    }
}

function harceler(target_id) {
    socket.send(JSON.stringify({header:"harcelement", target:target_id}));
}

function interrompre(source_id, target_id) {
    socket.send(JSON.stringify({header:"interruption", source:source_id, target:target_id}));
}
