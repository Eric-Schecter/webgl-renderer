import { vec3, vec4 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, OrthographicCamera, ColorDepthRenderPass } from "../../gl";
import { Mesh } from "./mesh";
import modelVS from './shader/model.vs';
import modelFS from './shader/model.fs';
import planeVS from './shader/plane.vs';
import planeFS from './shader/plane.fs';
import projectVS from './shader/project_shader.vs';
import projectFS from './shader/project_shader.fs';
import { ModelShader } from "./model_shader";
import { PlaneGeometry } from "./plane";
import { PlaneShader } from "./plane_shader";
import { GUIHandler } from "../../gui";
import { OptionFolder } from "../../gui/option_folder";
import { ProjectShader } from "./project_shader";

export class ClipPlaneLayer extends Layer {
  public mesh?: Mesh;
  private plane: Mesh;
  private modelShader: ModelShader;
  private projectShader: ProjectShader;
  private planeShader: PlaneShader;
  private needRenderPlane = false;
  private camera: OrthographicCamera;
  private renderpass: ColorDepthRenderPass;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, uvs } = new PlaneGeometry(3, 3, 1, 1);
    const { width, height } = window;
    this.plane = new Mesh(this.gl, vertices, indices, uvs);
    this.planeShader = new PlaneShader(this.gl, planeVS, planeFS);
    this.modelShader = new ModelShader(this.gl, modelVS, modelFS);
    this.projectShader = new ProjectShader(this.gl, projectVS, projectFS);
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

    if (!this.needRenderPlane) {
      // render opaque objects
      // render model
      this.modelShader.bind();

      this.modelShader.updateProjectMatrix(this.control.projectMatrix);
      this.modelShader.updateViewMatrix(this.control.viewMatrix);
      this.modelShader.updateNeedRenderPlane(0);

      this.mesh.bind();
      this.mesh.render();
      this.mesh.unbind();

      this.modelShader.unbind();
    } else {
      this.renderpass.bind();
      this.renderpass.clear();

      // set camere
      const focus = vec3.create();
      this.camera.pos = vec3.fromValues(0, 0, 1);
      this.camera.setViewMatrix(focus).setProjection(3, 3, 1, 0.1, 1000);

      // render model
      this.modelShader.bind();

      this.modelShader.updateProjectMatrix(this.camera.projectMatrix);
      this.modelShader.updateViewMatrix(this.camera.viewMatrix);
      this.modelShader.updateNeedRenderPlane(1);

      const a = 0;
      const b = 0;
      const c = 1;
      const d = 0;
      const plane = vec4.fromValues(a, b, c, d);
      this.modelShader.updatePlane(plane);

      this.mesh.bind();
      this.mesh.render();
      this.mesh.unbind();

      this.modelShader.unbind();

      this.renderpass.unbind();

      // render opaque objects
      // render model
      this.modelShader.bind();

      this.modelShader.updateProjectMatrix(this.control.projectMatrix);
      this.modelShader.updateViewMatrix(this.control.viewMatrix);
      this.modelShader.updateNeedRenderPlane(1);

      this.modelShader.updatePlane(plane);

      this.mesh.bind();
      this.mesh.render();
      this.mesh.unbind();

      this.modelShader.unbind();

      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      this.renderpass.bindForReadDepth();

      this.projectShader.bind();

      // refer to https://www.cuemath.com/geometry/distance-between-point-and-plane/
      const { pos } = this.camera;
      const nearestDepth = Math.abs(a * pos[0] + b * pos[1] + c * pos[2]) / Math.sqrt(a ** 2 + b ** 2 + c ** 2);

      this.projectShader.updateProjectMatrix(this.control.projectMatrix);
      this.projectShader.updateViewMatrix(this.control.viewMatrix);
      this.projectShader.updateTexture();
      this.projectShader.updateNearestDepth(nearestDepth / (1000 - 0.1));

      this.plane.bind();
      this.plane.render();
      this.plane.unbind();

      this.projectShader.unbind();

      // render transparent objects
      // render plane

      this.planeShader.bind();

      this.planeShader.updateProjectMatrix(this.control.projectMatrix);
      this.planeShader.updateViewMatrix(this.control.viewMatrix);

      this.plane.bind();
      this.plane.render();
      this.plane.unbind();

      this.planeShader.unbind();
    }
  }
}