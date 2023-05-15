import { WGLEvents, Disposable, EventInfo } from "./events";
import { throwErrorIfInvalid } from "./utils";

class ResizeEvent implements Disposable {
  constructor(private canvas: HTMLCanvasElement) {
    WGLEvents.getInstance().register('resize', window, this.resize);
    window.addEventListener('resize', () => WGLEvents.getInstance().dispatch(new EventInfo('resize', window)));
  }

  public dispose = () => {
    WGLEvents.getInstance().unregister('resize', window, this.resize);
    window.removeEventListener('resize', () => WGLEvents.getInstance().dispatch(new EventInfo('resize', window)));
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
  private m_canvas: HTMLCanvasElement;
  private event: Disposable;

  constructor(protected container: HTMLElement) {
    this.m_canvas = document.createElement('canvas');
    const { clientWidth, clientHeight } = this.container;
    this.m_canvas.width = clientWidth;
    this.m_canvas.height = clientHeight;
    this.m_canvas.style.width = '100%';
    this.m_canvas.style.height = '100%';
    this.container.appendChild(this.m_canvas);

    this.m_gl = throwErrorIfInvalid(this.m_canvas.getContext('webgl2'));
    this.extensions.forEach(extension => {
      const ext = this.m_gl.getExtension(extension);
      if (!ext) {
        console.log(`failed to get ${extension}`);
      }
    });

    this.event = new ResizeEvent(this.m_canvas);
  }

  public update = () => {

  }

  public dispose = () => {
    this.event.dispose();
  }

  public get gl() {
    return this.m_gl;
  }

  public get canvas() {
    return this.m_canvas;
  }

  public get width() {
    return this.container.clientWidth;
  }

  public get height() {
    return this.container.clientHeight;
  }
}