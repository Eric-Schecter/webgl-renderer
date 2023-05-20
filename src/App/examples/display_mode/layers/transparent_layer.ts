import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { vec3 } from 'gl-matrix';
import { Mesh } from "../mesh";
import { ModelVS, ModelFS, ModelColorFS } from '../shader_source';
import { ModelShader, ModelColorShader } from "../shaders";
import { ModelColorPipeline, ModelPipeline } from "../pipelines";

export class TransparentLayer extends Layer {
  public mesh?: Mesh;
  private pipeline: ModelPipeline;
  private colorPipeline: ModelColorPipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const shader = new ModelShader(this.gl, ModelVS, ModelFS);
    const colorShader = new ModelColorShader(this.gl, ModelVS, ModelColorFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
    this.colorPipeline = new ModelColorPipeline(gl).setShader(colorShader);
  }

  public update() {
    if (!this.mesh) {
      return;
    }

    const black = vec3.fromValues(0, 0, 0);

    this.colorPipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control, black, true)
      .render()
      .unbind();

    this.pipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .update(this.control, 0.5)
      .render()
      .unbind();
  }
}