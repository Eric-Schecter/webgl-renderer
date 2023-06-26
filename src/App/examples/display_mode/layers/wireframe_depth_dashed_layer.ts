import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { ModelPipeline } from "../pipelines";
import { LineMesh } from "../lineMesh";

export class WireframeDepthDashedLayer extends Layer {
  public mesh?: Mesh;
  public lineMesh?: LineMesh;
  private modelPipeline: ModelPipeline;
  // private dashedlinePipeline: ModelPipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const modelShader = new ModelShader(gl, ModelVS, ModelFS);
    this.modelPipeline = new ModelPipeline(gl).setShader(modelShader);

    // const dashedlineShader = new ModelShader(gl, ModelDashedlineVS, ModelDashedlineFS);
    // this.dashedlinePipeline = new ModelPipeline(gl).setShader(dashedlineShader);
  }

  public render() {
    if (!this.mesh || !this.lineMesh) {
      return;
    }

    // render mesh to get surface depth
    this.modelPipeline
      .setMesh(this.mesh)
      .bind(this.window)
      .disableColorMask()
      .clear()
      .update(this.control)
      .render()
      .enableColorMask();

    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    this.gl.polygonOffset(1.0, 1.0);

    // render surface
    this.modelPipeline
      .update(this.control, 1)
      .render();

    // render dashed line
    // this.gl.depthFunc(this.gl.GREATER);
    // this.dashedlinePipeline
    //   .update(this.control, 0.3, true)
    //   .render()
    //   .unbind();
    // this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
  }
}