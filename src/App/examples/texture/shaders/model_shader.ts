import { mat4 } from "gl-matrix";
import { Shader } from "../../../gl";

export class ModelShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uNormalMatrix;
  private uAlpha;
  private uColorTexture;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uNormalMatrix = this.gl.getUniformLocation(this.id, 'u_normalMatrix');
    this.uAlpha = this.gl.getUniformLocation(this.id, 'u_alpha');
    this.uColorTexture = this.gl.getUniformLocation(this.id, 'u_colorTexture');
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

  public updateNormalMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uNormalMatrix, false, matrix.values());
    return this;
  }

  public updateAlpha = (alpha: number) => {
    this.gl.uniform1f(this.uAlpha, alpha);
    return this;
  }

  public updateColorTexture = (id = 0) => {
    this.gl.uniform1i(this.uColorTexture, id);
    return this;
  }
}