import { ColorRenderPass, Layer, Shader, WGLWindow } from "../../../gl";
import { AntiAliasingPostProcess } from "../../../gl/postprocessing";
import { GUIHandler, RadioFolder } from "../../../gui";
import { Mesh } from "../mesh";
import { TriangleVS, TriangleFS } from '../shader_source'
import { Triangle } from "../triangle";

export class TriangleLayer extends Layer {
  private triangle: Mesh;

  private shader: Shader;

  private renderpass: ColorRenderPass;
  private antiAliasing = false;

  private aaPostProcessing: AntiAliasingPostProcess;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow) {
    super(window);
    const { width, height } = this.window;
    this.renderpass = new ColorRenderPass(gl, width, height);

    this.triangle = new Triangle(gl);

    this.shader = new Shader(this.gl, TriangleVS, TriangleFS);

    this.aaPostProcessing = new AntiAliasingPostProcess(gl);

    const folder = GUIHandler.getInstance().createFolder('anti aliasing', RadioFolder);
    folder.addItem('no anti aliasing', () => { this.antiAliasing = false }, true);
    folder.addItem('anti aliasing', () => { this.antiAliasing = true }, false);
  }

  public update() {
    if (this.antiAliasing) {
      this.renderpass.bind();
    }
    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.bind();

    this.triangle.bind();
    this.triangle.render();
    this.triangle.unbind();

    this.shader.unbind();

    if (this.antiAliasing) {
      this.renderpass.unbind();

      this.aaPostProcessing.render(this.renderpass);
    }
  }
}