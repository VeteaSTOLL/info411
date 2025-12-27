var user;

async function logout(){
    await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: 'include'  // Envoyer les cookies pour que le serveur puisse supprimer la session
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Déconnexion réussie") {
            // Fermer le WebSocket si nécessaire
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        }
    });
}

async function initUser() {
    await fetch(`${API_URL}/session_user`, { credentials:'include' })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            user = data;
            document.getElementById("conn_deconn").textContent = "Se déconnecter";
            document.getElementById("conn_deconn").href = "./";
            document.getElementById("conn_deconn").onclick = logout;                
        }
        else{
            document.getElementById("conn_deconn").textContent = "Se connecter";
            document.getElementById("conn_deconn").href = "./connexion.html";
        }
    })
    .catch((error) => {
        console.error("Erreur lors de l'initialisation de l'utilisateur :", error);
    });
}

window.onload = initUser;