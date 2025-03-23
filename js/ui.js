function creer_texte(text){
    let textBox = document.createElement('div');
    textBox.innerText = text;
    
    textBox.style.position = 'absolute';
    textBox.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    textBox.style.color = "white";
    textBox.style.fontSize = "2 em";
    textBox.style.fontFamily = "sans-serif";
    textBox.style.padding = ".15em 1em .2em";
    textBox.style.borderRadius = "100px";

    document.body.appendChild(textBox);
    return textBox;
}

function set_position(element, coords){
    if(!element){ return; };
    let bcr = element.getBoundingClientRect();
    let halfWidth = bcr.width/2, halfHeight = bcr.height/2;

    if (coords.x + halfWidth > window.innerWidth || coords.y + halfHeight > window.innerHeight || coords.z > 20){
        element.style.visibility = "hidden";
    } else {
        element.style.visibility = "visible";
        element.style.left = (coords.x - halfWidth) + 'px';
        element.style.top = (coords.y - halfHeight) + 'px';

        element.style.fontSize = 150/coords.z + "px";
    }
}