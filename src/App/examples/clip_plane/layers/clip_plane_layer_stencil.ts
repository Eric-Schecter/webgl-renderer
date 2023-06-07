import { mat4, vec3, vec4 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { ModelVS, ModelFS, PlaneVS, PlaneFS } from '../shader_source';
import { ModelShader, PlaneShader } from "../shaders";
import { PlaneGeometry } from "../geometry";
import { GUIHandler, OptionFolder } from "../../../gui";
import { ModelPipeline, PlanePipeline } from "../pipelines";
import { PlaneMesh, LargeMesh, HelmetMesh } from "../mesh";

export class ClipPlaneStencilLayer extends Layer {
  public mesh?: LargeMesh | HelmetMesh;
  private needRenderPlane = false;
  private pipeline: ModelPipeline;
  private planePipeline: PlanePipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, uvs } = new PlaneGeometry(3, 3, 1, 1);
    const plane = new PlaneMesh(this.gl, vertices, indices, uvs);
    const planeShader = new PlaneShader(this.gl, PlaneVS, PlaneFS);
    const modelShader = new ModelShader(this.gl, ModelVS, ModelFS);

    this.pipeline = new ModelPipeline(gl).setShader(modelShader);
    this.planePipeline = new PlanePipeline(gl).setMesh(plane).setShader(planeShader);

    const folder = GUIHandler.getInstance().createFolder('mode', OptionFolder);
    folder.addItem('render plane', () => this.needRenderPlane = !this.needRenderPlane, this.needRenderPlane);
  }

  public render(time: number) {
    if (!this.mesh) {
      return;
    }

    // const scale = 1;
    const scale = 1 / 5000;
    const tranlateMatrix = mat4.translate(
      mat4.create(),
      mat4.create(),
      vec3.scale(
        vec3.create(),
        this.mesh.boundingBox.center,
        -1,
      )
    );
    const scaleMatrix = mat4.scale(
      mat4.create(),
      mat4.create(),
      vec3.fromValues(scale, scale, scale)
    );
    const rotateMatrix = mat4.rotate(
      mat4.create(),
      mat4.create(),
      time,
      vec3.fromValues(0, 1, 0)
    )
    const modelMatrix = mat4.multiply(mat4.create(), rotateMatrix, mat4.multiply(mat4.create(), scaleMatrix, tranlateMatrix));

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
      // render model

      const a = 0;
      const b = 0;
      const c = 1;
      const d = 0;
      const plane = vec4.fromValues(a, b, c, d);

      this.pipeline
        .setMesh(this.mesh)
        .bind(this.window)
        .clear()
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane, plane)
        .render()
        .unbind();

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