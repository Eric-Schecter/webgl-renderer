export abstract class AbstractMesh {
  protected size = 0;
  protected vao: WebGLVertexArrayObject = 0;

  constructor(protected gl: WebGL2RenderingContext) { }

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
}