import { Layer, Shader, WGLWindow } from "../../gl";
import { Mesh } from "./mesh";
import { TriangleVS, TriangleFS } from './shader_source'

export class TriangleLayer extends Layer {
  public mesh: Mesh;
  private shader: Shader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow) {
    super(window);

    const vertices = [
      -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
      0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
      0.0, 0.5, 0.0, 0.0, 0.0, 1.0
    ];
    const indices = [
      0, 1, 2
    ];
    this.mesh = new Mesh(this.gl, vertices, indices);

    this.shader = new Shader(this.gl, TriangleVS, TriangleFS);
  }

  public render() {
    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.bind();

    this.mesh
      .bind()
      .render()
      .unbind();

    this.shader.unbind();
  }
}