import { Layer, WGLWindow, OrbitControl } from "../../gl";
import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from "./mesh";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import { ModelShader } from "./model_shader";

export class OutlineLayer extends Layer {
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

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.STENCIL_TEST);
    // stencil test -> depth test
    this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.REPLACE);

    const modelMatrix = mat4.create();

    this.mesh.bind();
    this.mesh.wireframe = false;

    // write mesh info for mask
    // set 0xff as mask value
    this.gl.stencilFunc(this.gl.ALWAYS, 1, 0xFF);
    this.gl.stencilMask(0xFF); // allow write value, keep value that inputs

    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(modelMatrix);
    this.shader.updateAlpha(0);
    this.mesh.render();
    // compare with mask value
    this.gl.stencilFunc(this.gl.NOTEQUAL, 1, 0xFF);
    this.gl.stencilMask(0x00); // not allow write, abandon value that inputs
    this.gl.disable(this.gl.DEPTH_TEST);

    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.01, 1.01, 1.01));
    this.shader.updateModelMatrix(modelMatrix);
    this.shader.updateAlpha(1);
    this.mesh.render();

    this.shader.unbind();
    this.mesh.unbind();

    this.gl.stencilMask(0xFF);
    this.gl.disable(this.gl.STENCIL_TEST);
  }
}