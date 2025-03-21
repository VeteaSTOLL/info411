const cors = require("cors");
const express = require("express");
const session = require("express-session");

const crudP = require("./js/CRUD_Personnage");

const app = express();
const PORT = 3000;

app.set("trust proxy", 1);

// Pour fetch
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true, // Permet l'envoi des cookies avec les requêtes
})); 
// Middleware pour traiter les données du formulaire
app.use(express.urlencoded({ extended: true }));
// Pour les sessions
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

// Traiter le formulaire
app.post("/login", (req, res) => {
    const { login, passwd } = req.body;
    (async () => {
        let user =  await crudP.select_perso_connexion(login, passwd);

        if (user.length > 0){
            //demarre la session
            req.session.userId = user[0].id;
            req.session.save(err => {
                if (err) throw err;
                //renvoie la reponse une fois que la session est demarree
                res.send({session_opened:true});
            });
        } else {
            res.send({session_opened:false});
        }
    })();
});

app.get("/session_user", (req, res) => {
    if (typeof req.session.userId !== 'undefined'){
        (async () => {
            let user = (await crudP.select_perso(req.session.userId))[0];
            res.send(user);
        })();        

    } else {
        res.send("{}");
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
