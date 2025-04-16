const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: 'c_mariadb',
  port: 3306,
  user: process.env.LOGIN_DB, 
  password: process.env.PASSWORD_DB, 
  database: 'info411',
  connectionLimit: 10
});

module.exports = {
  pool
};