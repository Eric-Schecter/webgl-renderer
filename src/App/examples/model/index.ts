import { Application } from "../../gl";
import { ModelLayer } from "./model_layer";

export class ModelDemo extends Application {
  constructor(container: HTMLDivElement) {
    super(container);

    this.layers.push(new ModelLayer(this.gl, this.window));
  }

}