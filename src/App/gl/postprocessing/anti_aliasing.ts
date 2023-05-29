import { vec2 } from "gl-matrix";
import { ScreenPlane } from "../geometry";
import { ColorRenderPass } from "../renderpass";
import { SSAAShader } from "../shaders";
import { SSAAFS, CopyVS } from "../shader_source";

export class AntiAliasingPostProcess {
  private screen: ScreenPlane;
  private ssaaShader: SSAAShader;
  constructor(gl: WebGL2RenderingContext) {
    this.screen = new ScreenPlane(gl);
    this.ssaaShader = new SSAAShader(gl, CopyVS, SSAAFS);
  }
  public render = (renderpass: ColorRenderPass) => {
    renderpass.bindForRead();

    const { width, height } = renderpass;

    this.ssaaShader
      .bind()
      .updateSize(vec2.fromValues(width, height))
      .updateTexture(0)
      .updateSSLevel(4);

    this.screen.bind();
    this.screen.render();
    this.screen.unbind();

    this.ssaaShader.unbind();
  }
}