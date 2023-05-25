import { vec3, vec4 } from "gl-matrix";

export class SpotLight {
	constructor(
		public color: vec4,
		public pos: vec3,
		public direction: vec3,
		public cutOff: number,
		public outerCutOff: number,
		public intensity: number,
	) { }
};