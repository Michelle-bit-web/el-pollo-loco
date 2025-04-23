let canvas;
let world;

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas);

    console.log('My character is:', world.character);
    console.log('My first chicken is:', world.enemies[0])
}