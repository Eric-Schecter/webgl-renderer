import { Layer, WGLWindow, GLTFLoader, OrbitControl } from "../../gl";
import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from "./mesh";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import { ModelColorShader } from "./model_color_shader";

export class OutlineLayer extends Layer {
  private mesh?: Mesh;
  private shader?: ModelColorShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);

    new GLTFLoader().load('models/DamagedHelmet/DamagedHelmet.gltf')
      .then((model) => {
        const { positions, indices } = model[0];
        this.mesh = new Mesh(this.gl, Array.from(positions), Array.from(indices));
        this.shader = new ModelColorShader(this.gl, vs, fs);
      })
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
    this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.REPLACE);

    const modelMatrix = mat4.create();

    this.mesh.bind();

    // write mesh info for mask
    // set 0xff as mask value
    this.gl.stencilFunc(this.gl.ALWAYS, 1, 0xff);
    this.gl.stencilMask(0xff); // allow write value

    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(modelMatrix);
    this.shader.updateColor(vec3.fromValues(0, 0, 0)); // draw nothing
    this.mesh.render();

    // compare with mask value
    this.gl.stencilFunc(this.gl.NOTEQUAL, 1, 0xff);
    this.gl.stencilMask(0x00); // not allow write 

    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.01, 1.01, 1.01));
    this.shader.updateModelMatrix(modelMatrix);
    this.shader.updateColor(vec3.fromValues(1, 1, 1)); // draw mesh
    this.mesh.render();

    this.shader.unbind();

    this.mesh.unbind();

    this.gl.stencilMask(0xFF);
    this.gl.disable(this.gl.STENCIL_TEST);
  }
}