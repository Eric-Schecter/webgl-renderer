import { vec2 } from "gl-matrix";
import { ColorDepthRenderPass, DepthRenderPass, Pipeline, WGLWindow } from "../../../gl";
import { Mesh } from "../mesh";
import { DepthShader } from "../shaders";

export class RenderPipeline extends Pipeline {
  protected shader?: DepthShader;
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
  public update = (window: WGLWindow, renderpass: DepthRenderPass, disMin: number, disMax: number) => {
    if (!this.shader || !this.mesh) {
      return this;
    }

    const { width, height } = window;
    renderpass.bindForRead();

    this.shader
      .bind()
      .updateTexture()
      .updateSize(vec2.fromValues(width, height))
      .updateMinDepth(disMin)
      .updateMaxDepth(disMax);

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
