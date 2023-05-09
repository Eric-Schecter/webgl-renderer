import { Clock } from './clock';
import { Layer } from './layer';
import { Window } from './window';

export abstract class Application {
  protected window: Window;
  private timer = 0;
  private clock = new Clock();
  protected layers: Layer[] = [];

  constructor(protected container: HTMLElement) {
    this.window = new Window(container);
    this.clock.reset();
  }

  public run = () => {
    this.timer = requestAnimationFrame(this.mainLoop);
  }

  public dispose = () => {
    cancelAnimationFrame(this.timer);
    this.window.dispose();
  }

  public setup = () => { };

  public get gl() {
    return this.window.gl;
  }

  private mainLoop = () => {
    this.clock.update();
    this.window.updata();
    this.layers.forEach(layer => layer.update(this.clock.current));
    this.timer = requestAnimationFrame(this.mainLoop);
  }
}