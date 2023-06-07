import { vec3 } from "gl-matrix";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';
import { Application, TypedArray } from "../../gl";
import { OrbitControl } from "../../gl/orbit_control";
import { ClipPlaneStencilLayer } from "./layers";
import { LargeMesh } from "./mesh";

export class ClipPlaneDemo extends Application {
  private control: OrbitControl;
  constructor(container: HTMLDivElement) {
    super(container);

    const fov = Math.PI * 60 / 180;
    const aspect = this.window.width / this.window.height;
    const near = 0.1;
    const far = 1000;
    const target = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);

    this.camera.setProjection(fov, aspect, near, far);

    this.control = new OrbitControl(this.window.canvas, this.camera, target, up, 4, Math.PI / 3, Math.PI / 8);
    this.control.updateViewMatrix();

    // const clipPlaneLayer = new ClipPlaneLayer(this.gl, this.window, this.control)
    // this.layers.push(clipPlaneLayer);

    const clipPlaneLayer = new ClipPlaneStencilLayer(this.gl, this.window, this.control)
    this.layers.push(clipPlaneLayer);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    // const src = 'models/DamagedHelmet/DamagedHelmet.gltf';
    // loader.loadAsync(src)
    //   .then(gltf => {
    //     const { attributes: { position, normal }, index } = (gltf.scene.children[0] as THREE.Mesh).geometry;
    //     if (index)
    //       clipPlaneLayer.mesh = new HelmetMesh(
    //         this.gl,
    //         position.array as TypedArray,
    //         normal.array as TypedArray,
    //         index.array as TypedArray
    //       );
    //   })

    const src = 'models/internal_combustion_engine/model.gltf';
    loader.loadAsync(src)
      .then(gltf => {
        const { attributes: { position, normal }, index } = (gltf.scene.children[0] as THREE.Mesh).geometry;
        if (index)
          clipPlaneLayer.mesh = new LargeMesh(
            this.gl,
            position.array as TypedArray,
            normal.array as TypedArray,
            index.array as TypedArray
          );
      })
  }
}