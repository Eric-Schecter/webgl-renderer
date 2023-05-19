import { AbstractMesh } from "../../gl/mesh";
import { BoundingBox } from "./bounding_box";

export class Mesh extends AbstractMesh {
  public boundingBox = new BoundingBox();
  public wireframe = false;

  constructor(gl: WebGL2RenderingContext, positions: number[], indices: number[], normals?: number[]) {
    super(gl);

    this.size = indices.length;

    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.gl.bindVertexArray(this.vao);

    const posVbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(0);

    if(normals){
      const normalVbo = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalVbo);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 12, 0);
      this.gl.enableVertexAttribArray(1);
    }

    const ibo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    // reset
    this.gl.bindVertexArray(null);

    this.boundingBox.setFromArray(positions);
  }

  public render() {
    this.gl.drawElements(this.wireframe ? this.gl.LINES : this.gl.TRIANGLES, this.size, this.gl.UNSIGNED_SHORT, 0);
  }
}