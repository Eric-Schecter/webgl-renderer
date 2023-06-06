import { vec3 } from "gl-matrix";

export class BoundingBox {
  private m_min = vec3.fromValues(Infinity, Infinity, Infinity);
  private m_max = vec3.fromValues(-Infinity, -Infinity, -Infinity);
  private m_corners: vec3[] = [];
  private m_center = vec3.create();

  public setFromArray = (positions: number[]) => {
    for (let i = 0; i < positions.length; i++) {
      const pos = vec3.fromValues(positions[i], positions[i + 1], positions[i + 2]);
      if (Number.isNaN(pos[0]) || Number.isNaN(pos[1]) || Number.isNaN(pos[2])) {
        continue;
      }
      vec3.min(this.m_min, this.m_min, pos);
      vec3.max(this.m_max, this.m_max, pos);
    }

    this.m_corners.push(vec3.fromValues(this.m_min[0], this.m_max[1], this.m_max[2]));
    this.m_corners.push(vec3.fromValues(this.m_max[0], this.m_max[1], this.m_max[2]));
    this.m_corners.push(vec3.fromValues(this.m_min[0], this.m_min[1], this.m_max[2]));
    this.m_corners.push(vec3.fromValues(this.m_max[0], this.m_min[1], this.m_max[2]));
    this.m_corners.push(vec3.fromValues(this.m_min[0], this.m_max[1], this.m_min[2]));
    this.m_corners.push(vec3.fromValues(this.m_max[0], this.m_max[1], this.m_min[2]));
    this.m_corners.push(vec3.fromValues(this.m_min[0], this.m_min[1], this.m_min[2]));
    this.m_corners.push(vec3.fromValues(this.m_max[0], this.m_min[1], this.m_min[2]));

    this.m_center = vec3.fromValues(
      (this.m_min[0] + this.m_max[0]) / 2,
      (this.m_min[1] + this.m_max[1]) / 2,
      (this.m_min[2] + this.m_max[2]) / 2,
    );
  }

  public get min() {
    return this.m_min;
  }
  public get max() {
    return this.m_max;
  }
  public get corners() {
    return this.m_corners;
  }
  public get center() {
    return this.m_center;
  }
}
