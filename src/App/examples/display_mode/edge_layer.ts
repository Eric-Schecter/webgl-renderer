import { mat4, vec2 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, ColorDepthRenderPass } from "../../gl";
import vs from './shader/model.vs';
import fs from './shader/model.fs';
import copyVS from './shader/copy_shader.vs';
import edgeFS from './shader/edge_shader.fs';
import { ModelShader } from "./model_shader";
import { ScreenPlane } from "./screen_plane";
import { SobelShader } from "./sobel_shader";
import { Mesh } from "./mesh";

export class EdgeLayer extends Layer {
  public mesh?: Mesh;
  private plane: ScreenPlane;
  private shader?: ModelShader;
  private edgeShader: SobelShader;
  private renderpass: ColorDepthRenderPass;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const { width, height } = window;
    this.renderpass = new ColorDepthRenderPass(this.gl, width, height);

    this.plane = new ScreenPlane(this.gl);
    this.edgeShader = new SobelShader(this.gl, copyVS, edgeFS);

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
    this.mesh.wireframe = false;
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(mat4.create());
    this.shader.updateAlpha(1);

    this.mesh.bind();
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();

    this.renderpass.unbind();
    this.renderpass.bindForReadColor();

    // render buffer
    this.edgeShader.bind();
    this.edgeShader.updateTexture();
    this.edgeShader.updateSize(vec2.fromValues(width, height));
    const hCoef = [
      1.0, 0.0, -1.0,
      2.0, 0.0, -2.0,
      1.0, 0.0, -1.0
    ];
    const vCoef = [
      1.0, 2.0, 1.0,
      0.0, 0.0, 0.0,
      -1.0, -2.0, -1.0
    ];
    this.edgeShader.updateHCoef(hCoef);
    this.edgeShader.updateVCoef(vCoef);

    this.plane.bind();
    this.plane.render();
    this.plane.unbind();

    this.edgeShader.unbind();
  }
}