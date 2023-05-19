import { mat4, vec2, vec3 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl, DepthRenderPass } from "../../gl";
import { Mesh } from "./mesh";
import vs from './shader/model_depth.vs';
import fs from './shader/model_depth.fs';
import wireframefs from './shader/model_depth_wireframe.fs';
import copyVS from './shader/copy_shader.vs';
import depthFS from './shader/depth_shader.fs';
import { ScreenPlane } from "./screen_plane";
import { DepthShader } from "./depth_shader";
import { ModelDepthShader } from "./model_depth_shader";
import { ModelDepthWireframeShader } from "./model_depth_wireframe_shader";

export class WireframeDepthLayer extends Layer {
  public mesh?: Mesh;
  private plane: ScreenPlane;
  private shader: ModelDepthShader;
  private wireframeShader: ModelDepthWireframeShader;
  private depthShader: DepthShader;
  private renderpass: DepthRenderPass;
  private renderpassSurface: DepthRenderPass;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, visible: boolean) {
    super(window, visible);
    const { width, height } = window;
    this.renderpass = new DepthRenderPass(this.gl, width, height);
    this.renderpassSurface = new DepthRenderPass(this.gl, width, height);
    this.plane = new ScreenPlane(this.gl);
    this.depthShader = new DepthShader(this.gl, copyVS, depthFS);
    this.shader = new ModelDepthShader(this.gl, vs, fs);
    this.wireframeShader = new ModelDepthWireframeShader(this.gl, vs, wireframefs);
  }

  public update() {
    if (!this.mesh) {
      return;
    }
    const { corners } = this.mesh.boundingBox;
    const { pos } = this.control.camera;
    let disMin = Infinity;
    let disMax = -Infinity;
    corners.forEach(corner => {
      disMin = Math.min(disMin, vec3.distance(corner, pos));
      disMax = Math.max(disMax, vec3.distance(corner, pos));
    })

    const { camera } = this.control;
    const offset = 0.5; // todo: find another method to handle
    camera.near = disMin - offset;
    camera.far = disMax;
    camera.update();

    const { width, height } = this.window;
    this.gl.viewport(0, 0, width, height);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // render mesh to get surface depth
    this.renderpassSurface.bind();
    this.renderpassSurface.clear();

    this.shader.bind();
    this.shader.updateProjectMatrix(this.control.projectMatrix);
    this.shader.updateViewMatrix(this.control.viewMatrix);
    this.shader.updateModelMatrix(mat4.create());

    this.mesh.bind();
    this.mesh.wireframe = false;
    this.mesh.render();
    this.mesh.unbind();

    this.shader.unbind();

    this.renderpassSurface.unbind();

    // render mesh
    this.renderpass.bind();
    this.renderpass.clear();

    this.renderpassSurface.bindForRead();

    this.wireframeShader.bind();
    this.wireframeShader.updateProjectMatrix(this.control.projectMatrix);
    this.wireframeShader.updateViewMatrix(this.control.viewMatrix);
    this.wireframeShader.updateModelMatrix(mat4.create());
    this.wireframeShader.updateTexture();
    this.wireframeShader.updateSize(vec2.fromValues(width, height));

    this.mesh.bind();
    this.mesh.wireframe = true;
    this.mesh.render();
    this.mesh.unbind();

    this.wireframeShader.unbind();
    this.renderpassSurface.unbind();
    this.renderpass.unbind();

    // render buffer
    this.gl.viewport(0, 0, width, height);
    this.renderpass.bindForRead();
    this.depthShader.bind();
    this.depthShader.updateTexture();
    this.depthShader.updateSize(vec2.fromValues(width, height));
    this.depthShader.updateMinDepth(disMin);
    this.depthShader.updateMaxDepth(disMax);

    this.plane.bind();
    this.plane.render();
    this.plane.unbind();

    this.depthShader.unbind();
  }
}