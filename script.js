const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 564;
canvas.height = 868;

class Cell {
  constructor(effect, x, y) {
    this.effect = effect;
    this.x = x;
    this.y = y;
    this.positionX = this.effect.width * 0.5;
    this.positionY = this.effect.height * 0.5;
    this.speedX;
    this.speedY;
    this.width = effect.cellWidth;
    this.height = effect.cellHeight;
    this.slideX = 0;
    this.slideY = 0;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.1;
    this.forceInhencer = 5;
    this.friction = 0.9;
    this.randomize = Math.random() * 30 + 10;
    this.start();
    this.strokeOpacity = 0;
  }

  draw(context) {
    context.drawImage(
      this.effect.image,
      this.x + this.slideX,
      this.y + this.slideY,
      this.width,
      this.height,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
    context.save();
    context.strokeStyle = `rgba(255,255,255, ${this.strokeOpacity})`;
    context.strokeRect(this.positionX, this.positionY, this.width, this.height);
    context.restore();
  }
  start() {
    this.speedX = (this.x - this.positionX) / this.randomize;
    this.speedY = (this.y - this.positionY) / this.randomize;
  }
  update() {
    if (Math.abs(this.speedX) > 0.001 || Math.abs(this.speedY) > 0.001) {
      this.speedX = (this.x - this.positionX) / this.randomize;
      this.speedY = (this.y - this.positionY) / this.randomize;
      this.positionX += this.speedX;
      this.positionY += this.speedY;
    }

    const dx = this.effect.mouse.x - this.x;
    const dy = this.effect.mouse.y - this.y;

    const distance = Math.hypot(dx, dy);

    if (distance < this.effect.mouse.radius) {
      const angle = Math.atan2(dy, dx);
      const force = (distance / this.effect.mouse.radius) * this.forceInhencer;
      this.vx = force * Math.cos(angle);
      this.vy = force * Math.sin(angle);
    }

    this.slideX += (this.vx *= this.friction) - this.slideX * this.ease;
    this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.cellWidth = this.width / 20;
    this.cellHeight = this.height / 30;
    this.imageGrid = [];
    this.createGrid();
    this.image = document.getElementById("image-1");
    this.mouse = {
      x: undefined,
      y: undefined,
      radius: 100,
    };
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });
    this.canvas.addEventListener("mouseleave", (e) => {
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    });
  }
  createGrid() {
    for (let y = 0; y < this.height; y += this.cellHeight) {
      for (let x = 0; x < this.width; x += this.cellWidth) {
        this.imageGrid.push(new Cell(this, x, y));
      }
    }
  }
  render(context) {
    this.imageGrid.forEach((e) => {
      e.update();
      e.draw(context);
    });
    // context.save();
    // context.beginPath();

    // // Draw the circle
    // context.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, 2 * Math.PI);
    // context.fillStyle = `rgba(173, 216, 230, 0.05)`; // Light blue with opacity
    // context.fill();
    // // Outline the circle
    // // context.stroke();
    // context.restore();
  }
}

const effect = new Effect(canvas);

function animate() {
  //ctx.clearRect(0, 0, canvas.height, canvas.width);
  effect.render(ctx);
  requestAnimationFrame(animate);
}

animate();
