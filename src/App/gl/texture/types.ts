import { Texture } from "./texture";

export type PBRTextures = {
  baseColorTexture?: Texture,
  normalTexture?: Texture,
  metallicRoughnessTexture?: Texture,
  occlusionTexture?: Texture,
  emissiveTexture?: Texture,
}