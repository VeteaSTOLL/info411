var user; 

async function initUser() {
    await fetch("http://localhost:3000/session_user", { credentials:'include' })
    .then(response => response.json())
    .then(data => {
        if(data.id){
            user = data;
        } else {
            window.location.replace("./");
        }
    });
}

var position_table = {};
var user_table = {};

async function import_user (id) {
    await fetch("http://localhost:3000/user/"+id, {
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
        updateTags();
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

const socket = new WebSocket('ws://localhost:3000');

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