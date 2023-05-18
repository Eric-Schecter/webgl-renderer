import { Disposable } from "../events";
import { RenderPass } from "./renderpass";

// todo: texture manager to dispose
export class DepthRenderPass extends RenderPass implements Disposable {
  private depthTexture;
  constructor(gl: WebGL2RenderingContext, protected width: number, protected height: number) {
    super(gl);
    this.bind();

    this.depthTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
    this.resize(width, height, this.gl.DEPTH_COMPONENT32F, this.gl.DEPTH_COMPONENT, this.gl.FLOAT);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture, 0);

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.log("create framebuffer failed: " + status.toString());
    }

    this.unbind();
  }
  public dispose = () => {
    this.gl.deleteFramebuffer(this.fbo);
    this.gl.deleteTexture(this.depthTexture);
  }
  public bindForRead = (id = 0) => {
    this.gl.activeTexture(this.gl.TEXTURE0 + id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
  }
  public clear = () => {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  }
  public copyToScreen = (width: number, height: number) => {
    // this.bindForRead();
    // this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null);
    // this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, this.fbo);
    // this.gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, width, height, this.gl.DEPTH_BUFFER_BIT, this.gl.NEAREST);
    // this.unbind();
  }
}