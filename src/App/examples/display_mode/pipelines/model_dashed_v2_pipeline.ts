import { mat4 } from "gl-matrix";
import { ColorDepthRenderPass, OrbitControl, Pipeline, WGLWindow } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelDashedV1Shader } from "../shaders";

export class ModelDashedV2Pipeline extends Pipeline {
  protected shader?: ModelDashedV1Shader;
  protected mesh?: Mesh;
  protected renderpass?: ColorDepthRenderPass;
  constructor(private gl: WebGL2RenderingContext) {
    super();
  }
  public bind = (window: WGLWindow) => {
    const { width, height } = window;
    this.gl.viewport(0, 0, width, height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.renderpass?.bind();
    return this;
  }
  public clear = () => {
    if (this.renderpass) {
      this.renderpass.clear();
    } else {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    return this;
  }
  public update = (control: OrbitControl, dashGap: number, dashSize: number, alpha = 1) => {
    if (!this.shader || !this.mesh) {
      return this;
    }

    this.shader
      .bind()
      .updateProjectMatrix(control.projectMatrix)
      .updateViewMatrix(control.viewMatrix)
      .updateModelMatrix(mat4.create())
      .updateAlpha(alpha)
      .updateDashGap(dashGap)
      .updateDashSize(dashSize);

    this.mesh
      .bind();

    return this;
  }
  public render = () => {
    this.mesh?.render();
    return this;
  }
  public unbind = () => {
    this.mesh?.unbind();
    this.shader?.unbind();
    this.renderpass?.unbind();
    this.gl.disable(this.gl.BLEND);
  }
}
