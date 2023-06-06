import { AbstractMesh } from "../../gl";

export class Mesh extends AbstractMesh {
  private vbo: WebGLBuffer;
  private vboNormal: WebGLBuffer;
  private ibo: WebGLBuffer;
  constructor(gl: WebGL2RenderingContext, positions: Uint16Array, normals: Int8Array, indices: Uint32Array) {
    super(gl);
    this.size = indices.length;

    // init
    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.vbo = this.gl.createBuffer() as WebGLBuffer;
    this.vboNormal = this.gl.createBuffer() as WebGLBuffer;
    this.ibo = this.gl.createBuffer() as WebGLBuffer;
    // bind
    this.gl.bindVertexArray(this.vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.UNSIGNED_SHORT, true, 4 * 2, 0);
    this.gl.enableVertexAttribArray(0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vboNormal);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, normals, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(1, 3, this.gl.BYTE, true, 4, 0);
    this.gl.enableVertexAttribArray(1);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);
  }

  public render() {
    this.gl.drawElements(this.gl.TRIANGLES, this.size, this.gl.UNSIGNED_INT, 0);
    return this;
  }

  public dispose() {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.vbo);
    this.gl.deleteBuffer(this.vboNormal);
    this.gl.deleteBuffer(this.ibo);
  }
}