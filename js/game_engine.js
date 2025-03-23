var playerCoords = {x:0, y:0};

window.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowDown":
            playerCoords.y -= 1;
            break;
        case "ArrowUp":
            playerCoords.y += 1;
            break;
        case "ArrowLeft":
            playerCoords.x -= 1;
            break;
        case "ArrowRight":
            playerCoords.x += 1;
            break;
        default:
            return;
    }
    sendPosition();

    event.preventDefault();
}, true);