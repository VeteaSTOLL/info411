const crudP = require("./CRUD_Personnage");

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
    position_table,
    insert_pos,
    delete_pos
};