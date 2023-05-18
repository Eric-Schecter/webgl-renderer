import { mat4, vec2 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, DepthRenderPass } from "../../gl";
import { Mesh } from "./mesh";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import copyVS from './shader/copy_shader.vs';
import depthFS from './shader/depth_shader.fs';
import { ModelShader } from "./model_shader";
import { ScreenPlane } from "./screen_plane";
import { CopyShader } from "./copy_shader";

export class WireframeDepthLayer extends Layer {
  public mesh?: Mesh;
  private plane: ScreenPlane;
  private shader?: ModelShader;
  private copyShader: CopyShader;
  private renderpass: DepthRenderPass;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    this.renderpass = new DepthRenderPass(this.gl, window.width, window.height);

    this.plane = new ScreenPlane(this.gl);
    this.copyShader = new CopyShader(this.gl, copyVS, depthFS);
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

    this.renderpass.bind();
    this.renderpass.clear();

    // render mesh
    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(mat4.create());
    this.shader.updateAlpha(1);

    this.mesh.bind();
    this.mesh.wireframe = true;
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();

    this.renderpass.unbind();
    this.gl.viewport(0, 0, width, height);

    // render buffer
    this.renderpass.bindForRead();
    this.copyShader.bind();
    this.copyShader.updateTexture();
    this.copyShader.updateSize(vec2.fromValues(width, height));

    this.plane.bind();
    this.plane.render();
    this.plane.unbind();

    this.copyShader.unbind();
  }
}