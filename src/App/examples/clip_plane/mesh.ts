export class Mesh {
  private size = 0;
  private vao: WebGLVertexArrayObject = 0;

  constructor(private gl: WebGL2RenderingContext, positions: number[], indices: number[]) {
    this.size = indices.length;

    // init
    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    const vbo = this.gl.createBuffer();
    const ibo = this.gl.createBuffer();
    // bind
    this.gl.bindVertexArray(this.vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);
  }

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