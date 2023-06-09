import { Disposable } from "../events";
import { Texture } from "../texture";
import { RenderPass } from "./renderpass";
// todo: texture manager to dispose
export class DepthRenderPass extends RenderPass implements Disposable {
  private depthTexture: Texture;
  constructor(gl: WebGL2RenderingContext, protected m_width: number, protected m_height: number, depthTexture?: Texture) {
    super(gl);
    this.depthTexture = depthTexture || new Texture(this.gl);

    this.bind();

    this.depthTexture.bind();
    this.depthTexture.resize(m_width, m_height, this.gl.DEPTH_COMPONENT32F, this.gl.DEPTH_COMPONENT, this.gl.FLOAT);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.id, 0);

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.log("create framebuffer failed: " + status.toString());
    }

    this.unbind();
  }
  public dispose = () => {
    this.gl.deleteFramebuffer(this.fbo);
    this.depthTexture.dispose();
  }
  public bindForRead = (id = 0) => {
    this.depthTexture.bind(id);
    return this;
  }
  public clear = () => {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    return this;
  }
  public clone = () => {
    const depthTexture = this.depthTexture.clone();
    return new DepthRenderPass(this.gl, this.m_width, this.m_height, depthTexture);
  }
}