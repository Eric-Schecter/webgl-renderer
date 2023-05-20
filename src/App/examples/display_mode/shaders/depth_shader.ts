import { vec2 } from "gl-matrix";
import { Shader } from "../../../gl";

export class DepthShader extends Shader {
  private uTexture;
  private uSize;
  private uDepthMin;
  private uDepthMax;
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs);
    this.uTexture = this.gl.getUniformLocation(this.id, 'u_texture');
    this.uSize = this.gl.getUniformLocation(this.id, 'u_size');
    this.uDepthMin = this.gl.getUniformLocation(this.id, 'u_depth_min');
    this.uDepthMax = this.gl.getUniformLocation(this.id, 'u_depth_max');
  }
  public updateTexture = (id = 0) => {
    this.gl.uniform1i(this.uTexture, id);
    return this;
  }

  public updateSize = (size: vec2) => {
    this.gl.uniform2fv(this.uSize, size);
    return this;
  }

  public updateMinDepth = (depth: number) => {
    this.gl.uniform1f(this.uDepthMin, depth);
    return this;
  }
  public updateMaxDepth = (depth: number) => {
    this.gl.uniform1f(this.uDepthMax, depth);
    return this;
  }
}