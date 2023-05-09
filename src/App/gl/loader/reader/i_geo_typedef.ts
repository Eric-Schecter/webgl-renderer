import { IMatrix, ITexture } from '../parser';

export enum EN_GLTF_GEOMETRY_TYPE {
    POINTS,
    LINES,
    MESH,
}

export interface IXYZ {
    x: number;
    y: number;
    z: number;
}

export interface IGeometry<T extends EN_GLTF_GEOMETRY_TYPE = EN_GLTF_GEOMETRY_TYPE> {
    type: T;
    color?: number;
    matrix?: IMatrix;
}

export interface IPoints extends IGeometry<EN_GLTF_GEOMETRY_TYPE.POINTS> {
    data: IXYZ[];
}

export interface ILine {
    start: IXYZ;
    end: IXYZ;
}
export interface ILines extends IGeometry<EN_GLTF_GEOMETRY_TYPE.LINES> {
    lines: ILine[];
}

// PBR texture struct
export interface IPBRTexture {
    baseColorFactor?: number[];
    emissiveFactor?: number[];
    emissiveTexture?: ITexture;
    normalTexture?: ITexture;
    occlusionTexture?: ITexture;
    baseColorTexture?: ITexture;
    metallicRoughnessTexture?: ITexture;
}

export interface IMesh extends IGeometry<EN_GLTF_GEOMETRY_TYPE.MESH> {
    positions: Float32Array;
    indices: Uint32Array;
    normals: Float32Array;
    uvs: Float32Array;
    metalness?: number;
    roughness?: number;
    textures?: IPBRTexture;
}
