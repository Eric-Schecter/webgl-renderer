import { vec3 } from "gl-matrix";

export class BoundingBox {
  private m_min = vec3.fromValues(Infinity, Infinity, Infinity);
  private m_max = vec3.fromValues(-Infinity, -Infinity, -Infinity);

  public setFromArray = (positions: number[]) => {
    for (let i = 0; i < positions.length; i++) {
      const pos = vec3.fromValues(positions[i], positions[i + 1], positions[i + 2]);
      vec3.min(this.m_min, this.m_min, pos);
      vec3.max(this.m_max, this.m_max, pos);
    }
  }

  public get min() {
    return this.m_min;
  }
  public get max() {
    return this.m_max;
  }
}
