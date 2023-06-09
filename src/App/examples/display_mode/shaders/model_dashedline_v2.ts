import { mat4 } from "gl-matrix";
import { Shader } from "../../../gl";

export class ModelDashedV2Shader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uAlpha;
  private uDashGap;
  private uDashSize;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uAlpha = this.gl.getUniformLocation(this.id, 'u_alpha');
    this.uDashGap = this.gl.getUniformLocation(this.id, 'u_gapSize');
    this.uDashSize = this.gl.getUniformLocation(this.id, 'u_dashSize');
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

  public updateAlpha = (alpha: number) => {
    this.gl.uniform1f(this.uAlpha, alpha);
    return this;
  }

  public updateDashGap = (dashGap: number) => {
    this.gl.uniform1f(this.uDashGap, dashGap);
    return this;
  }

  public updateDashSize = (dashSize: number) => {
    this.gl.uniform1f(this.uDashSize, dashSize);
    return this;
  }
}