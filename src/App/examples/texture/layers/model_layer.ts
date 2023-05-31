import { Layer, WGLWindow, OrbitControl, PBRTextures, ColorDepthRenderPass, AntiAliasingPostProcess } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { ModelPipeline } from "../pipelines";

export class ModelLayer extends Layer {
  public mesh?: Mesh;
  private pipeline: ModelPipeline;
  public pbrTextures: PBRTextures = {};
  private renderpass: ColorDepthRenderPass;
  private pp: AntiAliasingPostProcess;
  constructor(gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { width, height } = window;
    const shader = new ModelShader(gl, ModelVS, ModelFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
    this.renderpass = new ColorDepthRenderPass(gl, width, height);
    this.pp = new AntiAliasingPostProcess(gl);
  }

  public render() {
    if (!this.mesh) {
      return;
    }

    this.pipeline
      // .setRenderPass(this.renderpass)
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control, this.pbrTextures)
      .render()
      .unbind();

    // this.pp.render(this.renderpass);
  }
}