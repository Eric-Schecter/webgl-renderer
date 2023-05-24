import { mat4, vec3 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { MeshVS, MeshFS } from '../shader_source';
import { MeshShader } from "../shaders";
import { PlaneGeometry } from "../geometry";
import { MeshPipeline } from "../pipelines";

export class PlaneLayer extends Layer {
  private pipeline: MeshPipeline;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, uvs } = new PlaneGeometry(3, 3, 1, 1);
    const plane = new Mesh(this.gl, vertices, indices, uvs);
    const planeShader = new MeshShader(this.gl, MeshVS, MeshFS);
    this.pipeline = new MeshPipeline(gl).setShader(planeShader).setMesh(plane);
  }

  public update() {
    const modelMatrix = mat4.rotateX(mat4.create(), mat4.create(), Math.PI / 2);
    const color = vec3.fromValues(1, 1, 1);

    this.pipeline
      .bind(this.window)
      .update(this.control.projectMatrix, this.control.viewMatrix, modelMatrix, color)
      .render()
      .unbind();
  }
}