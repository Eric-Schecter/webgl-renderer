import { Disposable } from "./disposable";
import { EventInfo } from "./event_info";
import { WGLEvents } from "./events";

export class CaptureEvent implements Disposable {
  constructor(private canvas: HTMLCanvasElement, private cb: () => void) {
    WGLEvents.getInstance().register('click', this.canvas, this.capture);
    canvas.addEventListener('click', () => WGLEvents.getInstance().dispatch(new EventInfo('click', this.canvas)));
  }

  public dispose = () => {
    WGLEvents.getInstance().unregister('click', this.canvas, this.capture);
    this.canvas.removeEventListener('click', () => WGLEvents.getInstance().dispatch(new EventInfo('click', this.canvas)));
  };

  private capture = () => {
    this.cb();
    this.canvas.toBlob((blob) => {
      if (!blob) {
        console.log('no data in canvas');
        return;
      }
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'capture';
      a.click();
      document.body.removeChild(a);
    });
  }
}