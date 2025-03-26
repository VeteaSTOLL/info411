// Middlewares

const cors = require("cors");
const express = require("express");
const session = require("express-session");
const WebSocket = require('ws');

// Includes
const crudP = require("./js/CRUD_Personnage");
const data = require("./js/server_data");

const app = express();
const PORT = 3000;

app.set("trust proxy", 1);

// Utile pour fetch
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true, // Permet l'envoi des cookies avec les requêtes
})); 
// Utile pour traiter les données du formulaire
app.use(express.urlencoded({ extended: true }));
// Utile pour les sessions
app.use(session({
    secret: "noahleloser",
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    cookie: {
        secure: false, // True si HTTPS
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 jour
    }
}));
// Utile pour pouvoir lire le json
app.use(express.json());

// Traiter le formulaire
app.post("/login", (req, res) => {
    // Récupère les données du formulaire
    const { login, passwd } = req.body;

    (async () => {
        // Récupère la liste des utilisateurs qui ont cet identifiant et ce mot de passe (normalement une liste de taille 1)
        let user =  await crudP.select_perso_connexion(login, passwd);
        if (user && user.length > 0){
            // Initialise une variable de session qui correspond à l'id de l'utilisateur
            req.session.userId = user[0].id;
            // Sauvegarde la session
            req.session.save(err => {
                if (err) throw err;
                // Renvoie la reponse une fois que la session est demarree
                res.send({session_opened:true});
            });
        } else {
            res.send({session_opened:false});
        }
    })();
});

app.post("/register", (req, res) => {
    const {login, nom, prenom, passwd } = req.body;
    
    (async () => {
        await crudP.insert_perso(nom, prenom, login, passwd);
    })()
});

app.get("/session_user", (req, res) => {
    // Renvoie l'utilisateur de la session
    if (req.session.userId){
        (async () => {
            let user = await crudP.select_perso(req.session.userId);
            if (user && user.length > 0) {
                res.send(user[0]);
            } else {
                res.send("{}");
            }
        })();
    } else {
        res.send("{}");
    }
});

app.post("/users", (req, res) => {
    // Renvoie les utilisateur qui ont été listés dans un array, ex: [1, 2, 10, 12]

    const arr = req.body;
    res.send(JSON.stringify(data.get_users(arr)));
});

// Lance le serveur
const server = app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

// PARTIE WEBSOCKET
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    // Connexion du client
    let id;

    ws.on('message', (message) => {
        // Gestion du message reçu
        let message_json = JSON.parse(message);
        // Le message doit être dee type : {"header":___, "autreVariable":_}
        switch (message_json.header) {
        case 'updatePos':
            if (id) {
                data.insert_pos(message_json.id, message_json.pos);
            }
            break;
        case 'authentification':
            id = message_json.id;
            break;
        case 'chat':
            // envoyer en broadcast le message du chat
            break;
        }
    });

    // Envoie la liste des positions à tous les utilisateurs toutes les 50 ms
    const interval = setInterval(() => {
        ws.send(JSON.stringify(data.position_table));
    }, 50);

    ws.on('close', () => {
        if (id){
            data.delete_pos(id);
            data.delete_user(id);
        }
        clearInterval(interval); // Supprimer l'intervalle quand le client se déconnecte
    });

});