import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelDashedlineV1VS, ModelDashedlineV1FS, ModelColorFS } from '../shader_source';
import { ModelColorShader, ModelDashedV1Shader } from "../shaders";
import { ModelColorPipeline, ModelDashedV1Pipeline } from "../pipelines";
import { LineMesh } from "../lineMesh";
import { vec3 } from "gl-matrix";

export class WireframeDepthDashedLayer extends Layer {
  public mesh?: Mesh;
  public lineMesh?: LineMesh;
  private modelPipeline: ModelColorPipeline;
  private dashedlinePipeline: ModelDashedV1Pipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const modelShader = new ModelColorShader(gl, ModelVS, ModelColorFS);
    this.modelPipeline = new ModelColorPipeline(gl).setShader(modelShader);

    const dashedlineShader = new ModelDashedV1Shader(gl, ModelDashedlineV1VS, ModelDashedlineV1FS);
    this.dashedlinePipeline = new ModelDashedV1Pipeline(gl).setShader(dashedlineShader);
  }

  public render() {
    if (!this.mesh || !this.lineMesh) {
      return;
    }

    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    this.gl.polygonOffset(1.0, 1.0);

    const white = vec3.fromValues(1, 1, 1);

    // render mesh to get surface depth
    this.modelPipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .clear()
      .disableColorMask()
      .update(this.control, white)
      .render()
      .enableColorMask()

    // render surface
    this.modelPipeline
      .setMesh(this.lineMesh)
      .update(this.control, white)
      .render()
      .unbind();

    // render dashed line
    const dashGap = 10;
    const dashSize = 10;

    this.gl.depthFunc(this.gl.GREATER);

    this.dashedlinePipeline
      .setMesh(this.lineMesh)
      .bind(this.window)
      .update(this.control, this.window, dashGap, dashSize, white, 0.5)
      .render()
      .unbind();

    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.disable(this.gl.POLYGON_OFFSET_FILL);

  }
}