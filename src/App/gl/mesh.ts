import { Object3D } from "./object3D";

export abstract class AbstractMesh extends Object3D {
  protected size = 0;
  protected vao: WebGLVertexArrayObject = 0;

  constructor(protected gl: WebGL2RenderingContext) {
    super();
  }

  public bind() {
    this.gl.bindVertexArray(this.vao);
    return this;
  }

  public render() {
    this.gl.drawElements(this.gl.TRIANGLES, this.size, this.gl.UNSIGNED_SHORT, 0);
    return this;
  }

  public unbind() {
    this.gl.bindVertexArray(null);
  }

  public abstract dispose(): void;
}