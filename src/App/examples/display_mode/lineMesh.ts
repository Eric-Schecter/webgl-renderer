import { vec3 } from "gl-matrix";
import { AbstractMesh, BoundingBox } from "../../gl";

export class LineMesh extends AbstractMesh {
  public boundingBox = new BoundingBox();
  private posVbo: WebGLBuffer;
  private normalVbo: WebGLBuffer;
  private lineDistVbo: WebGLBuffer;
  private edges = new Set();
  constructor(gl: WebGL2RenderingContext, positions: number[], indices: number[], normals: number[]) {
    super(gl);

    const linePositions: number[] = [];
    const lineNormals: number[] = [];
    // https://github.com/mrdoob/three.js/blob/master/src/geometries/WireframeGeometry.js
    for (let i = 0; i < indices.length; i += 3) {
      for (let j = 0; j < 3; j++) {
        const index1 = indices[i + j] * 3;
        const index2 = indices[i + (j + 1) % 3] * 3;
        const startPos = vec3.fromValues(positions[index1], positions[index1 + 1], positions[index1 + 2]);
        const endPos = vec3.fromValues(positions[index2], positions[index2 + 1], positions[index2 + 2]);
        const startNormal = vec3.fromValues(normals[index1], normals[index1 + 1], normals[index1 + 2]);
        const endNormal = vec3.fromValues(normals[index2], normals[index2 + 1], normals[index2 + 2]);

        if (!this.isUniqueEdge(startPos, endPos)) {
          linePositions.push(startPos[0], startPos[1], startPos[2]);
          linePositions.push(endPos[0], endPos[1], endPos[2]);

          lineNormals.push(startNormal[0], startNormal[1], startNormal[2]);
          lineNormals.push(endNormal[0], endNormal[1], endNormal[2]);
        }

      }
    }

    this.size = linePositions.length / 2;

    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.gl.bindVertexArray(this.vao);

    this.posVbo = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(linePositions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(0);

    this.normalVbo = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalVbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(lineNormals), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 12, 0);
    this.gl.enableVertexAttribArray(1);

    this.lineDistVbo = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lineDistVbo);

    const lineDist: number[] = [];
    for (let i = 0; i < linePositions.length; i += 6) {
      const x1 = linePositions[i / 6];
      const y1 = linePositions[i / 6 + 1];
      const z1 = linePositions[i / 6 + 2];

      const x2 = linePositions[i / 6 + 3];
      const y2 = linePositions[i / 6 + 4];
      const z2 = linePositions[i / 6 + 5];

      const dx = x2 - x1;
      const dy = y2 - y1;
      const dz = z2 - z1;

      const dist = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

      const index = i / 3;
      lineDist[index] = (index === 0) ? 0 : lineDist[index - 1];
      lineDist[index + 1] = lineDist[index] + dist;
    }

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(lineDist), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(2, 1, this.gl.FLOAT, false, 4, 0);
    this.gl.enableVertexAttribArray(2);

    // reset
    this.gl.bindVertexArray(null);

    this.boundingBox.setFromArray(positions);
  }

  public render() {
    this.gl.drawArrays(this.gl.LINES, 0, this.size);
    return this;
  }

  public dispose(): void {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.posVbo);
    this.gl.deleteBuffer(this.normalVbo);
    this.gl.deleteBuffer(this.lineDistVbo);
  }

  private isUniqueEdge(start: vec3, end: vec3) {

    const hash1 = `${start[0]},${start[1]},${start[2]}-${end[0]},${end[1]},${end[2]}`;
    const hash2 = `${end[0]},${end[1]},${end[2]}-${start[0]},${start[1]},${start[2]}`; // coincident edge

    if (this.edges.has(hash1) === true || this.edges.has(hash2) === true) {

      return false;

    } else {

      this.edges.add(hash1);
      this.edges.add(hash2);
      return true;

    }

  }
}