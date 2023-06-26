import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { ModelDashedlineV2VS, ModelDashedlineV2FS } from '../shader_source';
import { ModelDashedV2Shader } from "../shaders";
import { ModelDashedV2Pipeline } from "../pipelines";
import { LineMesh } from "../lineMesh";

export class WireframeDashedV2Layer extends Layer {
  public lineMesh?: LineMesh;
  private modelPipeline: ModelDashedV2Pipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const modelShader = new ModelDashedV2Shader(gl, ModelDashedlineV2VS, ModelDashedlineV2FS);
    this.modelPipeline = new ModelDashedV2Pipeline(gl).setShader(modelShader);
  }

  public render() {
    if (!this.lineMesh) {
      return;
    }

    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    this.gl.polygonOffset(1.0, 1.0);

    const dashGap = 10;
    const dashSize = 10;

    this.modelPipeline
      .setMesh(this.lineMesh)
      .bind(this.window)
      .clear()
      .update(this.control, dashGap, dashSize, 1)
      .render()
      .unbind();

    this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
  }
}