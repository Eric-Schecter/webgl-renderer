import { mat4, vec3, vec4 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, OrthographicCamera, ColorDepthRenderPass } from "../../../gl";
import { PlaneMesh } from "../plane_mesh";
import { ModelVS, ModelFS, PlaneVS, PlaneFS, ProjectVS, ProjectFS } from '../shader_source';
import { ModelShader, PlaneShader, ProjectShader } from "../shaders";
import { PlaneGeometry } from "../plane";
import { GUIHandler, OptionFolder } from "../../../gui";
import { ModelPipeline, ProjectPipeline, PlanePipeline } from "../pipelines";
import { Mesh } from "../mesh";
// import { BoxGeometry } from "../../lights/geometry";

export class ClipPlaneLayer extends Layer {
  public mesh?: Mesh;
  private needRenderPlane = false;
  private camera: OrthographicCamera;
  private renderpass: ColorDepthRenderPass;
  private pipeline: ModelPipeline;
  private projectPipeline: ProjectPipeline;
  private planePipeline: PlanePipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, uvs } = new PlaneGeometry(3, 3, 1, 1);
    const { width, height } = window;
    const plane = new PlaneMesh(this.gl, vertices, indices, uvs);
    const planeShader = new PlaneShader(this.gl, PlaneVS, PlaneFS);
    const modelShader = new ModelShader(this.gl, ModelVS, ModelFS);
    const projectShader = new ProjectShader(this.gl, ProjectVS, ProjectFS);
    this.camera = new OrthographicCamera();
    this.renderpass = new ColorDepthRenderPass(gl, width, height);

    this.pipeline = new ModelPipeline(gl).setShader(modelShader);
    this.projectPipeline = new ProjectPipeline(gl).setMesh(plane).setShader(projectShader);
    this.planePipeline = new PlanePipeline(gl).setMesh(plane).setShader(planeShader);

    const folder = GUIHandler.getInstance().createFolder('mode', OptionFolder);
    folder.addItem('render plane', () => this.needRenderPlane = !this.needRenderPlane, this.needRenderPlane);

    // const { vertices: v, indices: i, uvs: u } = new BoxGeometry(0.5, 0.5, 0.5);
    // this.mesh = new Mesh(this.gl, v, i, u);
  }

  public render(time: number) {
    if (!this.mesh) {
      return;
    }

    const scale = 5;
    const modelMatrix = mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(scale, scale, scale));

    if (!this.needRenderPlane) {
      // render opaque objects
      // render model
      this.pipeline
        .setMesh(this.mesh)
        .bind(this.window)
        .clear()
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane)
        .render()
        .unbind();
    } else {
      // set camere
      const focus = vec3.create();
      this.camera.pos = vec3.fromValues(0, 0, 1);
      this.camera.setViewMatrix(focus).setProjection(3, 3, 1, 0.01, 10);

      // render model

      const a = 0;
      const b = 0;
      const c = 1;
      const d = 0;
      const plane = vec4.fromValues(a, b, c, d);

      this.pipeline
        .setMesh(this.mesh)
        .setRenderPass(this.renderpass)
        .bind(this.window)
        .clear()
        .update(this.camera.projectMatrix, this.camera.viewMatrix, modelMatrix, this.needRenderPlane, plane)
        .render()
        .unbind();

      // render opaque objects
      // render model
      this.pipeline
        .setRenderPass()
        .clear()
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane, plane)
        .render()
        .unbind();

      // refer to https://www.cuemath.com/geometry/distance-between-point-and-plane/
      const { pos } = this.camera;
      const nearestDepth = Math.abs(a * pos[0] + b * pos[1] + c * pos[2]) / Math.sqrt(a ** 2 + b ** 2 + c ** 2);

      this.projectPipeline
        .bind(this.window)
        .update(this.control.projectMatrix, this.control.viewMatrix, nearestDepth, this.renderpass)
        .render()
        .unbind()

      // render transparent objects
      // render plane
      this.planePipeline
        .bind(this.window)
        .update(this.control.projectMatrix, this.control.viewMatrix, vec3.fromValues(1, 1, 1))
        .render()
        .unbind()
    }
  }
}