let table;

function preload() {
  // put preload code here
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  console.log(table);

  let outerPadding = 40; // Aumento il padding per dare più spazio
  let padding = 20;     // Aumento il padding tra i glifi
  let itemSize = 80;    // Aumento la dimensione di base per glifi più grandi

  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding));

  let rows = ceil(table.getRowCount() / cols);

  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;

  createCanvas(windowWidth, totalHeight);
  background("#f0f8ff"); // Colore di sfondo chiaro
  console.log("colonne", cols, "rows", rows);

  let colCount = 0;
  let rowCount = 0;

  // Calcolo min e max globali per column0 una sola volta
  let allValues = table.getColumn("column0");
  let minValue = min(allValues);
  let maxValue = max(allValues);
  
  // Parametri numero di foglie
  let minLeaves = 1; 
  let maxLeaves = 5; 

  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {

    let data = table.getRow(rowNumber).obj;
    let myValue = float(data["column0"]); // Assicurati che sia un numero

    // Mappa il valore di column0 in un numero intero di foglie
    let numLeaves = floor(map(myValue, minValue, maxValue, minLeaves, maxLeaves + 0.999)); // +0.999 per includere maxLeaves

    let xPos = outerPadding + colCount * (itemSize + padding) + itemSize / 2;
    let yPos = outerPadding + rowCount * (itemSize + padding) + itemSize / 2;

    // Disegna il glifo della piantina
    drawPlantGlyph(xPos, yPos, itemSize, numLeaves);

    colCount++;

    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }

}

function draw() {
  // Lascia la funzione draw() vuota per il momento
}

/**
 * Disegna un glifo a forma di piantina
 * @param {number} x - Posizione X centrale del glifo
 * @param {number} y - Posizione Y centrale del glifo
 * @param {number} size - Dimensione di base del glifo
 * @param {number} leaves - Numero di "foglie" da disegnare
 */
function drawPlantGlyph(x, y, size, leaves) {
  push();
  translate(x, y); // Sposta l'origine al centro del glifo

  let stemHeight = size * 0.7; // Altezza del gambo
  let stemWidth = 3;

  // GAMBO
  stroke(0, 150, 0);
  strokeWeight(stemWidth);
  line(0, 0, 0, stemHeight / 2); // Gambo centrale (dall'alto al basso)
  
  // FOGLIE
  noStroke();
  fill(0, 200, 0); 
  let leafSize = size * 0.15;
  let angleStep = 360 / leaves;
  
  // Disegna le foglie disposte a raggiera
  for (let i = 0; i < leaves; i++) {
    let angle = angleStep * i;
    
    push();
    rotate(radians(angle)); // Ruota per ogni foglia
    
    // Posiziona la foglia in alto sul gambo
    ellipse(0, -stemHeight * 0.25, leafSize * 2, leafSize); 
    
    pop();
  }

  
  pop();
}