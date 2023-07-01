import { AbstractMesh, BoundingBox } from "../../../gl";

export class Mesh extends AbstractMesh {
  public boundingBox = new BoundingBox();
  private posVbo: WebGLBuffer;
  private normalVbo?: WebGLBuffer;
  private ibo: WebGLBuffer;
  constructor(gl: WebGL2RenderingContext, positions: number[], indices: number[], normals?: number[]) {
    super(gl);

    this.size = indices.length;

    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.gl.bindVertexArray(this.vao);

    this.posVbo = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(0);

    if(normals){
      this.normalVbo = this.gl.createBuffer() as WebGLBuffer;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalVbo);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 12, 0);
      this.gl.enableVertexAttribArray(1);
    }

    this.ibo = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);

    this.boundingBox.setFromArray(positions);
  }

  public render() {
    this.gl.drawElements(this.gl.TRIANGLES, this.size, this.gl.UNSIGNED_SHORT, 0);
    return this;
  }

  public dispose(): void {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.posVbo);
    this.normalVbo && this.gl.deleteBuffer(this.normalVbo);
    this.gl.deleteBuffer(this.ibo);
  }
}