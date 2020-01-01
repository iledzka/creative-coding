// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

   // Get a palette for our scene
   const palette = random.pick(palettes);

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 14, 7);

  // Randomize mesh attributes
  const randomizeMesh = (mesh) => {
    // Choose a random point in a 3D volume between -1..1
    const point = new THREE.Vector3(
      random.value() * 2 - 1,
      random.value() * 2 - 1,
      random.value() * 2 - 1
    );
    mesh.position.copy(point);
    mesh.originalPosition = mesh.position.clone();

    // Choose a color for the mesh material
    mesh.material.color.set(random.pick(palette));

    // Randomly scale each axis
    mesh.scale.set(
      random.gaussian(),
      random.gaussian(),
      random.gaussian()
    );

    // Do more random scaling on each axis
    if (random.chance(0.5)) mesh.scale.x *= random.gaussian();
    if (random.chance(0.5)) mesh.scale.y *= random.gaussian();
    if (random.chance(0.5)) mesh.scale.z *= random.gaussian();

    // Further scale each object
    mesh.scale.multiplyScalar(random.gaussian() * 0.25);
  };

  // A group that will hold all of our cubes
  const container = new THREE.Group();

  // The # of cubes to create
  const chunks = 50;

  // Create each cube and return a THREE.Mesh
  const meshes = Array.from(new Array(chunks)).map(() => {

    const material = new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 1,
      color: random.pick(palette)
    });


    // Create and Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);

    // Randomize it
    randomizeMesh(mesh);

    return mesh;
  });

  // Add meshes to the group
  meshes.forEach(m => container.add(m));

  // Then add the group to the scene
  scene.add(container);

  // Add a harsh light to the scene
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 3, 8);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      // Setup an isometric perspective
      const aspect = viewportWidth / viewportHeight;
      const zoom = 1.85;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update camera properties
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
     
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
