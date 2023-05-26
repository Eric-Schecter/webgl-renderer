import { Layer, WGLWindow, OrbitControl, PBRTextures } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { ModelPipeline } from "../pipelines";

export class ModelLayer extends Layer {
  public mesh?: Mesh;
  private pipeline: ModelPipeline;
  public pbrTextures: PBRTextures = {};
  constructor(gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const shader = new ModelShader(gl, ModelVS, ModelFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader)
  }

  public render() {
    if (!this.mesh) {
      return;
    }

    this.pipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control, this.pbrTextures)
      .render()
      .unbind();
  }
}