import { vec4 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, OrthographicCamera, ColorDepthRenderPass } from "../../gl";
import { Mesh } from "./mesh";
import modelVS from './shader/model.vs';
import modelFS from './shader/model.fs';
import planeVS from './shader/plane.vs';
import planeFS from './shader/plane.fs';
import { ModelShader } from "./model_shader";
import { PlaneGeometry } from "./plane";
import { PlaneShader } from "./plane_shader";
import { GUIHandler } from "../../gui";
import { OptionFolder } from "../../gui/option_folder";

export class ClipPlaneLayer extends Layer {
  public mesh?: Mesh;
  private modelShader?: ModelShader;
  private plane: Mesh;
  private planeShader: PlaneShader;
  private needRenderPlane = true;
  private camera: OrthographicCamera;
  private renderpass: ColorDepthRenderPass;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices } = new PlaneGeometry(3, 3, 1, 1);
    const { width, height } = window;
    this.plane = new Mesh(this.gl, vertices, indices);
    this.planeShader = new PlaneShader(this.gl, planeVS, planeFS);
    this.modelShader = new ModelShader(this.gl, modelVS, modelFS);
    this.camera = new OrthographicCamera();
    this.renderpass = new ColorDepthRenderPass(gl, width, height);

    const folder = GUIHandler.getInstance().createFolder('mode', OptionFolder);
    folder.addItem('render plane', () => this.needRenderPlane = !this.needRenderPlane, this.needRenderPlane);
  }

  public update() {
    if (!this.mesh || !this.modelShader) {
      return;
    }
    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.renderpass.bind();
    this.renderpass.clear();

    // render model
    this.modelShader.bind();

    this.modelShader.updateProjectMatrix(this.control.projectMatrix);
    this.modelShader.updateViewMatrix(this.control.viewMatrix);

    const plane = vec4.fromValues(0, 0, 1, 0);
    this.modelShader.updatePlane(plane);

    this.mesh.bind();
    this.mesh.render();
    this.mesh.unbind();

    this.modelShader.unbind();

    // render plane
    if (this.needRenderPlane) {
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      this.planeShader.bind();

      this.planeShader.updateProjectMatrix(this.control.projectMatrix);
      this.planeShader.updateViewMatrix(this.control.viewMatrix);

      this.plane.bind();
      this.plane.render();
      this.plane.unbind();

      this.planeShader.unbind();
    }

    this.renderpass.copyToScreen(width, height);
  }
}