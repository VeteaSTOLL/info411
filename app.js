const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(8080, () => {
    console.log('Serveur en cours d\'exécution sur http://localhost:8080');
});