function Particle(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.history = [];
  
  this.clear = function(){
    this.history = [];
  }

  this.update = function(x1,y1, z1) {
    this.x += x1;
    this.y += y1;
    this.z += z1;

    var v = createVector(x1, y1, z1);
    this.history.push(v);
    if (this.history.length > 2000) {
      this.history.splice(0, 1);
    }
  };

  this.show = function() {
    stroke(0);
    fill(0, 150);
    
    fill(255,0,0,100);
    stroke(255,0,0,100);
    ellipse(this.x, this.y, 24, 24);

    //beginShape();
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      stroke(map(pos.z, 0,2000, 0, 255),0,0,250);
      ellipse(pos.x, pos.y, 4, 4);
      //vertex(pos.x, pos.y);
    }
    //endShape();
    stroke(0);
  };
};

function mousePressed(){
  trail[0].clear() 
}

function mouseDragged(){
  trail[0].clear() 
}

function mouseReleased(){
  trail[0].clear() 
}
