import { events, WGLEvent } from "./events";
import { throwErrorIfInvalid } from "./utils";

class ResizeEvent extends WGLEvent {
  constructor(private canvas: HTMLCanvasElement) {
    super();
  }

  public setup = () => {
    window.addEventListener('resize', this.resize);
  };

  public dispose = () => {
    window.removeEventListener('resize', this.resize);
  };

  private resize = () => {
    if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
  }
}

export class WGLWindow {
  private m_gl: WebGL2RenderingContext;
  private extensions = [];
  public canvas: HTMLCanvasElement;

  constructor(protected container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    const { clientWidth, clientHeight } = this.container;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);

    this.m_gl = throwErrorIfInvalid(this.canvas.getContext('webgl2'));
    this.extensions.forEach(extension => {
      const ext = this.m_gl.getExtension(extension);
      if (!ext) {
        console.log(`failed to get ${extension}`);
      }
    });

    events.attach(new ResizeEvent(this.canvas));
  }

  public update = () => {

  }

  public dispose = () => {

  }

  public get gl() {
    return this.m_gl;
  }

  public get width() {
    return this.container.clientWidth;
  }

  public get height() {
    return this.container.clientHeight;
  }
}