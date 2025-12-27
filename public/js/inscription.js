document.getElementById("formulaire").addEventListener("submit", async function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const data = new FormData(this);
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        credentials: 'include',
        body: new URLSearchParams(data), // Convertit data en x-www-form-urlencoded
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    window.location.replace("./connexion.html");    
});
