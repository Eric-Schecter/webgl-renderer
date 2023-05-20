import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { ModelPipeline } from "../pipelines";

export class WireframeLayer extends Layer {
  public mesh?: Mesh;
  private pipeline: ModelPipeline;
  constructor(gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const shader = new ModelShader(gl, ModelVS, ModelFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
  }

  public update() {
    if (!this.mesh) {
      return;
    }

    this.pipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control, 1, true)
      .render()
      .unbind();
  }
}