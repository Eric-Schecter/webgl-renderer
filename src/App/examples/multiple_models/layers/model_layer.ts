import { Layer, WGLWindow, OrbitControl, PBRTextures } from "../../../gl";
import { Mesh } from "../mesh";
import { ModelVS, ModelFS } from '../shader_source';
import { ModelShader } from "../shaders";
import { ModelPipeline } from "../pipelines";

export class ModelLayer extends Layer {
  public meshes: Mesh[] = [];
  private pipeline: ModelPipeline;
  public pbrTextures: PBRTextures = {};
  constructor(private gl: WebGL2RenderingContext, protected window: WGLWindow, private control: OrbitControl) {
    super(window);
    const shader = new ModelShader(gl, ModelVS, ModelFS);
    this.pipeline = new ModelPipeline(gl).setShader(shader);
  }

  public render() {
    if (this.meshes.length === 0) {
      return;
    }
    const size = 200;
    const { width, height } = this.window;
    this.gl.enable(this.gl.SCISSOR_TEST);
    
    this.gl.clearColor(0, 0, 1, 1);
    this.gl.viewport(0, height - size, size, size);
    this.gl.scissor(0, height - size, size, size);

    this.pipeline
      .setMesh(this.meshes[0])
      .bind()
      .clear()
      .update(this.control, this.pbrTextures)
      .render()
      .unbind();

    this.gl.scissor(0, 0, width, height);
    this.gl.viewport(0, 0, width, height);
    this.gl.disable(this.gl.SCISSOR_TEST);
  }
}