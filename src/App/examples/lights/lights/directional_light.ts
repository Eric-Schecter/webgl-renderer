import { mat4, vec3, vec4 } from "gl-matrix";
import { DepthRenderPass, Layer, OrthographicCamera } from "../../../gl";
import { Object3D } from "../../../gl/object3D";
import { ProjectionShadowPipeline } from "../pipelines";
import { ProjectionShadowShader } from "../shaders";
import { ProjectionShadowMapFS, ProjectionShadowMapVS } from "../shader_source";

export class DirectionalLight extends Object3D {
	public shadowmap?: DepthRenderPass;
	private camera: OrthographicCamera;
	private pipeline?: ProjectionShadowPipeline;
	private target = vec3.fromValues(0, 0, 0);

	constructor(
		public color: vec4,
		public direction: vec3,
		public intensity: number,
	) {
		super();
		this.camera = new OrthographicCamera();
		const pos = vec3.subtract(vec3.create(), this.target, this.direction);
		mat4.translate(this.modelMatrix, mat4.create(), pos);
	}

	public update = (layers: Layer[]) => {
		this.rotateByAxis(vec3.fromValues(0, 1, 0));
		const pos = mat4.getTranslation(vec3.create(), this.modelMatrix);
		this.direction = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), this.target, pos));


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