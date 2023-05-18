import { Disposable } from "../events";
import { RenderPass } from "./renderpass";

export class DepthRenderPass extends RenderPass implements Disposable {
  private depthTexture;
  constructor(gl: WebGL2RenderingContext, width: number, height: number) {
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
}