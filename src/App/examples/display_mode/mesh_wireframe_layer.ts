import { Layer, WGLWindow, GLTFLoader, OrbitControl } from "../../gl";
import { vec3 } from 'gl-matrix';
import { Mesh } from "./mesh";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import colorfs from './shader/model_color.fs';
import { ModelShader } from "./model_shader";
import { ModelColorShader } from "./model_color_shader";

export class MeshWireframeLayer extends Layer {
  private mesh?: Mesh;
  private shader?: ModelShader;
  private colorShader?: ModelColorShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);

    new GLTFLoader().load('models/DamagedHelmet/DamagedHelmet.gltf')
      .then((model) => {
        const { positions, indices } = model[0];
        this.mesh = new Mesh(this.gl, Array.from(positions), Array.from(indices), true);
        this.shader = new ModelShader(this.gl, vs, fs);
        this.colorShader = new ModelColorShader(this.gl, vs, colorfs);
      })
  }

  public update() {
    if (!this.mesh || !this.shader || !this.colorShader) {
      return;
    }
    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.mesh.bind();

    this.colorShader.bind();
    this.colorShader.updateProjectMatrix(this.control.projectMatrix);
    this.colorShader.updateViewMatrix(this.control.viewMatrix);
    this.colorShader.updateColor(vec3.fromValues(0, 0, 0));
    this.mesh.wireframe = true;
    this.mesh.render();
    this.colorShader.unbind();

    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateAlpha(1);
    this.mesh.wireframe = false;
    this.mesh.render();
    this.shader.unbind();

    this.mesh.unbind();
  }
}