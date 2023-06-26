import { vec3 } from 'gl-matrix';
import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS, ModelColorFS } from '../shader_source';
import { ModelShader, ModelColorShader } from "../shaders";
import { ModelColorPipeline, ModelPipeline } from '../pipelines';
import { LineMesh } from '../lineMesh';

export class MeshWireframeLayer extends Layer {
  public mesh?: Mesh;
  public lineMesh?: LineMesh;
  private pipeline: ModelPipeline;
  private colorPipeline: ModelColorPipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const shader = new ModelShader(gl, ModelVS, ModelFS);
    const colorShader = new ModelColorShader(gl, ModelVS, ModelColorFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
    this.colorPipeline = new ModelColorPipeline(gl).setShader(colorShader);
  }

  public render() {
    if (!this.mesh || !this.lineMesh) {
      return;
    }
    const black = vec3.fromValues(1, 1, 1);

    this.colorPipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .update(this.control, black)
      .render()
      .unbind()

    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    this.gl.polygonOffset(1.0, 1.0);

    this.pipeline
      .setMesh(this.lineMesh)
      .bind(this.window)
      .update(this.control)
      .render()
      .unbind();

    this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
  }
}