import { Disposable } from "./events";
import { throwErrorIfInvalid } from "./utils";

export class RenderPass implements Disposable {
  private fbo: WebGLFramebuffer = 0;
  private colorTexture;
  private depthTexture;
  constructor(private gl: WebGL2RenderingContext, width: number, height: number) {
    this.fbo = throwErrorIfInvalid(this.gl.createFramebuffer());
    this.colorTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
    this.resize(width, height, this.gl.RGBA, this.gl.RGBA, this.gl.FLOAT);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.colorTexture, 0);

    this.depthTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
    this.resize(width, height, this.gl.RGBA, this.gl.RGBA, this.gl.FLOAT);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.colorTexture, 0);

    if (!this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER)) {
      console.log("create framebuffer failed");
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, 0);
  }
  public dispose = () => {
    this.gl.deleteFramebuffer(this.fbo);
    this.gl.deleteTexture(this.colorTexture);
    this.gl.deleteTexture(this.depthTexture);
  }
  public resize = (width: number, height: number, internalformat: number, format: number, type: number) => {
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalformat, width, height, 0, format, type, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  }
  public bind = () => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
  }
  public unbind = () => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, 0);
  }
}