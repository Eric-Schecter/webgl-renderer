import { mat4, vec3, vec4 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, OrthographicCamera, ColorDepthRenderPass } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS, PlaneVS, PlaneFS, ProjectVS, ProjectFS } from '../shader_source';
import { ModelShader, PlaneShader, ProjectShader } from "../shaders";
import { PlaneGeometry } from "../plane";
import { GUIHandler, OptionFolder } from "../../../gui";
import { ModelPipeline, ProjectPipeline, PlanePipeline } from "../pipelines";
// import { BoxGeometry } from "../../lights/geometry";

export class ClipPlaneStencilLayer extends Layer {
  public mesh?: Mesh
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
    const plane = new Mesh(this.gl, vertices, indices, uvs);
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

    const modelMatrix = mat4.create();

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

      // this.pipeline
      //   .setMesh(this.mesh)
      //   .bind(this.window)
      //   .clear()
      //   .update(this.camera.projectMatrix, this.camera.viewMatrix, this.needRenderPlane, plane)
      //   .render()
      //   .unbind();

      // render opaque objects
      // render model
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      // this.gl.colorMask(true, true, true, true);
      this.gl.colorMask(false, false, false, false);
      this.gl.depthMask(true);
      this.gl.enable(this.gl.STENCIL_TEST);
      this.gl.stencilFunc(this.gl.ALWAYS, 1, 0xFF);
      this.gl.stencilMask(0xFF); // allow write value, keep value that inputs
      this.gl.stencilOp(this.gl.INCR_WRAP, this.gl.INCR_WRAP, this.gl.INCR_WRAP);
      this.pipeline
        .setMesh(this.mesh)
        .clear()
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane, plane)
        .render()
      // .unbind();

      this.gl.cullFace(this.gl.FRONT);
      // this.gl.colorMask(true, true, true, true);
      this.gl.colorMask(false, false, false, false);
      this.gl.depthMask(false);
      this.gl.stencilOp(this.gl.DECR_WRAP, this.gl.DECR_WRAP, this.gl.DECR_WRAP);
      this.pipeline
        // .update(this.control.projectMatrix, this.control.viewMatrix, this.needRenderPlane, plane)
        .render()
        .unbind();

      // // refer to https://www.cuemath.com/geometry/distance-between-point-and-plane/
      // const { pos } = this.camera;
      // const nearestDepth = Math.abs(a * pos[0] + b * pos[1] + c * pos[2]) / Math.sqrt(a ** 2 + b ** 2 + c ** 2);

      // this.projectPipeline
      //   .bind(this.window)
      //   .update(this.control.projectMatrix, this.control.viewMatrix, nearestDepth, this.renderpass)
      //   .render()
      //   .unbind()

      // // render transparent objects
      // // render plane

      this.gl.disable(this.gl.CULL_FACE);
      this.gl.colorMask(true, true, true, true);
      this.gl.depthMask(true);
      this.gl.stencilFunc(this.gl.NOTEQUAL, 0, 0xFF);
      this.gl.stencilOp(this.gl.ZERO, this.gl.ZERO, this.gl.ZERO);
      this.planePipeline
        .bind(this.window)
        .update(this.control.projectMatrix, this.control.viewMatrix, vec3.fromValues(1, 0, 0))
        .render()
        .unbind()

      this.gl.disable(this.gl.STENCIL_TEST);
      // this.planePipeline
      //   .bind(this.window)
      //   .update(this.control.projectMatrix, this.control.viewMatrix, vec3.fromValues(1, 1, 1))
      //   .render()
      //   .unbind()
    }
  }
}