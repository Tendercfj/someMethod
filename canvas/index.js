const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

function init() {
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
}
init();

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class Point {
  constructor() {
    this.r = 6;
    this.x = getRandom(0, cvs.width - this.r / 2);
    this.y = getRandom(0, cvs.height - this.r / 2);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

class Graph {
  constructor(pointNumber = 30) {
    this.points = new Array(pointNumber).fill(0).map(() => new Point());
  }

  draw() {
    this.points.forEach((point) => {
      point.draw();
    });
  }
}

const graph = new Graph(30);
graph.draw();
