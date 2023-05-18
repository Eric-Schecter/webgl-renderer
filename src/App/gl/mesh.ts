export abstract class AbstractMesh {
  protected size = 0;
  protected vao: WebGLVertexArrayObject = 0;

  constructor(protected gl: WebGL2RenderingContext) { }

  public bind() {
    this.gl.bindVertexArray(this.vao)
  }

  public unbind() {
    this.gl.bindVertexArray(null);
  }

  public render() {
    this.gl.drawElements(this.gl.TRIANGLES, this.size, this.gl.UNSIGNED_SHORT, 0);
  }
}