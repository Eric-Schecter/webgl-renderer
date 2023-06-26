import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { ModelDashedlineV1VS, ModelDashedlineV1FS } from '../shader_source';
import { ModelDashedV1Shader } from "../shaders";
import { ModelDashedV1Pipeline } from "../pipelines";
import { LineMesh } from "../lineMesh";

export class WireframeDashedV1Layer extends Layer {
  public lineMesh?: LineMesh;
  private modelPipeline: ModelDashedV1Pipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const modelShader = new ModelDashedV1Shader(gl, ModelDashedlineV1VS, ModelDashedlineV1FS);
    this.modelPipeline = new ModelDashedV1Pipeline(gl).setShader(modelShader);
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
      .update(this.control, this.window, dashGap, dashSize, 1)
      .render()
      .unbind();

    this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
  }
}