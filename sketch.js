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
  plane = loadModel('quadflapcolE_v5.obj', true);
}

function setup() {
  
  canvas = createCanvas(800, 800, WEBGL); //activate WEBGL 800x800px
  fill(204, 101, 192, 220); // fill color
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
  background(230,230,230,10);
  timeStep = floor(millis()/50) //step through rows every second
  //text(timeStep, 10, 10)
  let row = table.getRow(timeStep%table.getRowCount()) //read from CSV, modulus loop after complete
  SOC = row.getString(0);
  V = row.getString(1);
  I = row.getString(2);
  velo = abs(row.getString(3));
  lon = -81.85 + row.getString(4)/111;
  alt = (row.getString(5) - 1.524)*3280.84;
  pwr = row.getString(6)*2;
  phi = row.getString(7);
  rpmR = row.getString(8);
  rpmF = row.getString(9);
  t = row.getString(10);
  T_batt = row.getString(11)-273.15;
  T_cool = row.getString(12)-273.15;
  T_mot = row.getString(13)-273.15;
  TMS_pwr = row.getString(14);
  pwr = pwr + float(TMS_pwr);
  lat = 41.411;
  temp1 = 55;
  // ---- map point ----//
  // Transform lat/lng to pixel position
  const pos = myMap.latLngToPixel(lat, lon);
  fill(255,0,0,255);
  stroke(0);
  ellipse(pos.x-400, pos.y-400, 10, 10);
  
  // ---- battery graphic --- //
  translate(-400,-200,0);
  fill(255,255,255,220);
  rect(10,-20,150,625); // white box
  push();
  rotateZ(PI/2);
  translate(-30,-150,0);
  fill(map(SOC,0,1,200,150),250-map(SOC,0,1,250,0), 0,237); //green->yellow->red
  stroke(0);
  rect(40, 120, 20, -(90-map(SOC,0,1,90,0))); //x,y,w,h
  fill(4, 10, 4, 7); // transparent
  stroke(0, 0, 0, 250);
  rect(40, 120, 20, -90); //battery outline
  rect(45, 25, 10, 5); //battery outline
  fill(0, 0, 0, 250); // transparent
  pop();
  fill(0);
  text("SOC: ",20,0,200);
  text(nf(SOC,1,3),75,0,200);
  text("Volts: ",20,50,200);
  text(round(V),100,50,200);
  // ---- temp graphic --- //
  translate(0,400,0);
  fill(255,0,0,227); //red
  stroke(127, 63, 120);
  rect(30, 120, 20, -(90-map(T_mot,30,80,90,0))); //x,y,w,h T1
  rect(70, 120, 20, -(90-map(T_batt,30,60,90,0))); //T2
  rect(110, 120, 20, -(90-map(T_cool,30,60,90,0))); //T3
  fill(4, 10, 4, 7); // transparent
  stroke(127, 127, 120, 250);
  rect(30, 120, 20, -90); //thermometer outline
  rect(70, 120, 20, -90); //thermometer outline 2
  rect(110, 120, 20, -90); //thermometer outline 3

  fill(255,0,0,227); //bulb color
  circle(40, 130, 30); //thermometer bulb
  circle(80, 130, 30); //thermometer bulb 2
  circle(120, 130, 30); //thermometer bulb 3
  fill(0, 0, 0, 250); // transparent
  textSize(22);
  text("Motr",15,0,200);
  text(floor(T_mot),30,20,200);
  text("Batt",60,0,200);
  text(floor(T_batt),80,20,200);
  text("Cool",110,0,200);
  text(floor(T_cool),120,20,200);
  translate(0,-400,0);
  
  // ----- alt graphic ---- //
  rect(10,-200,780,600/4);  
  strokeWeight(3);
  fill(255);
  textSize(26);
  text("alt: ",15,-170,800);
  fill(255);
  text(round(alt),70,-170,200);
  alt_history.push(alt);
  stroke(100,100,250);
  noFill();
  beginShape();
  let i=0;
  for(let i=0; i < alt_history.length; i++){
    let y = map(alt_history[i],0,2000,600/6,0);
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
  text("RPM F/R: ",25, 80, 200);
  text(round(rpmF),25, 100, 200);
  text("/",70, 100, 200);
  text(round(rpmR),87, 100, 200);
  stroke(0)
  strokeWeight(1);
  fill(255,255,255,230);
  arc(75, 150, 80, 80, PI*0.9, 2.1*PI, PIE); //speedometer
  stroke(250);
  fill(255,0,0,200);
  strokeWeight(4);
  rpmRo = map(rpmR, 620, 720, 0, 1.2*PI) + PI*0.9;
  rpmFo = map(rpmF, 620, 720, 0, 1.2*PI) + PI*0.9;
  stroke(0,0,250,250);
  line(75, 150, 75 + cos(rpmRo) * 40, 150 + sin(rpmRo) * 40); // dial1
  stroke(250,0,0,250);
  line(75, 150, 75 + cos(rpmFo) * 40, 150 + sin(rpmFo) * 40); // dial2
  strokeWeight(1);
  
  fill(0)
  text("Vel: ",25, 200, 200);
  text(round(velo),85, 200, 200);
  stroke(0)
  strokeWeight(1);
  fill(255,255,255,230);
  arc(75, 250, 80, 80, PI*0.9, 2.1*PI, PIE); //speedometer
  stroke(250);
  fill(255,255,0,200);
  arc(76, 249, 74, 74, PI*1.3, 2.1*PI, PIE); //yellow zone
  fill(255,0,0,200);
  arc(76, 249, 74, 74, PI*1.9, 2.1*PI, PIE); //red zone
  strokeWeight(4);
  vel = map(velo, 0, 60, 0, 1.2*PI) + PI*0.9;
  stroke(0,0,250,250);
  line(75, 250, 75 + cos(vel) * 40, 250 + sin(vel) * 40); // dial
  strokeWeight(1);
  
  fill(0)
  text("Pwr: ",15, 300, 200);
  text(round(pwr),75, 300, 200);
  text('kW',105, 300, 200);
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
  pwra = map(pwr, 22, 35, 0, 1.2*PI) + PI*0.9;
  stroke(0,0,250,250);
  line(75, 350, 75 + cos(pwra) * 40, 350 + sin(pwra) * 40); // dial
  strokeWeight(1);
  // ---- quadrotor graphic --- //
  normalMaterial();
  push();
  translate(175,-100,0)
  rotateZ(radians(phi));
  rotateY(PI);
  rotateX(PI/2+PI/6); //frameCount*0.0
  //rotateY(PI/2.5- radians(phi));
  //rotateY(frameCount * 0.01);
  model(plane)
  // translate(0,40,-20);
  // cone(30, 40);
  // translate(0,-40,0);
  // cylinder(35, 35);
  // translate(-30, -30, 30);
  // torus(20,5);
  // translate(60, 0, 0);
  // torus(20,5);
  // translate(0, 60, 0);
  // torus(20,5);
  // translate(-60, 0, 0);
  // torus(20,5);
  pop();
  
}
