import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { OutlinePipeline } from "../pipelines/outline_pipeline";

export class OutlineLayer extends Layer {
  public mesh?: Mesh;
  private outlinePipeline: OutlinePipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const shader = new ModelShader(this.gl, ModelVS, ModelFS);
    this.outlinePipeline = new OutlinePipeline(gl).setShader(shader);
  }

  public update() {
    if (!this.mesh) {
      return;
    }

    const modelMatrix = mat4.create();

    this.outlinePipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control, 0, false, modelMatrix)
      .render()
      .update(this.control, 1, false, mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.01, 1.01, 1.01)))
      .render()
      .unbind();
  }
}