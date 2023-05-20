import { mat4, vec4 } from "gl-matrix";
import { Shader } from "../../../gl";

export class ModelShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uPlane;
  private uNeedRenderplane;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uPlane = this.gl.getUniformLocation(this.id, 'u_plane');
    this.uNeedRenderplane = this.gl.getUniformLocation(this.id, 'u_needrenderplane');
  }
  public updateProjectMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uProjectMatrix, false, matrix.values());
  }

  public updateViewMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uViewMatrix, false, matrix.values());
  }

  public updatePlane = (plane: vec4) => {
    this.gl.uniform4fv(this.uPlane, plane.values());
  }

  public updateNeedRenderPlane = (needRenderPlane: number) => {
    this.gl.uniform1i(this.uNeedRenderplane, needRenderPlane);
  }
}