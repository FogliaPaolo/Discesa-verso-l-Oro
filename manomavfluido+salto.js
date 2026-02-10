let handpose;
let video;
let predictions = [];
let imgSciatore; 
let imgSfondo; 

// Variabili per il salto e gravità
let sciatoreY; 
let velocitaY = 0;
let gravita = 0.8;
let forzaSalto = -15;
let aTerra = true;
let livelloSuolo; 

// Variabile per il movimento fluido
let sciatoreX;

function preload() {
  imgSciatore = loadImage('./img/sciatore.jpg');
  imgSfondo = loadImage('./img/pista.jpeg');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  livelloSuolo = height - 100; // Abbassato un po' per simulare meglio la pista
  sciatoreY = livelloSuolo;
  sciatoreX = width / 2;

  handpose = ml5.handpose(video, () => console.log("Modello Pronto"));
  handpose.on("predict", results => predictions = results);
}

function draw() {
  // 1. Video specchiato (opzionale, come sfondo base)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 2. Immagine della pista
  image(imgSfondo, 0, 0, width, height);

  // 3. Logica fisica
  applicafisica();

  // 4. Disegna lo sciatore
  drawObject();
}

function applicafisica() {
  sciatoreY += velocitaY;

  if (sciatoreY < livelloSuolo) {
    velocitaY += gravita;
    aTerra = false;
  } else {
    sciatoreY = livelloSuolo;
    velocitaY = 0;
    aTerra = true;
  }
}

function drawObject() {
  if (predictions.length > 0) {
    let prediction = predictions[0];
    
    // POSIZIONE ORIZZONTALE (FLUIDA)
    // Calcola la X specchiata senza bloccarla in 3 posizioni
    let handX = width - prediction.landmarks[9][0];
    let handY = prediction.landmarks[9][1];

    // x evitare scatti
    // Lo sciatore segue la mano in modo più morbido
    sciatoreX = lerp(sciatoreX, handX, 0.2);

    // LOGICA DEL SALTO
    // Se alzi la mano sopra il primo terzo dello schermo, salta
    if (handY < height / 2 && aTerra) {
      velocitaY = forzaSalto;
    }

    imageMode(CENTER);
    // Disegna lo sciatore alla posizione X fluida e Y fisica
    image(imgSciatore, sciatoreX, sciatoreY, 120, 100);
    imageMode(CORNER);
  }
}