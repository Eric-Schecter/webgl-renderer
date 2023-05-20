import { vec3 } from "gl-matrix";
import { Application, GLTFLoader, Layer, OrbitControl, PerspectiveCamera } from "../../gl";
import { GUIHandler, RadioFolder } from "../../gui";
import { EdgeLayer, ModelLayer, OutlineLayer, SurfaceWireframeLayer, TransparentLayer, WireframeDepthLayer, WireframeLayer } from "./layers";
import { Mesh } from "./mesh";
import { MeshWireframeLayer } from "./layers";

export class DisplayModeDemo extends Application {
  private control: OrbitControl;
  constructor(container: HTMLDivElement) {
    super(container);

    const fov = Math.PI * 60 / 180;
    const aspect = this.window.width / this.window.height;
    const near = 0.1;
    const far = 1000;
    const target = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    // (this.camera as OrthographicCamera).setProjection(2, 2, aspect, near, far)
    (this.camera as PerspectiveCamera).setProjection(fov, aspect, near, far);

    this.control = new OrbitControl(this.window.canvas, this.camera, target, up, 4, Math.PI / 3, Math.PI / 8);
    this.control.updateViewMatrix();

    const meshLayer = new ModelLayer(this.gl, this.window, this.control);
    const wireframeLayer = new WireframeLayer(this.gl, this.window, this.control, false);
    const meshWireframeLayer = new MeshWireframeLayer(this.gl, this.window, this.control, false);
    const transparentLayer = new TransparentLayer(this.gl, this.window, this.control, false);
    const surfaceWireframeLayer = new SurfaceWireframeLayer(this.gl, this.window, this.control, false);
    const outlineLayer = new OutlineLayer(this.gl, this.window, this.control, false);
    const wireframeDepthLayer = new WireframeDepthLayer(this.gl, this.window, this.control, false);
    const edgeLayer = new EdgeLayer(this.gl, this.window, this.control, false);
    this.layers.push(
      meshLayer,
      wireframeLayer,
      meshWireframeLayer,
      transparentLayer,
      surfaceWireframeLayer,
      outlineLayer,
      wireframeDepthLayer,
      edgeLayer,
    );

    new GLTFLoader().load('models/DamagedHelmet/DamagedHelmet.gltf')
      .then((model) => {
        const { positions, indices, normals } = model[0];
        const mesh = new Mesh(this.gl, Array.from(positions), Array.from(indices), Array.from(normals));
        meshLayer.mesh = mesh;
        wireframeLayer.mesh = mesh;
        meshWireframeLayer.mesh = mesh;
        transparentLayer.mesh = mesh;
        surfaceWireframeLayer.mesh = mesh;
        outlineLayer.mesh = mesh;
        wireframeDepthLayer.mesh = mesh;
        edgeLayer.mesh = mesh;
      })

    const disableOthers = (selectedLayer: Layer) => {
      this.layers.forEach(layer => layer.visible = layer === selectedLayer);
    }

    const folder = GUIHandler.getInstance().createFolder('modes', RadioFolder);
    folder.addItem('mesh', () => disableOthers(meshLayer), true);
    folder.addItem('wireframe', () => disableOthers(wireframeLayer), false);
    folder.addItem('mesh+wireframe', () => disableOthers(meshWireframeLayer), false);
    folder.addItem('transparent', () => disableOthers(transparentLayer), false);
    folder.addItem('surface wireframe - zbuffer', () => disableOthers(surfaceWireframeLayer), false);
    folder.addItem('outline - stencil', () => disableOthers(outlineLayer), false);
    folder.addItem('wireframe depth - framebuffer', () => disableOthers(wireframeDepthLayer), false);
    folder.addItem('edge detection', () => disableOthers(edgeLayer), false);
  }

}