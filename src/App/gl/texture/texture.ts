import { Disposable } from "../events";
import { throwErrorIfInvalid } from "../utils";

export abstract class Texture implements Disposable {
  private m_id: WebGLTexture;
  constructor(protected gl: WebGL2RenderingContext) {
    this.m_id = throwErrorIfInvalid(this.gl.createTexture());
  }
  public bind = (id = 0) => {
    this.gl.activeTexture(this.gl.TEXTURE0 + id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  }
  public resize = (width: number, height: number, internalformat: number, format: number, type: number) => {
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalformat, width, height, 0, format, type, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  }
  public dispose = () => {
    this.gl.deleteTexture(this.id);
  }
  public get id() {
    return this.m_id;
  }
  public abstract clear: () => void;
}