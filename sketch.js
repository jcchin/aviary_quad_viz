// API Key for MapboxGL. Get one here:
// https://www.mapbox.com/studio/account/tokens/
const key='pk.eyJ1IjoiamNjaGluIiwiYSI6ImNrOGo4Z3AwczA3ZGMzbHA1ZWZtd2wwcjIifQ.GS957vuiuTQvsmLSlQ-4UA';

// Options for map
const options = {
  lat: 41.41,
  lng: -81.50,
  zoom: 9,
  style: 'mapbox://styles/mapbox/satellite-v9',
  pitch: 0,
};

// Create an instance of MapboxGL
const mappa = new Mappa('MapboxGL', key);
let myMap;
var table;

function preload() {
  //table = loadTable("output.csv", "csv", "header");
  table = loadTable("output.csv", "csv", "header");
  myFont = loadFont('Inconsolata.otf');
  alt_history = [];
}

function setup() {
  
  canvas = createCanvas(800, 800, WEBGL); //activate WEBGL 800x800px
  fill(204, 101, 192, 120); // fill color
  stroke(127, 63, 120); // line stroke color

  //count the columns
  console.log(table.getRowCount() + " total rows in table");
  console.log(table.getColumnCount() + " total columns in table");
  
  fill(255,255,255,255);
  textFont(myFont);
  textSize(30);
  
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
}


function draw() {
  background(230,230,230,180);
  timeStep = floor(millis()/200) //step through rows every second
  //text(timeStep, 10, 10)
  let row = table.getRow(timeStep%table.getRowCount()) //read from CSV, modulus loop after complete
  SOC = row.getString(0);
  V = row.getString(1);
  I = row.getString(2);
  velo = abs(row.getString(3));
  lon = -81.85 + row.getString(4)/111;
  alt = (row.getString(5) - 1.524)*3280.84;
  pwr = row.getString(6);
  phi = row.getString(7);
  t = row.getString(8);
  lat = 41.411;
  temp1 = 55;
  // ---- map point ----//
  // Transform lat/lng to pixel position
  const pos = myMap.latLngToPixel(lat, lon);
  ellipse(pos.x-400, pos.y-400, 10, 10);
  
  // ---- battery graphic --- //
  translate(-400,-200,0);
  fill(map(SOC,0,1,200,150),250-map(SOC,0,1,250,0), 0,227); //green->yellow->red
  stroke(127, 63, 120);
  rect(40, 120, 20, -(90-map(SOC,0,1,90,0))); //x,y,w,h
  fill(4, 10, 4, 7); // transparent
  stroke(127, 127, 120, 250);
  rect(40, 120, 20, -90); //battery outline
  rect(45, 25, 10, 5); //battery outline
  fill(0, 0, 0, 250); // transparent
  text("SOC: ",75,50,200);
  text(SOC,135,50,200);
  
  // ---- temp graphic --- //
  translate(0,400,0);
  fill(255,0,0,227); //red
  stroke(127, 63, 120);
  rect(40, 120, 20, -(90-map(temp1,40,100,90,0))); //x,y,w,h T1
  rect(80, 120, 20, -(90-map(temp1,40,100,90,0))*noise(temp1)); //T2
  rect(120, 120, 20, -(90-map(temp1,40,100,90,0))*noise(velo)); //T3
  fill(4, 10, 4, 7); // transparent
  stroke(127, 127, 120, 250);
  rect(40, 120, 20, -90); //thermometer outline
  rect(80, 120, 20, -90); //thermometer outline 2
  rect(120, 120, 20, -90); //thermometer outline 3

  fill(255,0,0,227); //bulb color
  circle(50, 130, 30); //thermometer bulb
  circle(90, 130, 30); //thermometer bulb 2
  circle(130, 130, 30); //thermometer bulb 3
  fill(0, 0, 0, 250); // transparent
  textSize(22);
  text("Motr",15,0,200);
  text(temp1,40,20,200);
  text("Invr",70,0,200);
  text(floor(temp1*noise(temp1)),80,20,200);
  text("Batt",120,0,200);
  text(floor(temp1*noise(velo)),120,20,200);
  translate(0,-400,0);
  
  // ----- alt graphic ---- //
  rect(10,-200,780,600/4)
  strokeWeight(2);
  text("alt: ",75,10,200);
  text(round(alt),135,10,200);
  alt_history.push(alt);
  stroke(100,100,250);
  noFill();
  beginShape();
  let i=0;
  for(let i=0; i < alt_history.length; i++){
    let y = map(alt_history[i],0,6000,600/6,0);
    vertex(i+150,y-60,250);
  }
  endShape();
  if (alt_history.length > 500){
    alt_history.splice(0,1);
  }

  stroke(250,10,10);
  wall = map(alt_history.indexOf(0), 0, 500, 0, 800-15);
  if (wall > 10){
    line(wall+10,-200,wall+10,-50);
  }
  // ---- speedometer ----- //
  fill(0)
  text("Vel: ",15, 200, 200);
  text(round(velo),75, 200, 200);
  stroke(0)
  fill(255,255,255,230);
  arc(75, 250, 80, 80, PI*0.9, 2.1*PI, PIE); //speedometer
  stroke(250);
  fill(255,255,0,200);
  arc(76, 249, 74, 74, PI*1.3, 2.1*PI, PIE); //yellow zone
  fill(255,0,0,200);
  arc(76, 249, 74, 74, PI*1.9, 2.1*PI, PIE); //red zone
  strokeWeight(4);
  vel = map(velo, 0, 240, 0, 1.2*PI) + PI*0.9;
  stroke(0,0,250,250);
  line(75, 250, 75 + cos(vel) * 40, 250 + sin(vel) * 40); // dial
  strokeWeight(1);
  
  fill(0)
  text("Pwr: ",15, 300, 200);
  text(round(pwr),75, 300, 200);
  stroke(0)
  fill(255,255,255,230);
  arc(75, 350, 80, 80, PI*0.79, 2.1*PI, PIE); //speedometer
  stroke(250);
  fill(0,255,0,200);
  arc(76, 348, 79, 79, PI*0.8, 1.0*PI, PIE); //green zone
  fill(255,255,0,200);
  arc(76, 349, 74, 74, PI*1.3, 2.1*PI, PIE); //yellow zone
  fill(255,0,0,200);
  arc(76, 349, 74, 74, PI*1.9, 2.1*PI, PIE); //red zone
  strokeWeight(4);
  pwra = map(pwr, -10000, 50000, 0, 1.2*PI) + PI*0.9;
  stroke(0,0,250,250);
  line(75, 350, 75 + cos(pwra) * 40, 350 + sin(pwra) * 40); // dial
  strokeWeight(1);
  // ---- quadrotor graphic --- //
  normalMaterial();
  push();
  translate(100,-100,0)
  //rotateZ(frameCount * 0.01);
  rotateY(0); //frameCount*0.0
  rotateX(PI/2.5- radians(phi));
  //rotateY(frameCount * 0.01);
  translate(0,40,-20);
  cone(30, 40);
  translate(0,-40,0);
  cylinder(35, 35);
  translate(-30, -30, 30);
  torus(20,5);
  translate(60, 0, 0);
  torus(20,5);
  translate(0, 60, 0);
  torus(20,5);
  translate(-60, 0, 0);
  torus(20,5);
  pop();
  
}
