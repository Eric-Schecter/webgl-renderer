import { mat4 } from "gl-matrix";
import { Shader } from "../../gl";

export class ModelShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uAlpha;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uAlpha = this.gl.getUniformLocation(this.id, 'u_alpha');
  }
  public updateProjectMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uProjectMatrix, false, matrix.values());
  }

  public updateViewMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uViewMatrix, false, matrix.values());
  }

  public updateAlpha = (alpha: number) => {
    this.gl.uniform1f(this.uAlpha, alpha);
  }
}