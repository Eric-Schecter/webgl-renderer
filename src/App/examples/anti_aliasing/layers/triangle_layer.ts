import { vec2 } from "gl-matrix";
import { ColorRenderPass, Layer, Shader, WGLWindow } from "../../../gl";
import { GUIHandler, RadioFolder } from "../../../gui";
import { Mesh } from "../mesh";
import { ScreenPlane } from "../screen_plane";
import { CopyShader } from "../shaders";
import { TriangleVS, TriangleFS, CopyVS, CopyFS } from '../shader_source'

export class TriangleLayer extends Layer {
  public mesh: Mesh;
  private screen: ScreenPlane;
  private shader: Shader;
  private copyShader: CopyShader;
  private renderpass: ColorRenderPass;
  private antiAliasing = false;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow) {
    super(window);
    const { width, height } = this.window;
    this.renderpass = new ColorRenderPass(gl, width, height);

    const vertices = [
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.0, 0.5, 0.0,
    ];
    const indices = [
      0, 1, 2
    ];
    this.mesh = new Mesh(this.gl, vertices, indices);

    this.screen = new ScreenPlane(gl);

    this.shader = new Shader(this.gl, TriangleVS, TriangleFS);
    this.copyShader = new CopyShader(this.gl, CopyVS, CopyFS);

    const folder = GUIHandler.getInstance().createFolder('anti aliasing', RadioFolder);
    folder.addItem('no anti aliasing', () => { this.antiAliasing = false }, true);
    folder.addItem('anti aliasing', () => { this.antiAliasing = true }, false);
  }

  public update() {
    if (this.antiAliasing) {
      this.renderpass.bind();

      const { width, height } = this.window;
      this.gl.viewport(0, 0, width, height);

      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.shader.bind();

      this.mesh.bind();
      this.mesh.render();
      this.mesh.unbind();

      this.shader.unbind();

      this.renderpass.unbind();

      this.renderpass.bindForRead();

      this.copyShader
        .bind()
        .updateSize(vec2.fromValues(width, height))
        .updateTexture(0)
        .updateSSLevel(4);

      this.screen.bind();
      this.screen.render();
      this.screen.unbind();

      this.copyShader.unbind();
    } else {
      const { width, height } = this.window;
      this.gl.viewport(0, 0, width, height);

      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.shader.bind();

      this.mesh.bind();
      this.mesh.render();
      this.mesh.unbind();

      this.shader.unbind();
    }
  }
}