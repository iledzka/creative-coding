const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/1000.json');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {

  const createGrid = () => {
    const points = [];
    const count = 30;
    const palette = random.pick(palettes);

    for (let x = 0; x < count; x++){
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v) * 0.05);
        points.push({
          position: [ u, v ],
          radius,
          color: random.pick(palette)
        });
      }
    }
    return points;
  };

  const points = createGrid().filter(()=> Math.random() > 0.5);
  const margin = 100;
  

  return ({ context, width, height }) => {

    

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color
      } = data;

      const [ u, v ] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
context.save();
      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 0.4, false);
   context.rotate(6);
      context.fillStyle = color;
 
      context.fill();
      context.restore();
    }) 
  };
};

canvasSketch(sketch, settings);
