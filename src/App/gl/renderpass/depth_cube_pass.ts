import { Disposable } from "../events";
import { CubeTexture } from "../texture";
import { RenderPass } from "./renderpass";
// todo: texture manager to dispose
export class DepthCubeRenderPass extends RenderPass implements Disposable {
  private depthTexture: CubeTexture;
  constructor(gl: WebGL2RenderingContext, protected m_width: number, protected m_height: number) {
    super(gl);
    this.depthTexture = new CubeTexture(this.gl);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);

    this.depthTexture.bind();
    this.depthTexture.resize(m_width, m_height, this.gl.DEPTH_COMPONENT32F, this.gl.DEPTH_COMPONENT, this.gl.FLOAT);

    for (let i = 0; i < 6; i++) {
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.depthTexture.id, 0);
    }

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.log("create framebuffer failed: " + status.toString());
    }

    this.unbind();
  }
  public bind = (index: number) => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, this.depthTexture.id, 0);
    this.gl.viewport(0, 0, this.m_width, this.m_height);
    return this;
  }
  public dispose = () => {
    this.gl.deleteFramebuffer(this.fbo);
    this.depthTexture.dispose();
  }
  public bindForRead = (id = 0, i = 0) => {
    this.depthTexture.bind(id);
    return this;
  }
  public clear = () => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    for (let i = 0; i < 6; i++) {
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.depthTexture.id, 0);
      this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    }
    return this;
  }
  public clone = () => {
    throw new Error('not implemented');
  }
}