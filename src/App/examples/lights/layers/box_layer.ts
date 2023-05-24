import { mat4, vec3 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { MeshVS, MeshFS } from '../shader_source';
import { MeshShader } from "../shaders";
import { MeshPipeline } from "../pipelines";
import { BoxGeometry } from "../geometry";

export class BoxLayer extends Layer {
  // private renderpass: ColorDepthRenderPass;
  private pipeline: MeshPipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, uvs } = new BoxGeometry(0.5, 0.5, 0.5);
    const box = new Mesh(this.gl, vertices, indices, uvs);
    const meshShader = new MeshShader(this.gl, MeshVS, MeshFS);
    // this.renderpass = new ColorDepthRenderPass(gl, width, height);

    this.pipeline = new MeshPipeline(gl).setShader(meshShader).setMesh(box);

  }

  public update() {
    const modelMatrix = mat4.translate(mat4.create(), mat4.create(), vec3.fromValues(0, 0.5, 0));
    const color = vec3.fromValues(1, 0, 0);

    this.pipeline
      .bind(this.window)
      .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, color)
      .render()
      .unbind();
  }
}