import { vec3, vec4 } from "gl-matrix";

export class DirectionalLight {
	constructor(
		public color: vec4,
		public direction: vec3,
		public intensity: number,
	) { }
};