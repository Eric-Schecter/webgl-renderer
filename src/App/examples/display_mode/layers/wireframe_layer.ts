import { mat4 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import vs from '../shader_source/model.vs';
import fs from '../shader_source/model.fs';
import { ModelShader } from "../shaders";

export class WireframeLayer extends Layer {
  public mesh?: Mesh;
  private shader?: ModelShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    this.shader = new ModelShader(this.gl, vs, fs);
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
    this.shader.updateModelMatrix(mat4.create());
    this.shader.updateAlpha(1);

    this.mesh.bind();
    this.mesh.setWireframe(true);
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();
  }
}