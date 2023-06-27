import { mat4, vec2, vec3 } from "gl-matrix";
import { Shader } from "../../../gl";

export class ModelDashedV1Shader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uAlpha;
  private uResolution;
  private uDashGap;
  private uDashSize;
  private uColor;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uAlpha = this.gl.getUniformLocation(this.id, 'u_alpha');
    this.uResolution = this.gl.getUniformLocation(this.id, 'u_resolution');
    this.uDashGap = this.gl.getUniformLocation(this.id, 'u_gapSize');
    this.uDashSize = this.gl.getUniformLocation(this.id, 'u_dashSize');
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

  public updateAlpha = (alpha: number) => {
    this.gl.uniform1f(this.uAlpha, alpha);
    return this;
  }

  public updateResolution = (width: number, height: number) => {
    this.gl.uniform2fv(this.uResolution, vec2.fromValues(width, height));
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

  public updateColor = (color: vec3) => {
    this.gl.uniform3fv(this.uColor, color);
    return this;
  }
}