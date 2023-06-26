import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { OutlinePipeline } from "../pipelines/outline_pipeline";

export class OutlineLayer extends Layer {
  public mesh?: Mesh;
  private outlinePipeline: OutlinePipeline;
  private modelMatrix: mat4;
  private modelMatrixScaled: mat4;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const shader = new ModelShader(this.gl, ModelVS, ModelFS);
    this.outlinePipeline = new OutlinePipeline(gl).setShader(shader);

    this.modelMatrix = mat4.create();
    this.modelMatrixScaled = mat4.scale(this.modelMatrix, this.modelMatrix, vec3.fromValues(1.01, 1.01, 1.01));
  }

  public render() {
    if (!this.mesh) {
      return;
    }

    this.outlinePipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .setStencilMask()
      .update(this.control, 0, this.modelMatrix)
      .render()
      .compareStencilMask()
      .update(this.control, 1, this.modelMatrixScaled)
      .render()
      .unbind();
  }
}