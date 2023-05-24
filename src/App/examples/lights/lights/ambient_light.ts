import { vec4 } from "gl-matrix";

export class AmbientLight {
  constructor(
    public color: vec4,
    public intensity: number,
  ) { }
}