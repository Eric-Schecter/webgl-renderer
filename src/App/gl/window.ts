import { throwErrorIfInvalid } from "./utils";

export class WGLWindow {
  private m_gl: WebGL2RenderingContext;
  private extensions = [
    // 'EXT_color_buffer_float',
  ];
  private m_canvas: HTMLCanvasElement;

  constructor(protected container: HTMLElement) {
    this.m_canvas = document.createElement('canvas');
    const { clientWidth, clientHeight } = this.container;
    this.m_canvas.width = clientWidth;
    this.m_canvas.height = clientHeight;
    this.m_canvas.style.width = '100%';
    this.m_canvas.style.height = '100%';
    this.container.appendChild(this.m_canvas);

    this.m_gl = throwErrorIfInvalid(this.m_canvas.getContext('webgl2', { stencil: true, antialias: false }));
    this.extensions.forEach(extension => {
      const ext = this.m_gl.getExtension(extension);
      if (!ext) {
        console.log(`failed to get ${extension}`);
      }
    });
  }

  public update = () => {

  }

  public dispose = () => {

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