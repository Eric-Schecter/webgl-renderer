import { GLTFReader, IMesh } from './reader';

export class GLTFLoader {
  public load = async (url: string) => {

    const data = await this.loadModel(url);

    if (!data) {
      return [];
    }

    const reader = new GLTFReader(data);

    return reader.read() as IMesh[]; // just consider mesh for now
  }

  private loadModel = async (filename: string) => {
    const ext = this._getFileExtension(filename);

    if (ext === '.gltf') {
      const binFile = filename.replace(ext, '.bin');

      const gltfResponse = await fetch(filename);
      const json = await gltfResponse.json();

      const binResponse = await fetch(binFile);
      const body = await binResponse.arrayBuffer();

      return { json, body };
    }

    if (ext === '.glb') {
      const gltfResponse = await fetch(filename);

      const data = await gltfResponse.arrayBuffer();

      return data;
    }

    console.log('file type is not supported.')
  }

  private _getFileExtension = (fileName: string): string => {
    const lastDotIdx = fileName.lastIndexOf('.');
    return fileName.substring(lastDotIdx);
  };
}