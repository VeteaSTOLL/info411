var user; 
async function initUser() {
    await fetch("http://localhost:3000/session_user", { credentials:'include' })
    .then(response => response.json())
    .then(data => {
        if(data.id){
            user = data;
        } else {
            window.location.replace("./connexion.html");
        }
    });
}

var user_table = {};
var position_table = {};

async function import_users (list) {
    await fetch("http://localhost:3000/users", {
        credentials:'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(list)
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(user => {
            user_table[user.id] = user;
        });
        updateTags();
    });
}

function update_user_table(){
    let unknown = [];
    for (const [key, value] of Object.entries(position_table)) {
        if (!user_table[key]){
            unknown.push(key);
        }
    }

    for (const [id, u] of Object.entries(user_table)) {
        if (!position_table[id]) {
            delete user_table[id];
        }
    }
    updateTags();

    if (unknown.length > 0) {
        import_users(unknown);
    }
}

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = (event) => {
    (async () => {
        await initUser();
        socket.send(JSON.stringify({header:"authentification", id:user.id}));
    })();
};

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
    }
};

socket.onclose = (event) => {
    //window.location.replace("./");
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