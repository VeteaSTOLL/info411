const crudP = require("./CRUD_Personnage");

var user_table = {};

async function insert_user(id){
    if (!user_table[id]){
        let user = (await crudP.select_perso(req.session.userId))[0];
        user_table[id] = user;
    }
}

function get_user(id){
    return user_table[id];
}

function delete_user(id){
    delete user_table[id];
}

var position_table = {};

function insert_pos(id, pos){
    position_table[id] = pos;
}

function get_pos(id){
    return position_table[id];
}

function delete_pos(id){
    delete position_table[id];
}

module.exports = {
    insert_user,
    get_user,
    delete_user,
    insert_pos,
    get_pos,
    delete_pos
};