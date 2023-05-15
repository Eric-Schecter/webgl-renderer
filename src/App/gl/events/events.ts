import { Disposable } from "./disposable";
import { EventInfo } from "./event_info";

// implement Event Bus to handle events
export class WGLEvents implements Disposable {
  private observers: { [prop: string]: Function[] } = {};
  private events: EventInfo[] = [];

  private static instance?: WGLEvents;
  private constructor() { }
  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new WGLEvents();
    }
    return this.instance;
  }
  public update = () => {
    while (this.events.length > 0) {
      const { type, data } = this.events.pop() as EventInfo;
      this.observers[type]?.forEach(fn => fn(data));
    }
  }
  public dispatch = (eventInfo: EventInfo) => {
    this.events.push(eventInfo);
  }
  public register = (type: string, dispatcher: Object, fn: Function) => {
    if (!this.observers[type + dispatcher.toString()]) {
      this.observers[type + dispatcher.toString()] = [];
    }
    this.observers[type + dispatcher.toString()].push(fn);
  }
  public unregister = (type: string, dispatcher: Object, fn: Function) => {
    const index = this.observers[type + dispatcher.toString()]?.indexOf(fn);
    if (index >= 0) {
      this.observers[type + dispatcher.toString()].splice(index, 1);
    }
    if (this.observers[type + dispatcher.toString()].length === 0) {
      delete this.observers[type + dispatcher.toString()];
    }
  }
  public dispose = () => {
    this.events = [];
    this.observers = {};
    // todo: unregister events
  }
}