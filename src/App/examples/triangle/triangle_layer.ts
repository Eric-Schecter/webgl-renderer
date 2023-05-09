import { Layer, Shader } from "../../gl";
import { Mesh } from "./mesh";
import vs from './shader/triangle.vs';
import fs from './shader/triangle.fs';

export class TriangleLayer extends Layer {
  private mesh: Mesh;
  private shader: Shader;
  constructor(private gl: WebGL2RenderingContext) {
    super();

    const vertices = [
      -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
      0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
      0.0, 0.5, 0.0, 0.0, 0.0, 1.0
    ];
    const indices = [
      0, 1, 2
    ];
    this.mesh = new Mesh(this.gl, vertices, indices);

    this.shader = new Shader(this.gl, vs, fs);
  }

  public update() {
    // const { width, height } = this.window;
    // this.gl.viewport(0, 0, width, height);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.bind();

    this.mesh.bind();
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();
  }
}