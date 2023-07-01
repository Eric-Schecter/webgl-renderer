import { Disposable } from "../events";
import { Texture } from "../texture";
import { RenderPass } from "./renderpass";

// todo: need to support resize
export class ColorDepthStencilRenderPass extends RenderPass implements Disposable {
  private colorTexture: Texture;
  private depthStencilTexture: Texture;
  constructor(protected gl: WebGL2RenderingContext, protected m_width: number, protected m_height: number) {
    super(gl);
    this.colorTexture = new Texture(this.gl);
    this.depthStencilTexture = new Texture(this.gl);

    this.bind();

    this.colorTexture.bind();
    this.colorTexture.resize(m_width, m_height, this.gl.RGBA8, this.gl.RGBA, this.gl.UNSIGNED_BYTE);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.colorTexture.id, 0);

    this.depthStencilTexture.bind();
    this.depthStencilTexture.resize(m_width, m_height, this.gl.DEPTH24_STENCIL8, this.gl.DEPTH_STENCIL, this.gl.UNSIGNED_INT_24_8);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.TEXTURE_2D, this.depthStencilTexture.id, 0);

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.log("create framebuffer failed: " + status.toString());
    }

    this.unbind();
  }
  public dispose = () => {
    this.gl.deleteFramebuffer(this.fbo);
  }
  public bindForRead = (id = 0, type = this.gl.COLOR_BUFFER_BIT) => {
    if (type === this.gl.COLOR_BUFFER_BIT) {
      this.colorTexture.bind(id);
    } else if (type === this.gl.DEPTH_BUFFER_BIT) {
      this.depthStencilTexture.bind(id);
    }
    return this;
  }
  public clear = () => { // todo: need to modify to bind then clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
    return this;
  }
  public copyToScreen = (width: number, height: number) => {
    this.gl.viewport(0, 0, width, height);
    this.bindForRead();
    this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null);
    this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, this.fbo);
    this.gl.blitFramebuffer(0, 0, this.m_width, this.m_height, 0, 0, width, height, this.gl.COLOR_BUFFER_BIT, this.gl.LINEAR);
    this.unbind();
    return this;
  }
  public clone = () => {
    const colorTexture = this.colorTexture.clone();
    const depthStencilTexture = this.depthStencilTexture.clone();
    const renderpass = new ColorDepthStencilRenderPass(this.gl, this.m_width, this.m_height);
    renderpass.colorTexture.dispose();
    renderpass.depthStencilTexture.dispose();
    renderpass.colorTexture = colorTexture;
    renderpass.depthStencilTexture = depthStencilTexture;
    return renderpass;
  }
}