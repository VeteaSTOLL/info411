// Middlewares

//require('path');
require('dotenv').config();
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const WebSocket = require('ws');

// Détection de l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// Includes
const crudP = require("./CRUD_Personnage");
const data = require("./server_data");

const app = express();
const PORT = process.env.PORT_BACK;

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// if (isProduction) {
//     // HTTPS en production
//     const fs = require('fs');
//     const https = require('https')

//     const sslOptions = {
//         key: fs.readFileSync('/etc/letsencrypt/live/loserland2025.tevaphilippe.fr/privkey.pem'),
//         cert: fs.readFileSync('/etc/letsencrypt/live/loserland2025.tevaphilippe.fr/fullchain.pem')
//     };  
//     server = https.createServer(sslOptions, app);
// } else {
//     // HTTP en développement
//     const http = require('http');
//     server = http.createServer(app);
// }

const http = require('http');
const server = http.createServer(app);

app.set("trust proxy", 1);

// Utile pour fetch
app.use(cors({
    origin: ['http://localhost:3000', 'https://loserland2025.tevaphilippe.fr'],
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
        await crudP.insert_perso(nom, prenom, login, passwd, 500);
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

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        res.clearCookie('connect.sid');  // Supprimer le cookie de session
        res.send({ message: 'Déconnexion réussie' }); // Réponse de succès
    });
});


app.post("/user/:id", (req, res) => {
    // Renvoie l'utilisateur

    const id = req.params.id;
    (async () => {
        let perso = (await crudP.select_perso(id))[0]
        res.send(JSON.stringify(perso));
    })();

});

app.get("/interraction/:id", (req, res) => {
    // Renvoie true si l'utilisateur est en interraction

    const id = req.params.id;
    if (interraction[id]) {
        res.send(JSON.stringify(interraction[id]));
    } else {
        res.send({interracting:false});
    }
});

// Lance le serveur
server.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});


// ----------------
// PARTIE WEBSOCKET
// ----------------

// serveur websocket
const wss = new WebSocket.Server({ server });

// tableau liant l'id des utilisateurs à leur websocket
var wsid = {};

// tableau des timeouts pour pouvoir les interrompres
var timeouts = {};

// tableau des interractions
var interraction = {};

// Variables pour système d'Elo

const MULT = 10;
const BASE = 10;
const DIV = 400;

// Fonctions pour système d'Elo

function points(A, B, gagnant) {
    // renvoie les nouveaux points de A
    let b = gagnant ? 1 : 0;
    let nv_pts = A + MULT * (b - probabilite(A, B));
    if (nv_pts < 0) {
        nv_pts = 0;
    }
    return nv_pts;
}

function probabilite(A, B) {
    // renvoie la "probabilité" qu'avait A de gagner
    let scoreA = Math.pow(BASE, A/DIV);
    let scoreB = Math.pow(BASE, B/DIV);
    return scoreA / (scoreA + scoreB);
}

async function donner_points(source, target, interrompu, interrupteur) {
    // s'occupe de la procédure pour donner les points aux joueurs
    let pop_source = (await crudP.get_popularite(source))[0].popularite;
    let pop_target = (await crudP.get_popularite(target))[0].popularite;

    let points_source = points(pop_source, pop_target, !interrompu);
    let points_target = points(pop_target, pop_source, interrompu);
    
    // message de fin de harcèlement + update de popularite
    wsid[source].send(JSON.stringify({header:"fin_harcelement", status: interrompu?"nok":"ok", interrupter: interrupteur}));
    crudP.update_popularite(source, points_source);
    wsid[target].send(JSON.stringify({header:"fin_harcelement", status: interrompu?"nok":"ok", interrupter: interrupteur}));
    crudP.update_popularite(target, points_target);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({header:"update_popularite", id: source, points: points_source}));
            client.send(JSON.stringify({header:"update_popularite", id: target, points: points_target}));
        }
    });
}

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
            wsid[id] = ws
            break;

        case 'chat':
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message_json));
                }
            });
            break;

        case 'harcelement':
            // check la distance (pas encore implémenté) + si le joueur cible est bien authentifié
            // + qu'on est pas en interraction + que la cible n'est pas en interraction
            if (wsid[message_json.target] && !interraction[id] && !interraction[message_json.target]) {

                // envoie le message de confirmation aux 2 joueurs 
                ws.send(JSON.stringify({header:"debut_harcelement", role:"harceleur", target:message_json.target}));
                wsid[message_json.target].send(JSON.stringify({header:"debut_harcelement", role:"harcele", source:id}));

                // les mets en interraction
                interraction[id] = {interracting:true, role:"harceleur", other:message_json.target};
                interraction[message_json.target] = {interracting:true, role:"harcele", other:id};

                // à la fin :
                timeouts[id] = setTimeout(async () => {
                    donner_points(id, message_json.target, false, -1);

                    // on supprime le timeout
                    delete timeouts[id];
                    
                    // on enlève les interractions
                    delete interraction[id];
                    delete interraction[message_json.target];
                }, 3000);
                // changer la durée en fonction du niveau de popularité
            }
            break;

        case 'interruption':
            if (timeouts[message_json.source]) {                
                donner_points(message_json.source, message_json.target, true, id);

                // abandonne et enlève le timeout
                clearTimeout(timeouts[message_json.source]);
                delete timeouts[message_json.source];
                
                // on enlève les interractions
                delete interraction[message_json.source];
                delete interraction[message_json.target];
            }
            break;
        }
    });

    // Envoie la liste des positions à tous les utilisateurs toutes les 50 ms
    const interval = setInterval(() => {
        ws.send(JSON.stringify({"header":"positionTable", "table":data.position_table}));
    }, 50);

    ws.on('close', () => {
        if (id) {
            data.delete_pos(id);
            if (wsid[id]) {
                delete wsid[id];
            }
        }
        clearInterval(interval); // Supprimer l'intervalle quand le client se déconnecte
    });

});
