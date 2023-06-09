import { mat4, vec3, vec4 } from "gl-matrix";
import { DepthRenderPass, Layer, PerspectiveCamera } from "../../../gl";
import { Object3D } from '../../../gl/object3D';
import { ProjectionShadowPipeline } from "../pipelines";
import { ProjectionShadowShader } from "../shaders";
import { ProjectionShadowMapFS, ProjectionShadowMapVS } from "../shader_source";

export class SpotLight extends Object3D {
	public shadowmap?: DepthRenderPass;
	private camera: PerspectiveCamera;
	private pipeline?: ProjectionShadowPipeline;

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
		this.camera = new PerspectiveCamera();
	}

	public update = (layers: Layer[]) => {
		this.rotateByAxis(vec3.fromValues(0, 1, 0));
		this.pos = mat4.getTranslation(vec3.create(), this.modelMatrix);

		const pipeline = this.pipeline;
		if (!pipeline || !this.shadowmap) {
			return;
		}

		this.camera.pos = this.pos;
		this.direction = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), vec3.fromValues(0, 0, 0), this.pos));
		const target = vec3.add(vec3.create(), this.pos, this.direction);
		this.camera.up = vec3.fromValues(0, 0, 1);
		this.camera.setViewMatrix(target);
		const fov = 45 / 180 * Math.PI;
		const { width, height } = this.shadowmap;
		const near = 0.1;
		const far = 1000;
		this.camera.setProjection(fov, width / height, near, far);

		pipeline
			.setRenderPass(this.shadowmap)
			.bind(width, height)
			.clear();

		const { projectMatrix, viewMatrix } = this.camera;

		layers.forEach(layer => {
			if (layer.mesh) {
				pipeline
					.setMesh(layer.mesh)
					.update(projectMatrix, viewMatrix, (layer as any).modelMatrix)
					.render()
			}
		})

		pipeline.unbind();
	}

	public setupShadowMap = (gl: WebGL2RenderingContext, size = 1024) => {
		this.shadowmap = new DepthRenderPass(gl, size, size);
		const shader = new ProjectionShadowShader(gl, ProjectionShadowMapVS, ProjectionShadowMapFS);
		this.pipeline = new ProjectionShadowPipeline(gl).setShader(shader);
	}

	public get viewMatrix() {
		return this.camera.viewMatrix;
	}

	public get projMatrix() {
		return this.camera.projectMatrix;
	}
};