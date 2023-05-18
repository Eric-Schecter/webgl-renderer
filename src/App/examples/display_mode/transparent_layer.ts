import { Layer, WGLWindow, OrbitControl } from "../../gl";
import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from "./mesh";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import colorfs from './shader/model_color.fs';
import { ModelShader } from "./model_shader";
import { ModelColorShader } from "./model_color_shader";

export class TransparentLayer extends Layer {
  public mesh?: Mesh;
  private shader?: ModelShader;
  private colorShader?: ModelColorShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    this.shader = new ModelShader(this.gl, vs, fs);
    this.colorShader = new ModelColorShader(this.gl, vs, colorfs);
  }

  public update() {
    if (!this.mesh || !this.shader || !this.colorShader) {
      return;
    }
    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.mesh.bind();

    this.colorShader.bind();
    this.colorShader.updateProjectMatrix(this.control.projectMatrix);
    this.colorShader.updateViewMatrix(this.control.viewMatrix);
    this.colorShader.updateModelMatrix(mat4.create());
    this.colorShader.updateColor(vec3.fromValues(0, 0, 0));
    this.mesh.wireframe = true;
    this.mesh.render();
    this.colorShader.unbind();

    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(mat4.create());
    this.shader.updateAlpha(0.5);
    this.mesh.wireframe = false;
    this.mesh.render();
    this.shader.unbind();

    this.mesh.unbind();

    this.gl.disable(this.gl.BLEND);
  }
}