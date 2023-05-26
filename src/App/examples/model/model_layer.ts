import { Layer, WGLWindow, OrbitControl } from "../../gl";
import { Mesh } from "./mesh";
import { ModelVS, ModelFS } from './shader_source';
import { ModelShader } from "./model_shader";


export class ModelLayer extends Layer {
  public mesh?: Mesh;
  private shader?: ModelShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    this.shader = new ModelShader(this.gl, ModelVS, ModelFS);
  }

  public render() {
    if (!this.mesh || !this.shader) {
      return;
    }
    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);

    this.mesh.bind();
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();
  }
}