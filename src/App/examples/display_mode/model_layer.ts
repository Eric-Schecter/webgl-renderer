import { Layer, WGLWindow, GLTFLoader, OrbitControl } from "../../gl";
import { Mesh } from "./mesh";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import { ModelShader } from "./model_shader";


export class ModelLayer extends Layer {
  private mesh?: Mesh;
  private shader?: ModelShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);

    new GLTFLoader().load('models/DamagedHelmet/DamagedHelmet.gltf')
      .then((model) => {
        const { positions, indices } = model[0];
        this.mesh = new Mesh(this.gl, Array.from(positions), Array.from(indices));
        this.shader = new ModelShader(this.gl, vs, fs);
      })
  }

  public update() {
    if (!this.mesh || !this.shader) {
      return;
    }
    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateAlpha(1);

    this.mesh.bind();
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();
  }
}