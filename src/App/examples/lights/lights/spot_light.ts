import { mat4, vec3, vec4 } from "gl-matrix";
import { DepthRenderPass, Layer } from "../../../gl";
import { Object3D } from "../../../gl/object3D";

export class SpotLight extends Object3D {
	public shadowmap?: DepthRenderPass;
	constructor(
		public color: vec4,
		public pos: vec3,
		public direction: vec3,
		public cutOff: number,
		public outerCutOff: number,
		public intensity: number,
	) {
		super();
		mat4.translate(this.modelMatrix, mat4.create(), pos);
	}

	public update = (layers: Layer[]) => {

	}

	public setupShadowMap = (gl: WebGL2RenderingContext, size = 1024) => {
		this.shadowmap = new DepthRenderPass(gl, size, size);
	}
};