import { Lights } from '../examples/lights/lights';
import { Camera } from './camera';
import { PerspectiveCamera } from './camera';
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
  protected layers: Layer[] = [];
  protected lights = new Lights();

  constructor(protected container: HTMLElement, protected camera: Camera = new PerspectiveCamera()) {
    this.window = new WGLWindow(container);
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

    // solution 1:
    // // state update
    // objects.forEach(object=>object.update())
    // lights.forEach(light=>light.update())
    // // shadow pass
    // lights.forEach(light=>light.render(objects)
    // // render pass
    // objects.forEach(object=>object.render(lights))

    // solution 2:
    // entities.forEach(entity=>entity.updateMovement())
    // entities.forEach(entity=>entity.updateShadow())
    // entities.forEach(entity=>entity.render())
    
    this.lights.update(this.layers);
    this.layers.forEach(layer => layer.visible && layer.update(this.clock.current));
    this.layers.forEach(layer => layer.visible && layer.render());

    this.timer = requestAnimationFrame(this.mainLoop);
  }
}