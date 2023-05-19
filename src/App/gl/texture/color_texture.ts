import { Texture } from "./texture";

export class ColorTexture extends Texture {
  public clear = () => {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
