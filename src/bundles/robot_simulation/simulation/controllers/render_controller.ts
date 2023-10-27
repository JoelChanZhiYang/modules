import * as THREE from 'three';


export const sceneOptions = {
  height: 600,
  width: 800,
} as const;


export class RenderController {
  #scene: THREE.Scene;
  #camera: THREE.Camera;
  #renderer: THREE.WebGLRenderer;

  constructor() {
    this.#scene = new THREE.Scene();

    const renderAspectRatio = sceneOptions.width / sceneOptions.height;
    this.#camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.01, 1000);

    this.#renderer = new THREE.WebGLRenderer({ antialias: true });
  }

  init() {
    this.#scene.background = new THREE.Color(0xffffff);
    const light = new THREE.AmbientLight(0xffffff);
    this.#scene.add(light);

    this.#camera.translateY(3);
    this.#camera.lookAt(new THREE.Vector3(0, -1.5, 0));

    // this.#camera.translateX(0.8);
    // this.#camera.translateY(0.5);
    // this.#camera.lookAt(new THREE.Vector3(0, 0.5, 0));

    this.#renderer.setSize(sceneOptions.width, sceneOptions.height);
    this.#renderer.setPixelRatio(window.devicePixelRatio * 1.5);
  }

  setRendererOutput(domElement: HTMLDivElement) {
    domElement.replaceChildren(this.#renderer.domElement);
  }

  addMesh(mesh: THREE.Mesh) {
    this.#scene.add(mesh);
  }

  step(_: number) {
    this.#renderer.render(this.#scene, this.#camera);
  }
}
