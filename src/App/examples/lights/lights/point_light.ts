import { vec3, vec4 } from "gl-matrix";

export class PointLight {
	constructor(
		public color: vec4,
		public pos: vec3,
		public intensity: number,
		public constant = 1,
		public linear = 0.09,
		public quadratic = 0.032,
	) { }
};