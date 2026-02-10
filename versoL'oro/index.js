let omino;

// immagini
let imgbackground;
let imgomino;
let imgomino2;

//costanti salto 
const g = 1;        // gravità
const jump = 20;   // forza del salto
const ground = 20; // terreno


function preload() {
  imgbackground = loadImage('./img/foresta2.jpg');
  imgomino = loadImage('./img/corsa.gif');
  //imgomino2 = loadImage();
}

function setup() {
  createCanvas(1450, 850);
  frameRate(24);

  // player sul terreno
  omino = new Player(100, height - ground - 100);
  omino2= new Player(110, height - ground - 110 );
}

function draw() {
  background(imgbackground);


  omino.gravita();   // gravita salto 
  omino.draw();     

  
}

function keyPressed() {
  if (key === " ") {
    omino.salto();
  }
  if (key === "a") {
    omino.muovisx();
  }
  if (key === "d") {
    omino.muovidx();
  }
}
