import { mat4, vec3 } from "gl-matrix";
import { OrbitControl, Pipeline, WGLWindow } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelColorShader } from "../shaders";

export class ModelColorPipeline extends Pipeline {
  protected shader?: ModelColorShader;
  protected mesh?: Mesh;
  constructor(private gl: WebGL2RenderingContext) {
    super();
  }
  public disableColorMask = () => {
    this.gl.colorMask(false, false, false, false);
    return this;
  }
  public enableColorMask = () => {
    this.gl.colorMask(true, true, true, true);
    return this;
  }
  public bind = (window: WGLWindow) => {
    const { width, height } = window;
    this.gl.viewport(0, 0, width, height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0, 0, 0, 1);

    return this;
  }
  public clear = () => {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    return this;
  }
  public update = (control: OrbitControl, color: vec3, isWireframe = false) => {
    if (!this.shader || !this.mesh) {
      return this;
    }

    this.shader
      .bind()
      .updateProjectMatrix(control.projectMatrix)
      .updateViewMatrix(control.viewMatrix)
      .updateModelMatrix(mat4.create())
      .updateColor(color);

    this.mesh
      .bind()
      .setWireframe(isWireframe);

    return this;
  }
  public render = () => {
    this.mesh?.render();
    return this;
  }
  public unbind = () => {
    this.mesh?.unbind();
    this.shader?.unbind();
  }
}
