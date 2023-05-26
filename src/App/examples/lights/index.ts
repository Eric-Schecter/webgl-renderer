import { vec3, vec4 } from "gl-matrix";
import { Application, OrbitControl } from "../../gl";
import { BoxLayer, PlaneLayer } from "./layers";
import { SphereLayer } from "./layers/sphere_layer";
import { AmbientLight, DirectionalLight, SpotLight, Lights, PointLight } from "./lights";

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

    const lights = new Lights();
    lights.ambientLights.push(new AmbientLight(vec4.fromValues(1, 1, 1, 1), 0.1));
    lights.directionalLighs.push(new DirectionalLight(vec4.fromValues(0.5, 0.5, 1, 1), vec3.fromValues(-1, -1, -1), 0.2));

    const targetSpotLight = vec3.fromValues(0, 0, 0);
    const posSpotLight = vec3.fromValues(0, 10, 0);
    const dirSpotLight = vec3.normalize(vec3.create(), (vec3.subtract(vec3.create(), targetSpotLight, posSpotLight)));
    lights.spotLights.push(
      new SpotLight(
        vec4.fromValues(1, 1, 1, 1),
        posSpotLight,
        dirSpotLight,
        Math.cos(12.5 / 180 * Math.PI),
        Math.cos(17.5 / 180 * Math.PI),
        0.5,
      ));

    const pointLightPos = vec3.fromValues(1, 1, 1);
    lights.pointLights.push(
      new PointLight(
        vec4.fromValues(0.5, 1, 1, 1),
        pointLightPos,
        1,
      )
    )

    const planeLayer = new PlaneLayer(this.gl, this.window, this.control);
    const boxLayer = new BoxLayer(this.gl, this.window, this.control);
    const pointLightLayer = new SphereLayer(this.gl, this.window, this.control, pointLightPos);

    planeLayer.lights = lights;
    boxLayer.lights = lights;

    this.layers.push(planeLayer, boxLayer, pointLightLayer);
  }

}