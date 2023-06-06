import { AbstractMesh } from "../../gl";

export class Mesh extends AbstractMesh {
  private vbo: WebGLBuffer;
  private vboNormal: WebGLBuffer;
  private vboUV: WebGLBuffer;
  private ibo: WebGLBuffer;
  constructor(gl: WebGL2RenderingContext, positions: number[], indices: number[], normals: number[], uvs: number[]) {
    super(gl);
    this.size = indices.length;

    // init
    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.vbo = this.gl.createBuffer() as WebGLBuffer;
    this.ibo = this.gl.createBuffer() as WebGLBuffer;
    // bind
    this.gl.bindVertexArray(this.vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(0);

    this.vboNormal = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vboNormal);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(1);

    this.vboUV = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vboUV);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, false, 8, 0);
    this.gl.enableVertexAttribArray(2);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);
  }

  public dispose(): void {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.vbo);
    this.gl.deleteBuffer(this.vboNormal);
    this.gl.deleteBuffer(this.vboUV);
    this.gl.deleteBuffer(this.ibo);
  }
}