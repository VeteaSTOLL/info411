const express = require("express");

const crudP = require("./js/CRUD_Personnage");

const app = express();
const PORT = 3000;

// Middleware pour traiter les données du formulaire
app.use(express.urlencoded({ extended: true }));

// Servir le fichier HTML
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Traiter le formulaire
app.post("/login", (req, res) => {
    const { login, passwd } = req.body;
    (async () => {
        let user =  await crudP.select_perso_connexion(login, passwd);

        if (user.length > 0){
            res.send(user[0]);
        } else {
            res.send("Identifiants incorrects !");
        }
    })();
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
