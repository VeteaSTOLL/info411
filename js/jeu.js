(async () => {
    await fetch("http://localhost:3000/session_user", { credentials:'include' })
    .then(response => response.json())
    .then(data => {
        if(typeof data.nom !== 'undefined'){
            document.getElementById("nom").innerText = data.nom;
            document.getElementById("prenom").innerText = data.prenom;
            document.getElementById("email").innerText = data.email;            
        } else {
            window.location.replace("./connexion.html");
        }
    });
})();

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('Connecté au WebSocket');
};

socket.onmessage = (event) => {
    console.log(event.data);
};

function sendMessage() {
    socket.send("yo !");
}