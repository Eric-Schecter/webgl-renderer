import { throwErrorIfInvalid } from "../utils";

// todo: set viewport to framebuffer size when use render pass
export abstract class RenderPass {
  protected m_width = 0;
  protected m_height = 0;
  protected fbo: WebGLFramebuffer;
  constructor(protected gl: WebGL2RenderingContext) {
    this.fbo = throwErrorIfInvalid(this.gl.createFramebuffer());
  }
  public resize = (width: number, height: number, internalformat: number, format: number, type: number) => {
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalformat, width, height, 0, format, type, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

  }
  public bind = () => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    this.gl.viewport(0, 0, this.m_width, this.m_height);
  }
  public unbind = () => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
  public get width() {
    return this.m_width;
  }
  public get height() {
    return this.m_height;
  }
}