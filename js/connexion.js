document.getElementById("formulaire").addEventListener("submit", async function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const data = new FormData(this);
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: 'include',
        body: new URLSearchParams(data), // Convertit data en x-www-form-urlencoded
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    const result = await response.json();
    if (result.session_opened){        
        window.location.replace("./jeu.html");
    }
});