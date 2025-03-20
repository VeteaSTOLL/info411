async function getPerso() {
    await fetch("http://localhost:3000/session_user", { credentials:'include' })
    .then(response => response.json())
    .then(data => {
        if(typeof data.nom !== 'undefined'){
            document.getElementById("nom").innerText = data.nom;
            document.getElementById("prenom").innerText = data.prenom;
            document.getElementById("email").innerText = data.email;
        }
    });
}

getPerso();