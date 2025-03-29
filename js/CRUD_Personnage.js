const connexion = require("./db_connect");

async function insert_perso(nom, prenom, email, mdp) { 
    const sql = "INSERT INTO Personnage (nom, prenom, email, mdp) VALUES (?, ?, ?, ?, ?)";
    let conn;
    try {
        conn = await connexion.pool.getConnection();
        const result = await conn.query(sql, [nom, prenom, email, mdp]);
        return { result };
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function select_perso(id) {
    const sql = "SELECT id, nom, prenom, email FROM Personnage WHERE id=?";
    let conn;
    try {
        conn = await connexion.pool.getConnection();
        const result = await conn.query(sql, [id]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function select_perso_connexion(email, mdp) {
    const sql = "SELECT id FROM Personnage WHERE email=? AND mdp=?";
    let conn;
    try {
        conn = await connexion.pool.getConnection();
        const result = await conn.query(sql, [email, mdp]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}


module.exports = {
    insert_perso,
    select_perso,
    select_perso_connexion
};