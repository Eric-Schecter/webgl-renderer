import { vec3 } from "gl-matrix";
import { Application, OrbitControl } from "../../gl";
import { BoxLayer, PlaneLayer } from "./layers";

export class LightsDemo extends Application {
  private control: OrbitControl;
  constructor(container: HTMLDivElement) {
    super(container);

    const fov = Math.PI * 60 / 180;
    const aspect = this.window.width / this.window.height;
    const near = 0.1;
    const far = 1000;
    const target = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);

    this.camera.setProjection(fov, aspect, near, far);

    this.control = new OrbitControl(this.window.canvas, this.camera, target, up, 4, Math.PI / 3, Math.PI / 8);
    this.control.updateViewMatrix();

    const planeLayer = new PlaneLayer(this.gl, this.window, this.control);
    const boxLayer = new BoxLayer(this.gl, this.window, this.control);
    this.layers.push(planeLayer, boxLayer);
  }

}