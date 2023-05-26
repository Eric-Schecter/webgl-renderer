import { vec3, vec4 } from "gl-matrix";
import { DepthRenderPass, Layer } from "../../../gl";

export class DirectionalLight {
	public shadowmap: DepthRenderPass;
	constructor(
		gl: WebGL2RenderingContext,
		public color: vec4,
		public direction: vec3,
		public intensity: number,
	) {
		this.shadowmap = new DepthRenderPass(gl, 1024, 1024);
	}
	public update = (layers: Layer[]) => {
		// layers.forEach(layer=>{
		// 	layer.
		// })
	}
};