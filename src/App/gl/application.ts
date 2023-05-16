import { Clock } from './clock';
import { WGLEvents } from './events';
import { Layer } from './layer';
import { WGLWindow } from './window';

export abstract class Application {
  protected window: WGLWindow;
  private timer = 0;
  private clock = new Clock();
  protected layers: Layer[] = [];

  constructor(protected container: HTMLElement) {
    this.window = new WGLWindow(container);
    this.clock.reset();
  }

  public run = () => {
    this.timer = requestAnimationFrame(this.mainLoop);
  }

  public dispose = () => {
    cancelAnimationFrame(this.timer);
    this.window.dispose();
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