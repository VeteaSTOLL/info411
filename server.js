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

    if (login === "test@email.com" && passwd === "1234") {
        res.send("Connexion réussie !");
        crudP.insert_perso("man", "donatien", "email@", "motdepasse");

    } else {
        res.send("Identifiants incorrects !");
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
