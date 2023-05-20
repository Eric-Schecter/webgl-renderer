import { mat4, vec2 } from "gl-matrix";
import { Shader } from "../../../gl";

export class ModelDepthWireframeShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uTexture;
  private uSize;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uTexture = this.gl.getUniformLocation(this.id, 'u_texture');
    this.uSize = this.gl.getUniformLocation(this.id, 'u_size');
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

  public updateTexture = () => {
    this.gl.uniform1i(this.uTexture, 0);
    return this;
  }

  public updateSize = (size: vec2) => {
    this.gl.uniform2fv(this.uSize, size);
    return this;
  }
}