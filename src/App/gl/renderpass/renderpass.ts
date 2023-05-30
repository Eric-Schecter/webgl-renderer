import { throwErrorIfInvalid } from "../utils";

// todo: set viewport to framebuffer size when use render pass
export abstract class RenderPass {
  protected m_width = 0;
  protected m_height = 0;
  protected fbo: WebGLFramebuffer;
  constructor(protected gl: WebGL2RenderingContext) {
    this.fbo = throwErrorIfInvalid(this.gl.createFramebuffer());
  }
  public bind = (...args: any) => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    this.gl.viewport(0, 0, this.m_width, this.m_height);
    return this;
  }
  public unbind = () => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    return this;
  }
  public abstract bindForRead: () => this;
  public get width() {
    return this.m_width;
  }
  public get height() {
    return this.m_height;
  }
}