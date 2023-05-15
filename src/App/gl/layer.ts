import { WGLWindow } from "./window";

export abstract class Layer {
  constructor(protected window: WGLWindow) { }
  abstract update(time: number): void;
}