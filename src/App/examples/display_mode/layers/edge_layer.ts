import { Layer, WGLWindow, OrbitControl, ColorDepthRenderPass } from "../../../gl";
import { CopyVS, EdgeFS, ModelVS, ModelFS } from '../shader_source';
import { ModelShader, SobelShader } from "../shaders";
import { ScreenPlane } from "../screen_plane";
import { Mesh } from "../mesh";
import { ModelPipeline } from "../pipelines";
import { EdgePipeline } from "../pipelines/edge_pipeline";

export class EdgeLayer extends Layer {
  public mesh?: Mesh;
  private renderpass: ColorDepthRenderPass;
  private pipeline: ModelPipeline;
  private edgePipeline: EdgePipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const { width, height } = window;
    this.renderpass = new ColorDepthRenderPass(this.gl, width, height);

    const plane = new ScreenPlane(this.gl);
    const edgeShader = new SobelShader(this.gl, CopyVS, EdgeFS);
    this.edgePipeline = new EdgePipeline(gl)
      .setShader(edgeShader)
      .setMesh(plane);

    const shader = new ModelShader(this.gl, ModelVS, ModelFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
  }

  public update() {
    if (!this.mesh) {
      return;
    }

    this.pipeline
      .setMesh(this.mesh)
      .setRenderPass(this.renderpass)
      .bind(this.window)
      .clear()
      .update(this.control)
      .render()
      .unbind()

    this.edgePipeline
      .bind(this.window)
      .clear()
      .update(this.window, this.renderpass)
      .render()
      .unbind();
  }
}