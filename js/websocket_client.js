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
        initTags();
    });
}

function update_user_table(){
    let unknown = [];
    for (const [key, value] of Object.entries(position_table)) {
        if (!user_table[key]){
            unknown.push(key);
        }
    }
    if (unknown.length > 0) {
        import_users(unknown);
    }
}

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = (event) => {
    (async () => {
        await initUser();
        sendPosition();
    })();
};

socket.onmessage = (event) => {
    position_table = JSON.parse(event.data);
    update_user_table();
    initOtherPlayers();
};

function sendPosition() {
    if (user){
        socket.send(JSON.stringify({id:user.id, pos:playerCoords}));
    }
}