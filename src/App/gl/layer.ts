import { AbstractMesh } from "./mesh";
import { WGLWindow } from "./window";

export abstract class Layer {
  public mesh?: AbstractMesh;
  constructor(protected window: WGLWindow, public visible = true) { }
  // public update = (time: number) => { };
  public abstract render(time:number): void;
}