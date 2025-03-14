const connexion = require("./db_connect");
const mysql = require('mysql');

function insert_perso(nom, prenom, email, mdp){
    var sql = "INSERT INTO Personnage (nom, prenom, email, mdp) VALUES ('"+nom+"', '"+prenom+"', '"+email+"', '"+mdp+"')";
    connexion.conn.query(sql);
}

module.exports = {
    insert_perso
};