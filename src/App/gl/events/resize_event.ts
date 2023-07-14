import { Camera } from "../camera";
import { Disposable } from "./disposable";
import { WGLEvents } from "./events";
import { EventInfo } from "./event_info";

export class ResizeEvent implements Disposable {
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