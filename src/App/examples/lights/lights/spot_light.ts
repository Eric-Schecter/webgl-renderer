import { vec3, vec4 } from "gl-matrix";
import { Layer } from "../../../gl";
import { Object3D } from "../../../gl/object3D";

export class SpotLight extends Object3D {
	constructor(
		public color: vec4,
		public pos: vec3,
		public direction: vec3,
		public cutOff: number,
		public outerCutOff: number,
		public intensity: number,
	) {
		super();
	}

	public update = (layers: Layer[]) => {

	}
};