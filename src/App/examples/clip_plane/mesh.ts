import { AbstractMesh } from "../../gl";

export class Mesh extends AbstractMesh {
  constructor(gl: WebGL2RenderingContext, positions: Uint16Array, normals: Int8Array, indices: Uint32Array) {
    super(gl);
    this.size = indices.length;

    // init
    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    const vbo = this.gl.createBuffer();
    const vboNormal = this.gl.createBuffer();
    const ibo = this.gl.createBuffer();
    // bind
    this.gl.bindVertexArray(this.vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.UNSIGNED_SHORT, true, 4 * 2, 0);
    this.gl.enableVertexAttribArray(0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vboNormal);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, normals, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(1, 3, this.gl.BYTE, true, 4, 0);
    this.gl.enableVertexAttribArray(1);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);
  }

  public render() {
    this.gl.drawElements(this.gl.TRIANGLES, this.size, this.gl.UNSIGNED_INT, 0);
    return this;
  }
}