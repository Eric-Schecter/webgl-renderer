import { Application } from "../../gl";
import { TriangleLayer } from "./triangle_layer";

export class TriangleDemo extends Application {
  constructor(container: HTMLDivElement) {
    super(container);

    this.layers.push(new TriangleLayer(this.gl,this.window));
  }

}