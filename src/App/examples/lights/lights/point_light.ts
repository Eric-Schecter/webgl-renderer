import { mat4, vec3, vec4 } from "gl-matrix";
import { DepthCubeRenderPass, Layer, PerspectiveCamera } from "../../../gl";
import { Object3D } from "../../../gl/object3D";
import { ProjectionPointShadowPipeline } from "../pipelines";
import { ProjectionPointShadowShader } from "../shaders";
import { ProjectionPointShadowMapFS, ProjectionPointShadowMapVS } from "../shader_source";

export class PointLight extends Object3D {
	public shadowmap?: DepthCubeRenderPass;
	private camera: PerspectiveCamera;
	private pipeline?: ProjectionPointShadowPipeline;
	private directions = [
		{ dir: vec3.fromValues(1, 0, 0), up: vec3.fromValues(0, -1, 0) },
		{ dir: vec3.fromValues(-1, 0, 0), up: vec3.fromValues(0, -1, 0) },
		{ dir: vec3.fromValues(0, 1, 0), up: vec3.fromValues(0, 0, -1) },
		{ dir: vec3.fromValues(0, -1, 0), up: vec3.fromValues(0, 0, -1) },
		{ dir: vec3.fromValues(0, 0, 1), up: vec3.fromValues(0, -1, 0) },
		{ dir: vec3.fromValues(0, 0, -1), up: vec3.fromValues(0, -1, 0) }
	];

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
		const fov = 90 / 180 * Math.PI;
		const { width, height } = this.shadowmap;
		const near = 0.1;
		const far = 25;
		this.camera.setProjection(fov, width / height, near, far);

		pipeline
			.setRenderPass(this.shadowmap)
			.clear();

		layers.forEach(layer => {
			if (layer.mesh) {
				for (let i = 0; i < 6; i++) {
					const { dir, up } = this.directions[i];
					this.camera.up = up;
					const target = vec3.add(vec3.create(), this.pos, dir);
					this.camera.setViewMatrix(target);

					const { projectMatrix, viewMatrix } = this.camera;

					pipeline
						.setMesh(layer.mesh)
						.bind(width, height, i)
						.update(projectMatrix, viewMatrix, (layer as any).modelMatrix, this.pos, this.camera.far)
						.render()
				}
			}
		})

		pipeline.unbind();
		
	}

	public setupShadowMap = (gl: WebGL2RenderingContext, size = 1024) => {
		this.shadowmap = new DepthCubeRenderPass(gl, size, size);
		const shader = new ProjectionPointShadowShader(gl, ProjectionPointShadowMapVS, ProjectionPointShadowMapFS);
		this.pipeline = new ProjectionPointShadowPipeline(gl).setShader(shader);
	}

	public get viewMatrix() {
		return this.camera.viewMatrix;
	}

	public get projMatrix() {
		return this.camera.projectMatrix;
	}

	public get far() {
		return this.camera.far;
	}
};