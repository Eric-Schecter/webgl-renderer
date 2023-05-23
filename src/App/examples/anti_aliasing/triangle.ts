import { Mesh } from "./mesh";

export class Triangle extends Mesh {
  constructor(gl: WebGL2RenderingContext) {
    const vertices = [
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.0, 0.5, 0.0,
    ];
    const indices = [
      0, 1, 2
    ];
    super(gl, vertices, indices);
  }
}