const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  port: 3307,
  user: 'vttvcool', 
  password: 'tvvtcool', 
  database: 'info411',
  connectionLimit: 10
});

module.exports = {
  pool
};