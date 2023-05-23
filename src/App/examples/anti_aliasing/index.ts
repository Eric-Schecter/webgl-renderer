import { Application} from "../../gl";
import { TriangleLayer } from "./layers";

// class PostProcess {
//   private renderpasses: RenderPass[] = [];
//   private index = 0;
//   constructor(gl: WebGL2RenderingContext, width: number, height: number) {
//     this.renderpasses = [
//       new ColorRenderPass(gl, width, height),
//       new ColorRenderPass(gl, width, height),
//     ];

//   }
//   public render = () => {
//     const length = this.renderpasses.length;
//     const renderpassForRead = this.renderpasses[this.index];
//     const renderpassForWrite = this.renderpasses[(this.index + 1) % length];


//     this.index++;
//   }
// }

export class AntiAliasingDemo extends Application {
  constructor(container: HTMLDivElement) {
    super(container);

    const triangleLayer = new TriangleLayer(this.gl, this.window);
    this.layers.push(triangleLayer);
  }
}