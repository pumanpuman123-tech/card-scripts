(function(){
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var petals = [];
  var COLORS = ['#ffb7c5','#ff90a8','#ffd6e0','#ffccd5','#ff8fab','#ffc2d1'];

  function Petal(){
    this.reset();
  }
  Petal.prototype.reset = function(){
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.r = Math.random() * 6 + 3;
    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
    this.vx = (Math.random()-0.5)*1.5;
    this.vy = Math.random()*1.5+0.8;
    this.angle = Math.random()*Math.PI*2;
    this.va = (Math.random()-0.5)*0.05;
    this.alpha = Math.random()*0.5+0.5;
    this.swing = Math.random()*0.03;
    this.swingOffset = Math.random()*Math.PI*2;
    this.t = 0;
  };
  Petal.prototype.update = function(){
    this.t += 0.02;
    this.x += this.vx + Math.sin(this.t + this.swingOffset)*this.swing*20;
    this.y += this.vy;
    this.angle += this.va;
    if(this.y > canvas.height + 20) this.reset();
  };
  Petal.prototype.draw = function(){
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    // 花瓣形状
    ctx.moveTo(0, -this.r);
    ctx.bezierCurveTo(this.r, -this.r, this.r, this.r, 0, this.r);
    ctx.bezierCurveTo(-this.r, this.r, -this.r, -this.r, 0, -this.r);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  };

  for(var i=0;i<60;i++){
    var p = new Petal();
    p.y = Math.random()*canvas.height; // 初始分散
    petals.push(p);
  }

  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0;i<petals.length;i++){
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
