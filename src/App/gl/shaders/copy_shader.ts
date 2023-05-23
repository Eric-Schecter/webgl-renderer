import { vec2 } from "gl-matrix";
import { Shader } from "../../gl";

export class CopyShader extends Shader {
  private uTexture;
  private uSize;
  private uSSLevel;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uTexture = this.gl.getUniformLocation(this.id, 'u_texture');
    this.uSize = this.gl.getUniformLocation(this.id, 'u_size');
    this.uSSLevel = this.gl.getUniformLocation(this.id, 'u_sslevel');
  }
  public updateTexture = (id = 0) => {
    this.gl.uniform1i(this.uTexture, id);
    return this;
  }

  public updateSize = (size: vec2) => {
    this.gl.uniform2fv(this.uSize, size);
    return this;
  }

  public updateSSLevel = (level: number) => {
    this.gl.uniform1i(this.uSSLevel, level);
    return this;
  }
}