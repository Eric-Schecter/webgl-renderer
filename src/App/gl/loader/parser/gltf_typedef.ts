/* eslint-disable @typescript-eslint/naming-convention */

/** gltf interface definition */
export enum EN_COMPONENT_TYPE {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
}

export type ITypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array;

export interface IGLTFAccessor {
    bufferView?: number;
    byteOffset?: number;
    componentType: EN_COMPONENT_TYPE;
    normalized?: boolean;
    name?: string;
    count: number;
    max?: number[];
    min?: number[];
    type: 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4';
    extras?: Record<string, string | boolean>;
}

export interface IGLTFAsset {
    generator?: string;
    version: string;
}

export interface IGLTFBufferView {
    buffer: number;
    byteOffset?: number;
    byteLength: number;
    byteStride?: number;
    target?: number;
    name?: string;
    extras?: Record<string, string | boolean>;
}

export interface IGLTFBuffer {
    uri?: string;
    byteLength: number;
    name?: string;
    extras?: Record<string, string | boolean>;
}

export interface IPBRMetallicRoughness {
    baseColorFactor?: [number, number, number, number];
    metallicFactor?: number;
    roughnessFactor?: number;
}

export interface IGLTFMaterial {
    name?: string;
    doubleSided?: boolean;
    pbrMetallicRoughness: IPBRMetallicRoughness;
    extras?: Record<string, string | boolean>;
}

export enum EN_PRIMITIVE_MODE {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6,
}

export interface IGLTFAttribute {
    POSITION?: number;
    NORMAL?: number;
    TANGENT?: number;
    TEXCOORD_0?: number;
    COLOR_n?: number;
}

export interface IGLTFMeshPrimitive {
    attributes: IGLTFAttribute;
    indices?: number;
    material?: number;
    mode?: EN_PRIMITIVE_MODE; // default should be 4
    extras?: Record<string, string | boolean>;

    extensions?: { KHR_draco_mesh_compression: { bufferView: number; attributes: IGLTFAttribute } };
}

export interface IGLTFMesh {
    primitives: IGLTFMeshPrimitive[];
    name?: string;
    extras?: Record<string, string | boolean>;
}

export interface IGLTFScene {
    name?: string;
    nodes?: number[];
    extras?: Record<string, string | boolean>;
}

export interface IGLTFNode {
    mesh?: number;
    children?: number[];
    name?: string;
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    translation?: [number, number, number];
    matrix?: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ];
    extras?: Record<string, string | boolean>;
}

export interface ISampler {
    magFilter?: number;
    minFilter?: number;
    warpS?: number;
    wrapT?: number;
}

export interface IRawTexture {
    sampler: number;
    source: number;
}

export interface ITexture {
    sampler: number;
    image: string;
}

export interface IGLTFJSON {
    accessors: IGLTFAccessor[];
    asset: IGLTFAsset;
    bufferViews: IGLTFBufferView[];
    buffers: IGLTFBuffer[];
    materials: IGLTFMaterial[];
    meshes: IGLTFMesh[];
    nodes: IGLTFNode[];
    scene: number;
    scenes: IGLTFScene[];
    images: { uri: string }[];
    samplers: ISampler[];
    textures: IRawTexture[];
}

export interface IGLTFExtensions {
    KHR_binary_glTF: {
        body: ArrayBuffer;
    };
}

/** ======================================== start 最终要转化出来的gltf数据 */

export interface IGLTFBufferAccessor {
    buffer: ArrayBuffer;
    byteOffset?: number;
    byteLength: number;
    byteStride?: number;
    bufferView: IGLTFBufferView;
    type: 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4';
    componentType: EN_COMPONENT_TYPE;
    normalized?: boolean;
    count: number;
}

export interface IGLTFBufferAttibutes {
    POSITION?: IGLTFBufferAccessor;
    NORMAL?: IGLTFBufferAccessor;
    TANGENT?: IGLTFBufferAccessor;
    TEXCOORD_n?: IGLTFBufferAccessor;
    COLOR_n?: IGLTFBufferAccessor;
}

export type IMatrix = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
];

export type IGLTFRenderPrimitive = IGLTFMeshPrimitive & { transforms: IMatrix[] };

export interface IGLTFRenderObject {
    transforms: IMatrix[];
    attributes: IGLTFBufferAttibutes;
    indices?: IGLTFBufferAccessor;
    material?: IGLTFMaterial;
    mode?: EN_PRIMITIVE_MODE; // default should be 4
    images?: string[];
    samplers?: ISampler[];
    textures: IRawTexture[];
}

/** 最终要转化出来的gltf数据 end ======================================== */
