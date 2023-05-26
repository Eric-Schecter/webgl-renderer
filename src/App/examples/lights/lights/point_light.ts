import { mat4, vec3, vec4 } from "gl-matrix";
import { Layer } from "../../../gl";
import { Object3D } from "../../../gl/object3D";

export class PointLight extends Object3D {
	constructor(
		public color: vec4,
		public pos: vec3,
		public intensity: number,
		public constant = 1,
		public linear = 0.09,
		public quadratic = 0.032,
	) {
		super();
		mat4.translate(this.modelMatrix, mat4.create(), pos);
	}
	public update = (layers: Layer[]) => {
		this.rotateByAxis(vec3.fromValues(0, 1, 0));
		this.pos = mat4.getTranslation(vec3.create(), this.modelMatrix);
	}
};