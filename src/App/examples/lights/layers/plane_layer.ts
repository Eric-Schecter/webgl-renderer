import { mat4, vec3 } from "gl-matrix";
import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { MeshVS, MeshFS } from '../shader_source';
import { PhongShader } from "../shaders";
import { PlaneGeometry } from "../geometry";
import { MeshPipeline } from "../pipelines";
import { Lights } from "../lights";

export class PlaneLayer extends Layer {
  public lights?: Lights;
  private pipeline: MeshPipeline;
  private shader?: PhongShader;
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl) {
    super(window);
    const { vertices, indices, normals, uvs } = new PlaneGeometry(3, 3, 1, 1);
    const plane = new Mesh(this.gl, vertices, indices, normals, uvs);
    this.pipeline = new MeshPipeline(gl).setMesh(plane);
  }

  public update() {
    if (!this.lights) {
      return;
    }

    const modelMatrix = mat4.rotateX(mat4.create(), mat4.create(), Math.PI / 2);
    const color = vec3.fromValues(1, 1, 1);
    const { projectMatrix, viewMatrix } = this.control;

    if (!this.shader) {
      this.shader = new PhongShader(this.gl, MeshVS, MeshFS, this.lights);
      this.pipeline.setShader(this.shader);
    }

    this.pipeline
      .bind(this.window)
      .update(projectMatrix, viewMatrix, modelMatrix, color, this.lights)
      .render()
      .unbind();
  }
}