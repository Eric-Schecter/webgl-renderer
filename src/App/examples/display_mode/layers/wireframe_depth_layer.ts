import { vec3 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, DepthRenderPass } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelDepthVS, ModelDepthFS, ModelDepthWireframeFS, CopyVS, DepthFS } from '../shader_source';
import { ScreenPlane } from "../screen_plane";
import { DepthShader } from "../shaders";
import { ModelDepthShader, ModelDepthWireframeShader } from "../shaders";
import { WireframePipeline } from "../pipelines";
import { RenderPipeline } from "../pipelines/render_pipeline";
import { ModelDepthPipeline } from "../pipelines/model_depth_pipeline";

export class WireframeDepthLayer extends Layer {
  public mesh?: Mesh;
  private renderpass: DepthRenderPass;
  private renderpassSurface: DepthRenderPass;
  private pipeline: ModelDepthPipeline;
  private wireframePipeline: WireframePipeline;
  private renderPipeline: RenderPipeline;
  constructor(gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const { width, height } = window;
    this.renderpass = new DepthRenderPass(gl, width, height);
    this.renderpassSurface = new DepthRenderPass(gl, width, height);

    const shader = new ModelDepthShader(gl, ModelDepthVS, ModelDepthFS);
    this.pipeline = new ModelDepthPipeline(gl).setShader(shader);

    const wireframeShader = new ModelDepthWireframeShader(gl, ModelDepthVS, ModelDepthWireframeFS);
    this.wireframePipeline = new WireframePipeline(gl).setShader(wireframeShader);

    const plane = new ScreenPlane(gl);
    const depthShader = new DepthShader(gl, CopyVS, DepthFS);
    this.renderPipeline = new RenderPipeline(gl).setMesh(plane).setShader(depthShader);

  }

  public render() {
    if (!this.mesh) {
      return;
    }
    const { disMin, disMax } = this.getRenderRange(this.mesh);
    this.updateCamera(disMin, disMax);

    // render mesh to get surface depth
    this.pipeline
      .setMesh(this.mesh)
      .setRenderPass(this.renderpassSurface)
      .bind(this.window)
      .clear()
      .update(this.control)
      .render()
      .unbind();

    // render mesh
    this.wireframePipeline
      .setMesh(this.mesh)
      .setRenderPass(this.renderpass)
      .bind(this.window)
      .clear()
      .update(this.control, this.window, this.renderpassSurface, true)
      .render()
      .unbind();

    // render buffer
    this.renderPipeline
      .bind(this.window)
      .clear()
      .update(this.window, this.renderpass, disMin, disMax)
      .render()
      .unbind();

  }

  private getRenderRange = (mesh: Mesh) => {
    const { corners } = mesh.boundingBox;
    const { pos } = this.control.camera;
    let disMin = Infinity;
    let disMax = -Infinity;
    corners.forEach(corner => {
      disMin = Math.min(disMin, vec3.distance(corner, pos));
      disMax = Math.max(disMax, vec3.distance(corner, pos));
    })
    return { disMin, disMax };
  }

  private updateCamera = (disMin: number, disMax: number) => {
    const { camera } = this.control;
    const offset = 0.5; // todo: find another method to handle
    camera.near = disMin - offset;
    camera.far = disMax;
    camera.update();
  }
}