async function getData() {
    await fetch("http://localhost:3000/session_user")
    .then(response => response.json())
    .then(data => console.log(data));
}

getData();