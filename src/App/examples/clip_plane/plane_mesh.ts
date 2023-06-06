import { AbstractMesh } from "../../gl";

export class PlaneMesh extends AbstractMesh {
  constructor(gl: WebGL2RenderingContext, positions: number[], indices: number[], uvs: number[]) {
    super(gl);
    this.size = indices.length;

    // init
    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    const vbo = this.gl.createBuffer();
    const ibo = this.gl.createBuffer();
    // bind
    this.gl.bindVertexArray(this.vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, true, 12, 0);
    this.gl.enableVertexAttribArray(0);

    const vboUV = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vboUV);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 8, 0);
    this.gl.enableVertexAttribArray(1);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);
  }
}