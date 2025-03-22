const crudP = require("./CRUD_Personnage");

var user_table = {};

async function insert_user(id){
    let user = (await crudP.select_perso(id))[0];
    user_table[id] = user;
}

function get_user(id){
    return user_table[id];
}

function get_users(ids){
    let new_array = [];
    ids.forEach(id => {
        new_array.push(get_user(id));
    });
    return new_array;
}

function delete_user(id){
    delete user_table[id];
}

var position_table = {};

function insert_pos(id, pos){
    position_table[id] = pos;
    
    if (!user_table[id]){
        insert_user(id);
    }
}

function get_pos(id){
    return position_table[id];
}

function delete_pos(id){
    delete position_table[id];
}

module.exports = {
    user_table,
    position_table,
    insert_pos,
    get_users
};