import { mat4, vec3 } from "gl-matrix";
import { Shader } from "../../../gl";

export class MeshShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uColor;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uColor = this.gl.getUniformLocation(this.id, 'u_color');
  }
  public updateProjectMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uProjectMatrix, false, matrix.values());
    return this;
  }

  public updateViewMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uViewMatrix, false, matrix.values());
    return this;
  }

  public updateModelMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uModelMatrix, false, matrix.values());
    return this;
  }

  public updateColor = (color: vec3) => {
    this.gl.uniform3fv(this.uColor, color);
    return this;
  }
}