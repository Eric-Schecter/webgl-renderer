import { vec3 } from "gl-matrix";
import { Application } from "../../gl";
import { OrbitControl } from "../../gl/orbit_control";
import { ClipPlaneStencilLayer } from "./layers";
import { Mesh } from "./mesh";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';

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

    loader.loadAsync('models/internal_combustion_engine/model.gltf')
      .then(gltf => {
        const { attributes: { position, normal }, index } = (gltf.scene.children[0] as THREE.Mesh).geometry;
        if (index)
          clipPlaneLayer.mesh = new Mesh(
            this.gl,
            position.array as Uint16Array,
            normal.array as Int8Array,
            index.array as Uint32Array
          );
      })

  }
}