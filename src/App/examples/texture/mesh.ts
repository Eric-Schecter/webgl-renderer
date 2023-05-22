import { AbstractMesh, BoundingBox } from "../../gl";

export class Mesh extends AbstractMesh {
  public boundingBox = new BoundingBox();
  private wireframe = false;

  constructor(gl: WebGL2RenderingContext, positions: number[], indices: number[], normals: number[], uvs: number[], tangents: number[], bitangents: number[]) {
    super(gl);

    this.size = indices.length;

    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.gl.bindVertexArray(this.vao);

    const posVbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(0);

    const normalVbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(1);

    const uvVbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, false, 8, 0);
    this.gl.enableVertexAttribArray(2);

    const tangentsVbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tangentsVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tangents), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(3, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(3);

    const bitangentsVbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bitangentsVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(bitangents), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(4, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(4);

    const ibo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);

    this.boundingBox.setFromArray(positions);
  }

  public render() {
    this.gl.drawElements(this.wireframe ? this.gl.LINES : this.gl.TRIANGLES, this.size, this.gl.UNSIGNED_SHORT, 0);
    return this;
  }

  public setWireframe(value: boolean): Mesh {
    this.wireframe = value;
    return this;
  }
}