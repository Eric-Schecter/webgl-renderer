import { mat4 } from "gl-matrix";
import { ColorDepthRenderPass, OrbitControl, Pipeline, WGLWindow } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelShader } from "../shaders";

export class OutlinePipeline extends Pipeline {
  protected shader?: ModelShader;
  protected mesh?: Mesh;
  protected renderpass?: ColorDepthRenderPass | undefined;
  constructor(private gl: WebGL2RenderingContext) {
    super();
  }
  public setStencilMask = () => {
    // write mesh info for mask
    // set 0xff as mask value
    this.gl.stencilFunc(this.gl.ALWAYS, 1, 0xFF);
    this.gl.stencilMask(0xFF); // allow write value, keep value that inputs
    return this;
  }
  public compareStencilMask = () => {
    // compare with mask value
    this.gl.stencilFunc(this.gl.NOTEQUAL, 1, 0xFF);
    this.gl.stencilMask(0x00); // not allow write, abandon value that inputs
    this.gl.disable(this.gl.DEPTH_TEST);
    return this;
  }
  public bind = (window: WGLWindow) => {
    const { width, height } = window;
    this.gl.viewport(0, 0, width, height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.STENCIL_TEST);
    // stencil test -> depth test
    this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.REPLACE);
    this.renderpass?.bind();
    return this;
  }
  public clear = () => {
    if (this.renderpass) {
      this.renderpass.clear();
    } else {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
    }
    return this;
  }
  public update = (control: OrbitControl, alpha = 1, isWireframe = false, modelMatrix: mat4) => {
    if (!this.shader || !this.mesh) {
      return this;
    }

    this.shader
      .bind()
      .updateProjectMatrix(control.projectMatrix)
      .updateViewMatrix(control.viewMatrix)
      .updateModelMatrix(modelMatrix)
      .updateAlpha(alpha);

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
    this.renderpass?.unbind();
    this.gl.disable(this.gl.BLEND);
  }
}
