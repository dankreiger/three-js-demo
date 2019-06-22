import {
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera,
  BoxBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  DirectionalLight,
  TextureLoader,
  sRGBEncoding
} from 'three';

/** First a three js scene */
export default class First {
  constructor() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.scene = new Scene();
    this.mesh = new Mesh();
    this.container = document.querySelector('#scene-container');
    this.geometry = new BoxBufferGeometry(2, 2, 2);
    // this.material = new MeshStandardMaterial({ color: 0x800080 });
    this.light = new DirectionalLight(0xffffff, 3.0);
    this.textureLoader = new TextureLoader();
  }

  initCamera() {
    // Create a Camera
    const fov = 35; // AKA Field of View
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 0.1; // the near clipping plane
    const far = 100; // the far clipping plane

    this.camera = new PerspectiveCamera(fov, aspect, near, far);

    // every object is initially created at ( 0, 0, 0 )
    // we'll move the camera back a bit so that we can view the scene
    this.camera.position.set(0, 0, 10);
  }

  initialize() {
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Set the background color
    this.scene.background = new Color('skyblue');
    this.initCamera();

    // move the light back and up a bit
    this.light.position.set(10, 10, 10);

    // remember to add the light to the scene
    this.scene.add(this.light);

    // Load a texture. See the note in chapter 4 on working locally, or the page
    // https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
    // if you run into problems here
    const texture = this.textureLoader.load(
      'https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg'
    );

    // set the "color space" of the texture
    texture.encoding = sRGBEncoding;

    // reduce blurring at glancing angles
    texture.anisotropy = 16;

    // create a Standard material using the texture we just loaded as a color map
    this.material = new MeshStandardMaterial({
      map: texture
    });

    // create a Mesh containing the geometry and material
    this.mesh = new Mesh(this.geometry, this.material);

    // add the mesh to the scene
    this.scene.add(this.mesh);

    // set the gamma correction so that output colors look
    // correct on our screens
    this.renderer.gammaFactor = 2.2;
    this.renderer.gammaOutput = true;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    // add the automatically created <canvas> element to the page
    this.container.appendChild(this.renderer.domElement);
  }

  // perform any updates to the scene, called once per frame
  // avoid heavy computation here
  update() {
    // increase the mesh's rotation each frame
    this.mesh.rotation.z += 0.01;
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
  }

  animate() {
    // call animate recursively
    requestAnimationFrame(this.animate.bind(this));

    // increase the mesh's rotation each frame
    this.update();
    // render, or 'create a still image', of the scene
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    // set the aspect ratio to match the new browser window aspect ratio
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;

    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }
}
