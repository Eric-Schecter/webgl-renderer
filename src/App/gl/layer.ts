import { WGLWindow } from "./window";

export abstract class Layer {
  constructor(protected window: WGLWindow, public visible = true) { }
  abstract update(time: number): void;
}