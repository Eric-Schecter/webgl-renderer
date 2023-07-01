import { mat4, vec3, vec4 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, ColorDepthStencilRenderPass } from "../../../gl";
import { ModelVS, ModelFS, PatternVS, PatternFS, CopyVS, CopyFS, EdgeFS, ColorVS, ColorFS } from '../shader_source';
import { CopyShader, ModelShader, PlaneShader, SobelShader } from "../shaders";
import { PlaneGeometry } from "../geometry";
import { GUIHandler, OptionFolder } from "../../../gui";
import { CopyPipeline, EdgePipeline, ModelPipeline, PlanePipeline } from "../pipelines";
import { PlaneMesh, LargeMesh, HelmetMesh, ScreenPlane } from "../mesh";

export class ClipPlaneStencilLayer extends Layer {
  public mesh?: LargeMesh | HelmetMesh;
  private needRenderPlane = false;
  private pipeline: ModelPipeline;
  private planePipeline: PlanePipeline;
  private edgePipeline: EdgePipeline;
  private colorPipeline: PlanePipeline;
  private copyPipeline: CopyPipeline;
  private renderpassForPattern: ColorDepthStencilRenderPass;
  private renderPassForBorder: ColorDepthStencilRenderPass;
  private renderpassBorder: ColorDepthStencilRenderPass;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, uvs } = new PlaneGeometry(3, 3, 1, 1);
    const plane = new PlaneMesh(this.gl, vertices, indices, uvs);
    const screenPlane = new ScreenPlane(this.gl);

    this.renderpassForPattern = new ColorDepthStencilRenderPass(this.gl, window.width, window.height);
    this.renderPassForBorder = new ColorDepthStencilRenderPass(this.gl, window.width, window.height);
    this.renderpassBorder = new ColorDepthStencilRenderPass(this.gl, window.width, window.height);

    const planeShader = new PlaneShader(this.gl, PatternVS, PatternFS);
    const modelShader = new ModelShader(this.gl, ModelVS, ModelFS);
    const colorShader = new PlaneShader(this.gl, ColorVS, ColorFS);
    const edgeShader = new SobelShader(this.gl, CopyVS, EdgeFS);
    const copyShader = new CopyShader(this.gl, CopyVS, CopyFS);

    this.pipeline = new ModelPipeline(gl).setShader(modelShader);
    this.planePipeline = new PlanePipeline(gl).setMesh(plane).setShader(planeShader);
    this.colorPipeline = new PlanePipeline(gl).setMesh(plane).setShader(colorShader);
    this.edgePipeline = new EdgePipeline(gl).setMesh(screenPlane).setShader(edgeShader);
    this.copyPipeline = new CopyPipeline(gl).setMesh(screenPlane).setShader(copyShader);

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
        .setRenderPass(undefined)
        .bind(this.window)
        .clear()
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane)
        .render()
        .unbind();
    } else {
      // define clip plane
      const a = 0;
      const b = 0;
      const c = 1;
      const d = 0;
      const plane = vec4.fromValues(a, b, c, d);

      const renderTargets = [
        this.renderpassForPattern,
        this.renderPassForBorder,
      ]

      // render model and clip
      this.pipeline
        .setMesh(this.mesh)
        .setRenderPass(undefined)
        .bind(this.window)
        .clear()
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane, plane)
        .render()
        .unbind();

      // render front face and +1 if stencil test pass
      this.gl.enable(this.gl.STENCIL_TEST);
      this.gl.stencilFunc(this.gl.ALWAYS, 1, 0xFF);
      this.gl.stencilMask(0xFF); // allow write value, keep value that inputs

      this.pipeline.setMesh(this.mesh);

      renderTargets.forEach(renderTarget => {
        this.pipeline
          .setRenderPass(renderTarget)
          .bind(this.window)
          .clear();
      })

      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      this.gl.depthMask(true);
      this.gl.stencilOp(this.gl.INCR_WRAP, this.gl.INCR_WRAP, this.gl.INCR_WRAP);
      this.gl.colorMask(false, false, false, false);

      renderTargets.forEach(renderTarget => {
        this.pipeline
          .setRenderPass(renderTarget)
          .bind(this.window)
          .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane, plane)
          .render();
      })

      // render back face and -1 if stencil test pass
      this.gl.cullFace(this.gl.FRONT);
      this.gl.colorMask(false, false, false, false);
      this.gl.depthMask(false);
      this.gl.stencilOp(this.gl.DECR_WRAP, this.gl.DECR_WRAP, this.gl.DECR_WRAP);
      renderTargets.forEach(renderTarget => {
        this.pipeline
          .setRenderPass(renderTarget)
          .bind(this.window)
          .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, this.needRenderPlane, plane)
          .render();
      })

      this.pipeline.unbind();

      // render cliped pattern when stencil not equal to 0
      // render to renderpass
      const modelMatrixPlane = mat4.create();

      this.gl.disable(this.gl.CULL_FACE);
      this.gl.colorMask(true, true, true, true);
      this.gl.depthMask(true);
      this.gl.stencilFunc(this.gl.NOTEQUAL, 0, 0xFF);
      this.gl.stencilOp(this.gl.ZERO, this.gl.ZERO, this.gl.ZERO);

      // generate color area for border detection
      this.colorPipeline
        .bind(this.window)
        .setRenderPass(this.renderPassForBorder)
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrixPlane, vec3.fromValues(0, 0, 1))
        .render()
        .unbind();

      // generate parttern
      this.planePipeline
        .bind(this.window)
        .setRenderPass(this.renderpassForPattern)
        .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrixPlane, vec3.fromValues(1, 1, 1))
        .render()
        .unbind();

      this.gl.disable(this.gl.STENCIL_TEST);

      // add edge
      this.edgePipeline
        .bind(this.window)
        .setRenderPass(this.renderpassBorder)
        .clear()
        .update(this.renderPassForBorder)
        .render()
        .unbind();

      // add pattern 
      this.copyPipeline
        .bind(this.window)
        .update(this.renderpassForPattern, this.renderpassBorder)
        .render()
        .unbind();
    }
  }
}