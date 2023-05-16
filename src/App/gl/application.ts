import { Camera } from './camera';
import { Clock } from './clock';
import { Disposable, EventInfo, WGLEvents } from './events';
import { Layer } from './layer';
import { WGLWindow } from './window';

class ResizeEvent implements Disposable {
  constructor(private canvas: HTMLCanvasElement, private camera: Camera) {
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
      this.camera.updateAspect(this.canvas.width / this.canvas.height);
    }
  }
}

export abstract class Application {
  protected window: WGLWindow;
  private timer = 0;
  private clock = new Clock();
  private events: Disposable[] = [];
  protected camera: Camera;
  protected layers: Layer[] = [];

  constructor(protected container: HTMLElement) {
    this.window = new WGLWindow(container);
    this.camera = new Camera();
    this.events.push(new ResizeEvent(this.window.canvas, this.camera));
    this.clock.reset();
  }

  public run = () => {
    this.timer = requestAnimationFrame(this.mainLoop);
  }

  public dispose = () => {
    cancelAnimationFrame(this.timer);
    this.events.forEach(event => event.dispose());
    WGLEvents.getInstance().dispose();
  }

  public setup = () => { };

  public get gl() {
    return this.window.gl;
  }

  private mainLoop = () => {
    this.clock.update();
    this.window.update();
    WGLEvents.getInstance().update();
    this.layers.forEach(layer => layer.visible && layer.update(this.clock.current));
    this.timer = requestAnimationFrame(this.mainLoop);
  }
}