import { Disposable } from "../events";
import { ColorTexture, DepthTexture } from "../texture";
import { RenderPass } from "./renderpass";

export class ColorDepthRenderPass extends RenderPass implements Disposable {
  private colorTexture: ColorTexture;
  private depthTexture: DepthTexture;
  constructor(gl: WebGL2RenderingContext, protected m_width: number, protected m_height: number) {
    super(gl);
    this.colorTexture = new ColorTexture(this.gl);
    this.depthTexture = new DepthTexture(this.gl);

    this.bind();

    this.colorTexture.bind();
    this.colorTexture.resize(m_width, m_height, this.gl.RGBA8, this.gl.RGBA, this.gl.UNSIGNED_BYTE);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.colorTexture.id, 0);

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
    this.colorTexture.dispose();
    this.depthTexture.dispose();
  }
  public bindForReadColor = (id = 0) => {
    this.colorTexture.bind(id);
  }
  public bindForReadDepth = (id = 0) => {
    this.depthTexture.bind(id);
  }
  public clear = () => { // todo: need to modify to bind then clear
    this.colorTexture.clear();
    this.depthTexture.clear();
  }
  public copyToScreen = (width: number, height: number) => {
    this.gl.viewport(0, 0, width, height);
    this.bindForReadColor();
    this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null);
    this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, this.fbo);
    this.gl.blitFramebuffer(0, 0, this.m_width, this.m_height, 0, 0, width, height, this.gl.COLOR_BUFFER_BIT, this.gl.LINEAR);
    this.unbind();
  }
}