import { Layer, Shader } from "../../gl";
import { GLTFLoader } from '../../gl/loader';
import { Mesh } from "./mesh";
import vs from './shader/triangle.vs';
import fs from './shader/triangle.fs';


export class ModelLayer extends Layer {
  private mesh?: Mesh;
  private shader?: Shader;
  constructor(private gl: WebGL2RenderingContext) {
    super();

    new GLTFLoader().load('models/DamagedHelmet/DamagedHelmet.gltf')
      .then((model) => {
        const { positions, indices } = model[0];
        this.mesh = new Mesh(this.gl, Array.from(positions), Array.from(indices));

        this.shader = new Shader(this.gl, vs, fs);
      })
  }

  public update() {
    if (!this.mesh || !this.shader) {
      return;
    }
    // const { width, height } = this.window;
    // this.gl.viewport(0, 0, width, height);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.bind();

    this.mesh.bind();
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();
  }
}