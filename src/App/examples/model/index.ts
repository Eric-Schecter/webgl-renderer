import { vec3 } from "gl-matrix";
import { Application, GLTFLoader, OrbitControl, PerspectiveCamera } from "../../gl";
import { Mesh } from "./mesh";
import { ModelLayer } from "./model_layer";

export class ModelDemo extends Application {
  private control: OrbitControl;
  constructor(container: HTMLDivElement) {
    super(container);

    const fov = Math.PI * 60 / 180;
    const aspect = this.window.width / this.window.height;
    const near = 0.1;
    const far = 1000;
    const target = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);

    (this.camera as PerspectiveCamera).setProjection(fov, aspect, near, far);

    this.control = new OrbitControl(this.window.canvas, this.camera, target, up, 4, Math.PI / 3, Math.PI / 8);
    this.control.updateViewMatrix()

    const modelLayer = new ModelLayer(this.gl, this.window, this.control);
    this.layers.push(modelLayer);
    new GLTFLoader().load('models/DamagedHelmet/DamagedHelmet.gltf')
      .then((model) => {
        const { positions, indices } = model[0];
        modelLayer.mesh = new Mesh(this.gl, Array.from(positions), Array.from(indices));
      })
  }
}