const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 564;
canvas.height = 868;

class Cell {
  constructor(effect, x, y) {
    this.effect = effect;
    this.x = x;
    this.y = y;
    this.width = effect.cellWidth;
    this.height = effect.cellHeight;
    this.slideX = Math.random() * 5;
    this.slideY = Math.random() * 5;
  }

  draw(context) {
    context.drawImage(
      this.effect.image,
      this.x + this.slideX,
      this.y + this.slideY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.slideX = Math.random() * 5;
    this.slideY = Math.random() * 5;
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.cellWidth = this.width / 35;
    this.cellHeight = this.height / 55;
    this.imageGrid = [];
    this.createGrid();
    this.image = document.getElementById("image-1");
    this.mouse = {
      x: null,
      y: null,
      radius: 100,
    };
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      console.log(e, this.mouse);
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
  }
}

const effect = new Effect(canvas);

function animate() {
  effect.render(ctx);
  requestAnimationFrame(animate);
}

animate();
