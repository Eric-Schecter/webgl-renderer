import { mat4 } from "gl-matrix";
import { Shader } from "../../../gl";

export class ProjectShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uTexture;
  private uNearestDepth;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uTexture = this.gl.getUniformLocation(this.id, 'u_texture');
    this.uNearestDepth = this.gl.getUniformLocation(this.id, 'u_nearestDepth');
  }
  public updateTexture = (id = 0) => {
    this.gl.uniform1i(this.uTexture, id);
    return this;
  }

  public updateProjectMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uProjectMatrix, false, matrix.values());
    return this;
  }

  public updateViewMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uViewMatrix, false, matrix.values());
    return this;
  }

  public updateNearestDepth = (depth: number) => {
    this.gl.uniform1f(this.uNearestDepth, depth);
    return this;
  }
}