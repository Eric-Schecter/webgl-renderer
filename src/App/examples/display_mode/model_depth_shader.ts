import { mat4 } from "gl-matrix";
import { Shader } from "../../gl";

export class ModelDepthShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
  }
  public updateProjectMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uProjectMatrix, false, matrix.values());
  }

  public updateViewMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uViewMatrix, false, matrix.values());
  }

  public updateModelMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uModelMatrix, false, matrix.values());
  }
}