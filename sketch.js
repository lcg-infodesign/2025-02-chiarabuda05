let table;
let allValues = {}; // Oggetto per memorizzare min/max delle colonne necessarie

function preload() {
  // Carica il dataset
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  console.log(table);

  // Colonne da analizzare per la mappatura continua
  const columnsToAnalyze = ["column0", "column2", "column3", "column4"]; 
  const columnsToUse = ["column0", "column1", "column2", "column3", "column4"];

  // 1. Calcola Min/Max per le colonne che usano la mappatura continua
  for (let name of columnsToAnalyze) {
    // Usiamo .map(Number) per assicurarci che i valori siano numerici
    let values = table.getColumn(name).map(Number); 
    allValues[name] = {
      min: min(values),
      max: max(values)
    };
  }
  console.log("Min/Max per le colonne:", allValues);

  // Impostazioni di layout
  let outerPadding = 20; // Ridotto per un po' più di spazio
  let padding = 10;      // RIDOTTO per avvicinare i fiori
  let itemBaseSize = 100; // Dimensione base fissa

  let cols = floor((windowWidth - outerPadding * 2) / (itemBaseSize + padding));
  let rows = ceil(table.getRowCount() / cols);
  // Ridotta l'altezza per evitare troppo spazio se i glifi si toccano
  let totalHeight = outerPadding * 2 + rows * itemBaseSize + (rows - 1) * padding; 

  createCanvas(windowWidth, totalHeight);
  background(240, 240, 220); // Sfondo chiaro
  colorMode(RGB); 

  let colCount = 0;
  let rowCount = 0;

  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {
    let data = table.getRow(rowNumber).obj;
    let params = {};
    for (let name of columnsToUse) {
      params[name] = float(data[name]); // Estrai i dati come float
    }
    
    // Mappatura: Column0 -> Altezza del gambo (da 40% a 90% della dimensione)
    let stemHeightRatio = map(params["column0"], allValues["column0"].min, allValues["column0"].max, 0.4, 0.9);
    
    
    
    // Mappatura: Column2 -> Numero di foglie (1 a 5)
    let numLeaves = floor(map(params["column2"], allValues["column2"].min, allValues["column2"].max, 1, 5.999));
    
    // Mappatura: Column3 -> Numero di petali (3 a 8) <-- NUOVA MAPPATURA
    let numPetals = floor(map(params["column3"], allValues["column3"].min, allValues["column3"].max, 3, 8.999));

    // Mappatura: Column4 -> Grandezza generale della pianta (da 0.5x a 1.0x)
    let plantScale = map(params["column4"], allValues["column4"].min, allValues["column4"].max, 0.5, 1.0);
    
    // Posizionamento
    let xPos = outerPadding + colCount * (itemBaseSize + padding) + itemBaseSize / 2;
    let yPos = outerPadding + rowCount * (itemBaseSize + padding) + itemBaseSize / 2;
// Mappatura: Column1 -> Colore del fiore (Rosso o Giallo - Discreto/Pari-Dispari)
    let flowerColor;
    if (int(params["column1"]) % 2 === 0) { // Se è PARI
        flowerColor = color("#5688"); // Rosso
    } else { // Se è DISPARI
        flowerColor = color("rgba(51, 119, 153, 0.6)"); // Giallo
    }
    // Disegna il glifo
    drawPlantGlyph(xPos, yPos, itemBaseSize, plantScale, stemHeightRatio, flowerColor, numLeaves, numPetals);

    colCount++;

    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

function draw() {
  // Funzione draw vuota
}

/**
 * Disegna un glifo a forma di piantina con tutti i parametri definiti dai dati.
 * @param {number} x - Posizione X centrale del glifo.
 * @param {number} y - Posizione Y centrale del glifo.
 * @param {number} baseSize - Dimensione base del contenitore.
 * @param {number} plantScale - Grandezza generale (da column4).
 * @param {number} stemRatio - Ratio di altezza del gambo (da column0).
 * @param {p5.Color} fColor - Colore del fiore (Rosso o Giallo da column1).
 * @param {number} leaves - Numero di foglie (da column2).
 * @param {number} petals - Numero di petali (da column3). <-- NUOVO PARAMETRO
 */
function drawPlantGlyph(x, y, baseSize, plantScale, stemRatio, fColor, leaves, petals) {
  push();
  translate(x, y);
  scale(plantScale); // Applica la scala generale (column4)

  let size = baseSize;
  let stemHeight = size * stemRatio; // Altezza dinamica (column0)
  let stemWidth = 4;
  let leafLength = size * 0.3; 
  let leafAngle = 30; // Angolo di inclinazione minore (più verso l'alto)
  let leafControlOffset = leafLength * 0.1; // Controlli più vicini per forma slanciati
  
  // Coordinate del centro del fiore
  let flowerCenterX = 0;
  let flowerCenterY = size / 2 - stemHeight;


  // 1. GAMBO 
  stroke(70, 100, 40,); 
  strokeWeight(stemWidth);
  line(0, size / 2.5, 0, flowerCenterY); // Il gambo termina al centro del fiore
  
  
  // 3. FIORE/CIMA (dipende da column1 e column3)
  noStroke();
  fill(fColor); // Colore dinamico (Rosso o Giallo)
  let flowerRadius = size * 0.12;
  
  // Disegna i petali (column3)
  let angleStep = 360 / petals;

  for (let i = 0; i < petals; i++) {
    push();
    // 1. Sposta all'attacco del fiore
    translate(flowerCenterX, flowerCenterY); 
    
    // 2. RUOTA in base al passo angolare
    rotate(radians(angleStep * i)); 

    // 3.  petalo
    
    ellipse(0, -flowerRadius * 1.5, flowerRadius * 0.7, flowerRadius * 2);

    pop();
  }

  // Centro del fiore
  fill(255, 165, 0); // Arancione
  ellipse(flowerCenterX, flowerCenterY, flowerRadius * 0.7); 

  // 4. Ripristina lo stato
  pop();
}