import { AbstractMesh } from "./mesh";
import { WGLWindow } from "./window";

export abstract class Layer {
  public mesh?: AbstractMesh;
  constructor(protected window: WGLWindow, public visible = true) { }
  abstract update(time: number): void;
}