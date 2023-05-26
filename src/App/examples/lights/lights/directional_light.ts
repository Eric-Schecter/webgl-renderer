import { vec3, vec4 } from "gl-matrix";
import { DepthRenderPass, Layer } from "../../../gl";

export class DirectionalLight {
	public shadowmap?: DepthRenderPass;
	constructor(
		gl: WebGL2RenderingContext,
		public color: vec4,
		public direction: vec3,
		public intensity: number,
	) { }
	
	public update = (layers: Layer[]) => {
		// layers.forEach(layer=>{
		// 	layer.
		// })
	}

	public setupShadowMap = (gl: WebGL2RenderingContext, size = 1024) => {
		this.shadowmap = new DepthRenderPass(gl, size, size);
	}
};