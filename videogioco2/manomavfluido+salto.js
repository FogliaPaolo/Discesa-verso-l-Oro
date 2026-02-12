let handpose;
let video;
let predictions = [];
let imgSciatoreDX, imgSciatoreSX, imgVisualizzata, imgSfondo; 

let sciatoreY, sciatoreX;
let velocitaY = 0;
let gravita = 0.8;
let forzaSalto = -15;
let aTerra = true;
let livelloSuolo; 

function preload() {
  const idScelto = localStorage.getItem('personaggioScelto');
  // Trova il personaggio, se non esiste usa il primo
  const datiGiocatore = personaggi.find(p => p.id === idScelto) || personaggi[0];
  
  imgSciatoreDX = loadImage(datiGiocatore.imgDX);
  imgSciatoreSX = loadImage(datiGiocatore.imgSX);
  imgSfondo = loadImage('./img/pista.jpeg');
  
  // Impostazione iniziale per evitare che imgVisualizzata sia vuota all'inizio
  imgVisualizzata = imgSciatoreDX;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  livelloSuolo = height - 120; 
  sciatoreY = livelloSuolo;
  sciatoreX = width / 2;

  handpose = ml5.handpose(video, () => console.log("IA Pronta"));
  handpose.on("predict", results => predictions = results);
}

function draw() {
  image(imgSfondo, 0, 0, width, height);
  
  // --- 1. FISICA SEMPRE ATTIVA (Il segreto per non farlo bloccare) ---
  sciatoreY += velocitaY;
  if (sciatoreY < livelloSuolo) {
    velocitaY += gravita;
    aTerra = false;
  } else {
    sciatoreY = livelloSuolo;
    velocitaY = 0;
    aTerra = true;
  }

  // --- 2. GESTIONE MOVIMENTO ---
  if (predictions.length > 0) {
    let prediction = predictions[0];
    let rawX = prediction.landmarks[9][0];
    let handX = map(rawX, 0, 640, width, 0); 
    let handY = prediction.landmarks[9][1];
    
    let vecchiaX = sciatoreX;
    sciatoreX = lerp(sciatoreX, handX, 0.2); 

    // Cambio immagine DX/SX
    if (sciatoreX > vecchiaX + 1) {
      imgVisualizzata = imgSciatoreDX;
    } else if (sciatoreX < vecchiaX - 1) {
      imgVisualizzata = imgSciatoreSX;
    }

    // Salto
    if (handY < 200 && aTerra) {
      velocitaY = forzaSalto;
    }
  }

  // Limiti dello schermo per non perdere lo sciatore
  sciatoreX = constrain(sciatoreX, 50, width - 50);

  // --- 3. DISEGNO ---
  push();
  imageMode(CENTER);
  if (imgVisualizzata) {
    image(imgVisualizzata, sciatoreX, sciatoreY, 120, 100);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  livelloSuolo = height - 120;
}