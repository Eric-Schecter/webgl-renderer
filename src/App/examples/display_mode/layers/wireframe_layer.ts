import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { ModelPipeline } from "../pipelines";
import { LineMesh } from "../lineMesh";

export class WireframeLayer extends Layer {
  public mesh?: LineMesh;
  private pipeline: ModelPipeline;
  constructor(gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const shader = new ModelShader(gl, ModelVS, ModelFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
  }

  public render() {
    if (!this.mesh) {
      return;
    }

    this.pipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control, 1)
      .render()
      .unbind();
  }
}