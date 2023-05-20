import { vec2 } from "gl-matrix";
import { Shader } from "../../../gl";

export class CopyShader extends Shader {
  private uTexture;
  private uSize;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uTexture = this.gl.getUniformLocation(this.id, 'u_texture');
    this.uSize = this.gl.getUniformLocation(this.id, 'u_size');
  }
  public updateTexture = (id = 0) => {
    this.gl.uniform1i(this.uTexture, id);
  }

  public updateSize = (size: vec2) => {
    this.gl.uniform2fv(this.uSize, size);
  }
}