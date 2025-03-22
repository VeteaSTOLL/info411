var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "info411"
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connecté à la db");
});

module.exports = {
  conn
};