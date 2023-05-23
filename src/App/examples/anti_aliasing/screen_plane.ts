import { Mesh } from "./mesh";

export class ScreenPlane extends Mesh {
  constructor(gl: WebGL2RenderingContext) {
    const positions = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
    const indices = [0, 2, 1, 2, 3, 1];
    super(gl, positions, indices);
  }
}