import { vec3 } from "gl-matrix";
import { Application } from "../../gl";
import { OrbitControl } from "../../gl/orbit_control";
import { ClipPlaneLayer } from "./clip_plane_layer";

export class ClipPlaneDemo extends Application {
  private control: OrbitControl;
  constructor(container: HTMLDivElement) {
    super(container);

    const fov = Math.PI * 60 / 180;
    const aspect = this.window.width / this.window.height;
    const near = 0.1;
    const far = 1000;
    const target = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);

    this.control = new OrbitControl(this.window.canvas, target, up, 4, Math.PI / 3, Math.PI / 8);
    this.control
      .setViewMatrix()
      .setProjectMatrix(fov, aspect, near, far);

    this.layers.push(new ClipPlaneLayer(this.gl, this.window, this.control));
  }

}