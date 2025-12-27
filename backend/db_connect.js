const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  //host: 'c_mariadb',
  host: 'localhost',
  port: 3306,
  user: process.env.LOGIN_DB, 
  password: process.env.PASSWORD_DB, 
  database: 'info411',
  connectionLimit: 10
});

module.exports = {
  pool
};