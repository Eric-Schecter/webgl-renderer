import { vec2 } from "gl-matrix";
import { ScreenPlane } from "../geometry";
import { RenderPass } from "../renderpass";
import { CopyShader } from "../shaders";
import { CopyFS, CopyVS } from "../shader_source";

export class VisualizePostProcess {
  private screen: ScreenPlane;
  private copyShader: CopyShader;
  constructor(gl: WebGL2RenderingContext) {
    this.screen = new ScreenPlane(gl);
    this.copyShader = new CopyShader(gl, CopyVS, CopyFS);
  }
  public render = (renderpass: RenderPass) => {
    renderpass.bindForRead();

    const { width, height } = renderpass;

    this.copyShader
      .bind()
      .updateSize(vec2.fromValues(width, height))
      .updateTexture(0);

    this.screen.bind();
    this.screen.render();
    this.screen.unbind();

    this.copyShader.unbind();
  }
}