import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { ModelPipeline } from '../pipelines';
import { LineMesh } from "../lineMesh";

export class SurfaceWireframeLayer extends Layer {
  public mesh?: Mesh;
  public lineMesh?: LineMesh;
  private pipeline: ModelPipeline;
  constructor(gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const shader = new ModelShader(gl, ModelVS, ModelFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
  }

  public render() {
    if (!this.mesh || !this.lineMesh) {
      return;
    }
    this.pipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control)
      .disableColorMask()
      .render()
      .setMesh(this.lineMesh)
      .update(this.control, 1)
      .enableColorMask()
      .render()
      .unbind();
  }
}