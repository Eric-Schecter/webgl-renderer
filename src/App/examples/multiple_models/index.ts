import { vec3 } from "gl-matrix";
import { Application, GLTFLoader, OrbitControl, PerspectiveCamera } from "../../gl";
import { ITexture } from "../../gl/loader/parser";
import { Texture } from "../../gl/texture";
import { ModelLayer } from "./layers";
import { Mesh } from "./mesh";

export class MultipleModelsDemo extends Application {
  private control: OrbitControl;
  constructor(container: HTMLDivElement) {
    super(container);

    const fov = Math.PI * 60 / 180;
    const aspect = this.window.width / this.window.height;
    const near = 0.1;
    const far = 1000;
    const target = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    (this.camera as PerspectiveCamera).setProjection(fov, aspect, near, far);

    this.control = new OrbitControl(this.window.canvas, this.camera, target, up, 4, Math.PI / 3, Math.PI / 8);
    this.control.updateViewMatrix();

    const meshLayer = new ModelLayer(this.gl, this.window, this.control);
    this.layers.push(
      meshLayer,
    );

    const modelPath = 'models/DamagedHelmet/DamagedHelmet.gltf';
    const folderPath = modelPath.slice(0, modelPath.lastIndexOf('/'));
    console.log(folderPath)
    new GLTFLoader().load(modelPath)
      .then((model) => {
        const { positions, indices, normals, uvs, tangents, bitangents, textures } = model[0];
        const mesh = new Mesh(
          this.gl,
          Array.from(positions),
          Array.from(indices),
          Array.from(normals),
          Array.from(uvs),
          Array.from(tangents),
          Array.from(bitangents),
        );
        meshLayer.meshes.push(mesh);

        meshLayer.pbrTextures.baseColorTexture = new Texture(this.gl, folderPath + '/' + (textures?.baseColorTexture as ITexture).image);
        meshLayer.pbrTextures.normalTexture = new Texture(this.gl, folderPath + '/' + (textures?.normalTexture as ITexture).image);
        meshLayer.pbrTextures.metallicRoughnessTexture = new Texture(this.gl, folderPath + '/' + (textures?.metallicRoughnessTexture as ITexture).image);
        meshLayer.pbrTextures.occlusionTexture = new Texture(this.gl, folderPath + '/' + (textures?.occlusionTexture as ITexture).image);
        meshLayer.pbrTextures.emissiveTexture = new Texture(this.gl, folderPath + '/' + (textures?.emissiveTexture as ITexture).image);
      })
  }

}