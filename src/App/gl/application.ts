import { Lights } from '../examples/lights/lights';
import { Camera } from './camera';
import { PerspectiveCamera } from './camera';
import { Clock } from './clock';
import { Disposable, ResizeEvent, WGLEvents } from './events';
import { Layer } from './layer';
import { WGLWindow } from './window';

export abstract class Application {
  protected window: WGLWindow;
  private timer = 0;
  private clock = new Clock();
  private events: Disposable[] = [];
  protected layers: Layer[] = [];
  protected lights = new Lights();

  constructor(protected container: HTMLElement, protected camera: Camera = new PerspectiveCamera()) {
    this.window = new WGLWindow(container);
    this.events.push(new ResizeEvent(this.window.canvas, this.camera));
    // this.events.push(new CaptureEvent(this.window.canvas, this.render));
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

  private render = () => {
    this.layers.forEach(layer => layer.visible && layer.render(this.clock.current));
  }

  private mainLoop = () => {
    this.clock.update();
    this.window.update();
    WGLEvents.getInstance().update();

    this.lights.update(this.layers);
    this.render();

    this.timer = requestAnimationFrame(this.mainLoop);
  }
}