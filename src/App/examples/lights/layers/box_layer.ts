import { mat4, vec3 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { MeshVS, MeshFS } from '../shader_source';
import { PhongShader } from "../shaders";
import { MeshPipeline } from "../pipelines";
import { BoxGeometry } from "../geometry";
import { Lights } from "../lights";

export class BoxLayer extends Layer {
  public lights?: Lights;
  // private renderpass: ColorDepthRenderPass;
  private pipeline: MeshPipeline;
  public shader?: PhongShader;
  public modelMatrix = mat4.create();
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, normals, uvs } = new BoxGeometry(0.5, 0.5, 0.5);
    this.mesh = new Mesh(this.gl, vertices, indices, normals, uvs);
    // this.renderpass = new ColorDepthRenderPass(gl, width, height);

    this.pipeline = new MeshPipeline(gl).setMesh(this.mesh);
  }

  public render() {
    if (!this.lights) {
      return;
    }

    const modelMatrix = mat4.translate(mat4.create(), mat4.create(), vec3.fromValues(0, 0.5, 0));
    const normalMatrix = mat4.transpose(mat4.create(), (mat4.invert(mat4.create(), modelMatrix)));
    const color = vec3.fromValues(1, 0, 0);
    const { projectMatrix, viewMatrix } = this.control;
    this.modelMatrix = modelMatrix;
    if (!this.shader) {
      this.shader = new PhongShader(this.gl, MeshVS, MeshFS, this.lights);
      this.pipeline.setShader(this.shader);
    }

    this.pipeline
      .bind(this.window)
      .update(projectMatrix, viewMatrix, modelMatrix, normalMatrix, color, this.lights)
      .render()
      .unbind();
  }
}