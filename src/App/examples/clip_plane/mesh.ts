export class Mesh {
  private size = 0;
  private vao: WebGLVertexArrayObject = 0;

  constructor(private gl: WebGL2RenderingContext, vertices: number[], indices: number[]) {
    this.size = indices.length;

    // init
    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    const vbo = this.gl.createBuffer();
    const ibo = this.gl.createBuffer();
    // bind
    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    // pass data to buffer
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    // bind buffer to variable in gpu
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 24, 0);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 24, 12);
    // enable varialbe
    this.gl.enableVertexAttribArray(0);
    this.gl.enableVertexAttribArray(1);
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