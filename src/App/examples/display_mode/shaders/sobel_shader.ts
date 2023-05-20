import { vec2 } from "gl-matrix";
import { Shader } from "../../../gl";

export class SobelShader extends Shader {
  private uTexture;
  private uSize;
  private uHCoef;
  private uVCoef;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uTexture = this.gl.getUniformLocation(this.id, 'u_texture');
    this.uSize = this.gl.getUniformLocation(this.id, 'u_size');
    this.uHCoef = this.gl.getUniformLocation(this.id, 'u_hCoef');
    this.uVCoef = this.gl.getUniformLocation(this.id, 'u_vCoef');
  }
  public updateTexture = (id = 0) => {
    this.gl.uniform1i(this.uTexture, id);
  }

  public updateSize = (size: vec2) => {
    this.gl.uniform2fv(this.uSize, size);
  }

  public updateHCoef = (coef: number[]) => {
    this.gl.uniform1fv(this.uHCoef, coef);
  }

  public updateVCoef = (coef: number[]) => {
    this.gl.uniform1fv(this.uVCoef, coef);
  }
}