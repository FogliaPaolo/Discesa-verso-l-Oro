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
let livelloSuolo; // La posizione base sulla pista

function preload() {
  imgSciatore = loadImage('./img/sciatore.jpg');
  imgSfondo = loadImage('./img/pista.jpeg');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  livelloSuolo = height / 2; // Lo sciatore sta a metà schermo
  sciatoreY = livelloSuolo;

  handpose = ml5.handpose(video, () => console.log("Modello Pronto"));
  handpose.on("predict", results => predictions = results);
}

function draw() {
  // 1. Video specchiato
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 2. Immagine della pista
  image(imgSfondo, 0, 0, width, height);

  // 3. Logica fisica (Gravità)
  applicafisica();

  // 4. Disegna lo sciatore
  drawObject();
}

function applicafisica() {
  // Applica la velocità alla posizione Y
  sciatoreY += velocitaY;

  // Se lo sciatore è in aria, applica la gravità
  if (sciatoreY < livelloSuolo) {
    velocitaY += gravita;
    aTerra = false;
  } else {
    // Correzione quando tocca terra
    sciatoreY = livelloSuolo;
    velocitaY = 0;
    aTerra = true;
  }
}

function drawObject() {
  if (predictions.length > 0) {
    let prediction = predictions[0];
    let handX = width - prediction.landmarks[9][0];
    let handY = prediction.landmarks[9][1]; // Coordinata Y della mano
    
    let targetX;

    // Logica per le 3 posizioni fisse (Orizzontale)
    if (handX < width / 3) {
      targetX = width / 6;
    } else if (handX < (width / 3) * 2) {
      targetX = width / 2;
    } else {
      targetX = (width / 6) * 5;
    }

    // LOGICA DEL SALTO: Se la mano è nella metà superiore dello schermo e lo sciatore è a terra
    if (handY < height / 3 && aTerra) {
      velocitaY = forzaSalto;
    }

    imageMode(CENTER);
    // Usiamo sciatoreY calcolato dalla fisica invece di un valore fisso
    image(imgSciatore, targetX, sciatoreY, 120, 100);
    imageMode(CORNER);
  }
}