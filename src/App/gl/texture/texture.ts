import { Disposable } from "../events";
import { throwErrorIfInvalid } from "../utils";

export class Texture implements Disposable {
  private m_id: WebGLTexture;
  private width = 0;
  private height = 0;
  constructor(protected gl: WebGL2RenderingContext, path?: string) {
    this.m_id = throwErrorIfInvalid(this.gl.createTexture());
    if (path) {
      this.load(path);
    }
  }
  public bind = (id = 0) => {
    this.gl.activeTexture(this.gl.TEXTURE0 + id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_id);
  }
  public unbind = () => {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
  public resize = (width: number, height: number, internalformat: number, format: number, type: number) => {
    this.width = width;
    this.height = height;
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalformat, width, height, 0, format, type, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  }
  public dispose = () => {
    this.gl.deleteTexture(this.id);
  }
  public load = (path: string) => {
    const image = new Image();
    image.src = path;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        // create + bind
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_id);
        // set parameters
        // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true); // html image coordinate start from left bottom, same with webgl, no need to flip y
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        // set data
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA8, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        // mipmap
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        // unbind
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.width = image.width;
        this.height = image.height;
        resolve(true);
      }
      image.onerror = (e) => {
        console.error(e);
        reject(false);
      }
    })
  }
  public clone = () => {
    const cloneTexture = throwErrorIfInvalid(this.gl.createTexture());
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, cloneTexture);
    this.gl.copyTexImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 0, 0, this.width, this.height, 0);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    const texture = new Texture(this.gl);
    this.gl.deleteTexture(texture.id);
    texture.id = cloneTexture;
    return texture;
  }
  public get id() {
    return this.m_id;
  }
  // todo：for clone part, just for now
  public set id(texture: WebGLTexture) {
    this.m_id = texture;
  }
}