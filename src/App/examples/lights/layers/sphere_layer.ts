import { Layer, WGLWindow, OrbitControl } from "../../../gl";
import { Mesh } from "../mesh";
import { PointVS, PointFS } from '../shader_source';
import { BasicShader } from "../shaders";
import { BoxGeometry } from "../geometry";
import { BasicPipeline } from "../pipelines";
import { PointLight } from "../lights";
import { mat4 } from "gl-matrix";

export class SphereLayer extends Layer {
  private pipeline: BasicPipeline;
  public modelMatrix = mat4.create();
  constructor(private gl: WebGL2RenderingContext, window: WGLWindow, private control: OrbitControl, private pointLight: PointLight) {
    super(window);
    const { vertices, indices, normals, uvs } = new BoxGeometry(0.01, 0.01, 0.01); // todo: change to sphere geometry
    this.mesh = new Mesh(this.gl, vertices, indices, normals, uvs);
    const shader = new BasicShader(this.gl, PointVS, PointFS);
    this.pipeline = new BasicPipeline(gl).setMesh(this.mesh).setShader(shader);
  }

  public render() {
    const { projectMatrix, viewMatrix } = this.control;
    this.modelMatrix = this.pointLight.modelMatrix;
    this.pipeline
      .bind(this.window)
      .update(projectMatrix, viewMatrix, this.pointLight.modelMatrix, this.pointLight.color)
      .render()
      .unbind();
  }
}