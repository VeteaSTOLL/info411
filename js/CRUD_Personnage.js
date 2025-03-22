const connexion = require("./db_connect");
const mysql = require('mysql');

function insert_perso(nom, prenom, email, mdp){
    var sql = "INSERT INTO Personnage (nom, prenom, email, mdp) VALUES ('"+nom+"', '"+prenom+"', '"+email+"', '"+mdp+"')";
    connexion.conn.query(sql);
}

function select_perso(id){
    var sql = "SELECT id, nom, prenom, email FROM Personnage WHERE id='" + id + "'";
    return new Promise((resolve, reject) => {
        connexion.conn.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });
    });
}

function select_perso_connexion(email, mdp){
    var sql = "SELECT id FROM Personnage WHERE email='" + email + "' AND mdp='" + mdp + "'";
    return new Promise((resolve, reject) => {
        connexion.conn.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });
    });
}



module.exports = {
    insert_perso,
    select_perso,
    select_perso_connexion
};