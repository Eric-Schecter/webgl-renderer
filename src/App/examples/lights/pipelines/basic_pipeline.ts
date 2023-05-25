import { mat4, vec3 } from "gl-matrix";
import { ColorDepthRenderPass, Pipeline, WGLWindow } from "../../../gl";
import { Mesh } from "../mesh";
import { BasicShader } from "../shaders";

export class BasicPipeline extends Pipeline {
  protected shader?: BasicShader;
  protected mesh?: Mesh;
  protected renderpass?: ColorDepthRenderPass | undefined;
  constructor(private gl: WebGL2RenderingContext) {
    super();
  }
  public bind = (window: WGLWindow) => {
    const { width, height } = window;
    this.gl.viewport(0, 0, width, height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0, 0, 0, 1);
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
  public update = (projectMatrix: mat4, viewMatrix: mat4, modelMatrix: mat4, color: vec3) => {
    if (!this.shader || !this.mesh) {
      return this;
    }

    this.shader
      .bind()
      .updateProjectMatrix(projectMatrix)
      .updateViewMatrix(viewMatrix)
      .updateModelMatrix(modelMatrix)
      .updateColor(color);

    this.mesh.bind()

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
  }
}
