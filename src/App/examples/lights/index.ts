import { vec3, vec4 } from "gl-matrix";
import { Application, OrbitControl } from "../../gl";
import { BoxLayer, PlaneLayer, SphereLayer } from "./layers";
import { AmbientLight, DirectionalLight, SpotLight, PointLight } from "./lights";

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

    this.setupLights();
    this.setupLayers();
  }

  private setupLights = () => {
    this.lights.ambientLights.push(new AmbientLight(vec4.fromValues(1, 1, 1, 1), 0.1));
    this.lights.directionalLighs.push(new DirectionalLight(this.gl, vec4.fromValues(0.5, 0.5, 1, 1), vec3.fromValues(-1, -1, -1), 0.2));

    const targetSpotLight = vec3.fromValues(0, 0, 0);
    const posSpotLight = vec3.fromValues(0, 10, 0);
    const dirSpotLight = vec3.normalize(vec3.create(), (vec3.subtract(vec3.create(), targetSpotLight, posSpotLight)));
    this.lights.spotLights.push(
      new SpotLight(
        vec4.fromValues(1, 1, 1, 1),
        posSpotLight,
        dirSpotLight,
        Math.cos(12.5 / 180 * Math.PI),
        Math.cos(17.5 / 180 * Math.PI),
        0.5,
      ));

    this.lights.pointLights.push(
      new PointLight(
        vec4.fromValues(1, 1, 0, 1),
        vec3.fromValues(1, 1, 1),
        1,
      )
    )
  }

  private setupLayers = () => {
    const planeLayer = new PlaneLayer(this.gl, this.window, this.control);
    const boxLayer = new BoxLayer(this.gl, this.window, this.control);
    const pointLightLayer = new SphereLayer(this.gl, this.window, this.control, this.lights.pointLights[0]);

    planeLayer.lights = this.lights;
    boxLayer.lights = this.lights;

    this.layers.push(planeLayer, boxLayer, pointLightLayer);
  }
}