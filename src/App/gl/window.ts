import { throwErrorIfInvalid } from "./utils";

export class Window {
  private _gl: WebGL2RenderingContext;
  private extensions = [];
  private canvas: HTMLCanvasElement;

  constructor(protected container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    const { clientWidth, clientHeight } = this.container;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);

    this._gl = throwErrorIfInvalid(this.canvas.getContext('webgl2'));
    this.extensions.forEach(extension => {
      const ext = this.gl.getExtension(extension);
      if (!ext) {
        console.log(`failed to get ${extension}`);
      }
    });
    window.addEventListener('resize', this.resize);
  }

  private resize = () => {
    if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
  }

  public updata = () => {

  }

  public dispose = () => {
    window.removeEventListener('resize', this.resize);
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