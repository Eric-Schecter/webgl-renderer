import { vec2 } from "gl-matrix";
import { ColorDepthStencilRenderPass, Pipeline, WGLWindow } from "../../../gl";
import { ScreenPlane } from "../mesh";
import { SobelShader } from "../shaders";

export class EdgePipeline extends Pipeline {
  protected shader?: SobelShader;
  protected mesh?: ScreenPlane;
  protected renderpass?: ColorDepthStencilRenderPass;
  private hCoef = [
    1.0, 0.0, -1.0,
    2.0, 0.0, -2.0,
    1.0, 0.0, -1.0
  ];
  private vCoef = [
    1.0, 2.0, 1.0,
    0.0, 0.0, 0.0,
    -1.0, -2.0, -1.0
  ];
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
  public update = ( renderpass: ColorDepthStencilRenderPass) => {
    if (!this.shader || !this.mesh) {
      return this;
    }

    const { width, height } = renderpass;
    renderpass.bindForRead();

    this.shader.bind()
      .updateTexture()
      .updateSize(vec2.fromValues(width, height))
      .updateHCoef(this.hCoef)
      .updateVCoef(this.vCoef);

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
