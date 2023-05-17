import { Disposable } from "./events";
import { throwErrorIfInvalid } from "./utils";

export abstract class RenderPass {
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
  }
  public unbind = () => {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
}

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

export class ColorRenderPass extends RenderPass implements Disposable {
  private colorTexture;
  constructor(gl: WebGL2RenderingContext, width: number, height: number) {
    super(gl);
    this.bind();

    this.colorTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
    this.resize(width, height, this.gl.RGBA8, this.gl.RGBA, this.gl.UNSIGNED_BYTE);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.colorTexture, 0);

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.log("create framebuffer failed: " + status.toString());
    }

    this.unbind();
  }
  public dispose = () => {
    this.gl.deleteFramebuffer(this.fbo);
    this.gl.deleteTexture(this.colorTexture);
  }
  public bindForRead = (id = 0) => {
    this.gl.activeTexture(this.gl.TEXTURE0 + id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
  }
  public clear = () => {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  }
}

export class ColorDepthRenderPass extends RenderPass implements Disposable {
  private colorTexture;
  private depthTexture;
  constructor(gl: WebGL2RenderingContext, width: number, height: number) {
    super(gl);
    this.bind();

    this.colorTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
    this.resize(width, height, this.gl.RGBA8, this.gl.RGBA, this.gl.UNSIGNED_BYTE);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.colorTexture, 0);

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
    this.gl.deleteTexture(this.colorTexture);
    this.gl.deleteTexture(this.depthTexture);
  }
  public bindForReadColor = (id = 0) => {
    this.gl.activeTexture(this.gl.TEXTURE0 + id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
  }
  public bindForReadDepth = (id = 0) => {
    this.gl.activeTexture(this.gl.TEXTURE0 + id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
  }
  public clear = () => {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}