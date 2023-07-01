import { vec2 } from "gl-matrix";
import { Shader } from "../../../gl";

export class CopyShader extends Shader {
  private uPatternTexture;
  private uBorderTexture;
  private uSize;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uPatternTexture = this.gl.getUniformLocation(this.id, 'u_texturePattern');
    this.uBorderTexture = this.gl.getUniformLocation(this.id, 'u_borderPattern');
    this.uSize = this.gl.getUniformLocation(this.id, 'u_size');
  }
  public updateBorderTexture = (id = 0) => {
    this.gl.uniform1i(this.uBorderTexture, id);
    return this;
  }

  public updatePatternTexture = (id = 0) => {
    this.gl.uniform1i(this.uPatternTexture, id);
    return this;
  }

  public updateSize = (size: vec2) => {
    this.gl.uniform2fv(this.uSize, size);
    return this;
  }
}