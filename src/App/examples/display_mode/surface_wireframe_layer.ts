import { Layer, WGLWindow, GLTFLoader, OrbitControl } from "../../gl";
import { mat4 } from 'gl-matrix';
import { Mesh } from "./mesh";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import { ModelShader } from "./model_shader";

export class SurfaceWireframeLayer extends Layer {
  private mesh?: Mesh;
  private shader?: ModelShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);

    new GLTFLoader().load('models/DamagedHelmet/DamagedHelmet.gltf')
      .then((model) => {
        const { positions, indices } = model[0];
        this.mesh = new Mesh(this.gl, Array.from(positions), Array.from(indices), true);
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

    this.mesh.bind();

    this.gl.colorMask(false, false, false, false);
    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(mat4.create());
    this.shader.updateAlpha(1);
    this.mesh.wireframe = false;
    this.mesh.render();

    this.gl.colorMask(true, true, true, true);
    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(mat4.create());
    this.shader.updateAlpha(1);
    this.mesh.wireframe = true;
    this.mesh.render();
    this.shader.unbind();

    this.mesh.unbind();
  }
}