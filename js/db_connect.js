const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root', 
  password: '', 
  database: 'info411',
  connectionLimit: 10
});

module.exports = {
  pool
};