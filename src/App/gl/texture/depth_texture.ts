import { Texture } from "./texture";

export class DepthTexture extends Texture {
  public clear = () => {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  }
}
