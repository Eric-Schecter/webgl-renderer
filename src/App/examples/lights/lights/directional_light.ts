import { vec3, vec4 } from "gl-matrix";
import { DepthRenderPass, Layer, OrthographicCamera, VisualizePostProcess } from "../../../gl";
import { ProjectionShadowPipeline } from "../pipelines";
import { ProjectionShadowShader } from "../shaders";
import { ProjectionShadowMapFS, ProjectionShadowMapVS } from "../shader_source";

export class DirectionalLight {
	public shadowmap?: DepthRenderPass;
	private camera: OrthographicCamera;
	private pipeline?: ProjectionShadowPipeline;
	private pp?: VisualizePostProcess;

	constructor(
		public color: vec4,
		public direction: vec3,
		public intensity: number,
	) {
		this.camera = new OrthographicCamera();
	}

	public update = (layers: Layer[]) => {
		const pipeline = this.pipeline;
		if (!pipeline || !this.shadowmap) {
			return;
		}

		this.camera.pos = vec3.fromValues(0, 0, 0);
		this.camera.up = vec3.fromValues(0, 0, 1);
		this.camera.setViewMatrix(this.direction);
		const { width, height } = this.shadowmap;
		const near = -100;
		const far = 100;
		const size = 10;
		const aspect = 1;
		this.camera.setProjection(size, size, aspect, near, far);

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

		// this.pp?.render(this.shadowmap);
	}

	public setupShadowMap = (gl: WebGL2RenderingContext, size = 1024) => {
		this.shadowmap = new DepthRenderPass(gl, size, size);
		const shader = new ProjectionShadowShader(gl, ProjectionShadowMapVS, ProjectionShadowMapFS);
		this.pipeline = new ProjectionShadowPipeline(gl).setShader(shader);

		this.pp = new VisualizePostProcess(gl);
	}

	public get viewMatrix() {
		return this.camera.viewMatrix;
	}

	public get projMatrix() {
		return this.camera.projectMatrix;
	}
};