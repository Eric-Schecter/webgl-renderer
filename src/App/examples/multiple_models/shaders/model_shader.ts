import { mat4, vec3 } from "gl-matrix";
import { Shader, Texture } from "../../../gl";

export class ModelShader extends Shader {
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uNormalMatrix;
  private uAlpha;
  private uColorTexture;
  private uNormalTexture;
  private uMetalRoughnessTexture;
  private uOcclusionTexture;
  private uEmissiveTexture;
  private uCamaraPos;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uNormalMatrix = this.gl.getUniformLocation(this.id, 'u_normalMatrix');
    this.uAlpha = this.gl.getUniformLocation(this.id, 'u_alpha');
    this.uColorTexture = this.gl.getUniformLocation(this.id, 'u_colorTexture');
    this.uNormalTexture = this.gl.getUniformLocation(this.id, 'u_normalTexture');
    this.uMetalRoughnessTexture = this.gl.getUniformLocation(this.id, 'u_metalRoughnessTexture');
    this.uOcclusionTexture = this.gl.getUniformLocation(this.id, 'u_occlusionTexture');
    this.uEmissiveTexture = this.gl.getUniformLocation(this.id, 'u_emissiveTexture');
    this.uCamaraPos = this.gl.getUniformLocation(this.id, 'u_camaraPos');
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

  public updateColorTexture = (id = 0, texture?: Texture) => {
    if (texture) {
      this.gl.uniform1i(this.uColorTexture, id);
      texture.bind(id);
    }
    return this;
  }

  public updateNormalTexture = (id = 0, texture?: Texture) => {
    if (texture) {
      this.gl.uniform1i(this.uNormalTexture, id);
      texture.bind(id);
    }
    return this;
  }

  public updateMetalRoughnessTexture = (id = 0, texture?: Texture) => {
    if (texture) {
      this.gl.uniform1i(this.uMetalRoughnessTexture, id);
      texture.bind(id);
    }
    return this;
  }

  public updateOcclusionTexture = (id = 0, texture?: Texture) => {
    if (texture) {
      this.gl.uniform1i(this.uOcclusionTexture, id);
      texture.bind(id);
    }
    return this;
  }

  public updateEmissiveTexture = (id = 0, texture?: Texture) => {
    if (texture) {
      this.gl.uniform1i(this.uEmissiveTexture, id);
      texture.bind(id);
    }
    return this;
  }

  public updateCameraPos = (pos: vec3) => {
    this.gl.uniform3fv(this.uCamaraPos, pos);
    return this;
  }
}