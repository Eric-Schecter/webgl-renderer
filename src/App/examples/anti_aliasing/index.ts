import { Application } from "../../gl";
import { TriangleLayer } from "./layers";

export class AntiAliasingDemo extends Application {
  constructor(container: HTMLDivElement) {
    super(container);

    this.layers.push(new TriangleLayer(this.gl,this.window));
  }

}