import { WGLEvent } from "./event";

// todo: consider Singleton
export class WGLEvents {
  private observers: WGLEvent[] = [];
  public attach = (event: WGLEvent) => {
    event.setup();
    this.observers.push(event);
  }
  public detach = (event: WGLEvent) => {
    const index = this.observers.indexOf(event);
    if (index >= 0) {
      this.observers[index].dispose();
      this.observers.splice(index, 1);
    }
  }
  public dispose = () => {
    this.observers.forEach(observer => observer.dispose());
    this.observers = [];
  }
}

export const events = new WGLEvents();