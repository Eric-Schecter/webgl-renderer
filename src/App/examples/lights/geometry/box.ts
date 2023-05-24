import { vec3 } from "gl-matrix";

export class BoxGeometry {
  public vertices: number[] = [];
  public indices: number[] = [];
  public normals: number[] = [];
  public uvs: number[] = [];
  private numberOfVertices = 0;
  constructor(width: number, height: number, depth: number, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
    this.buildPlane(2, 1, 0, - 1, - 1, depth, height, width, depthSegments, heightSegments); // px
    this.buildPlane(2, 1, 0, 1, - 1, depth, height, - width, depthSegments, heightSegments); // nx
    this.buildPlane(0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments); // py
    this.buildPlane(0, 2, 1, 1, - 1, width, depth, - height, widthSegments, depthSegments); // ny
    this.buildPlane(0, 1, 2, 1, - 1, width, height, depth, widthSegments, heightSegments); // pz
    this.buildPlane(0, 1, 2, - 1, - 1, width, height, - depth, widthSegments, heightSegments); // nz
  }

  private buildPlane = (u: number, v: number, w: number, udir: number, vdir: number, width: number, height: number, depth: number, gridX: number, gridY: number) => {

    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;

    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const depthHalf = depth / 2;

    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    let vertexCounter = 0;

    const vector = vec3.create();

    // generate vertices, normals and uvs

    for (let iy = 0; iy < gridY1; iy++) {

      const y = iy * segmentHeight - heightHalf;

      for (let ix = 0; ix < gridX1; ix++) {

        const x = ix * segmentWidth - widthHalf;

        // set values to correct vector component

        vector[u] = x * udir;
        vector[v] = y * vdir;
        vector[w] = depthHalf;


        this.vertices.push(vector[0], vector[1], vector[2]);

        vector[u] = 0;
        vector[v] = 0;
        vector[w] = depth > 0 ? 1 : - 1;

        this.normals.push(vector[0], vector[1], vector[2]);

        this.uvs.push(ix / gridX);
        this.uvs.push(1 - (iy / gridY));

        vertexCounter++;

      }
    }

    for (let iy = 0; iy < gridY; iy++) {

      for (let ix = 0; ix < gridX; ix++) {

        const a = this.numberOfVertices + ix + gridX1 * iy;
        const b = this.numberOfVertices + ix + gridX1 * (iy + 1);
        const c = this.numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
        const d = this.numberOfVertices + (ix + 1) + gridX1 * iy;

        this.indices.push(a, b, d);
        this.indices.push(b, c, d);

      }

    }

    this.numberOfVertices += vertexCounter;
  }
}