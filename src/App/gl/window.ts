import { throwErrorIfInvalid } from "./utils";

export class Window {
  private _gl: WebGL2RenderingContext;
  private extensions = [];

  constructor(protected container: HTMLElement) {
    const canvas = document.createElement('canvas');
    const { clientWidth, clientHeight } = this.container;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    this.container.appendChild(canvas);

    this._gl = throwErrorIfInvalid(canvas.getContext('webgl2'));
    this.extensions.forEach(extension => {
      const ext = this.gl.getExtension(extension);
      if (!ext) {
        console.log(`failed to get ${extension}`);
      }
    });


  }

  public dispose(){
    
  }

  public get gl() {
    return this._gl;
  }

  public get width() {
    return this.container.clientWidth;
  }

  public get height() {
    return this.container.clientHeight;
  }
}