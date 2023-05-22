import { vec2, vec3 } from 'gl-matrix';
import {
    IGLTFBufferAccessor,
    IGLTFRenderObject,
    IPBRMetallicRoughness,
    WEBGL_COMPONENT_TYPES,
    WEBGL_CONSTANTS,
    WEBGL_TYPE_SIZES,
    GLTFParser,
    IGLTFParserCtorParams,
    IGLTFJSON,
    multiplyMatrices,
    ITypedArray,
    IGLTFMaterial,
    ISampler,
    // ITexture,
} from '../parser';
import { EN_GLTF_GEOMETRY_TYPE, IGeometry, ILine, ILines, IMesh, IPBRTexture, IPoints, IXYZ } from './i_geo_typedef';

export type { IGLTFParserCtorParams, IGLTFJSON };

export class GLTFReader {
    private _parser: GLTFParser;

    constructor(data: IGLTFParserCtorParams) {
        this._parser = new GLTFParser(data);
    }

    public read(): IGeometry[] {
        const renderObjects = this._parser.parse();

        const result = [] as IGeometry[];

        for (const renderObject of renderObjects) {
            const { mode } = renderObject;
            if (mode === WEBGL_CONSTANTS.POINTS) {
                const pts = this._readPoints(renderObject);
                result.push(pts);
            }

            if (mode === WEBGL_CONSTANTS.LINE_STRIP) {
                const lines = this._readLines(renderObject);
                result.push(lines);
            }

            if (mode === WEBGL_CONSTANTS.TRIANGLES || mode === undefined) {
                const lines = this._readMesh(renderObject);
                result.push(lines);
            }
        }

        return result;
    }

    private _readPoints(renderObject: IGLTFRenderObject): IPoints {
        const { attributes, material: materialDef, transforms } = renderObject;

        const matrix = multiplyMatrices(transforms);
        const { POSITION } = attributes;

        if (!POSITION) {
            throw new Error(`point can't be empty`);
        }
        const positions = this._loadAttribute(POSITION);

        const color = this._getColor(materialDef?.pbrMetallicRoughness?.baseColorFactor);

        const data = [] as IXYZ[];
        for (let i = 0; i < positions.length - 3; i += 3) {
            const x = positions[i + 0];
            const y = positions[i + 1];
            const z = positions[i + 2];
            data.push({ x, y, z });
        }

        return { data, color, type: EN_GLTF_GEOMETRY_TYPE.POINTS, matrix };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private _readLines(renderObject: IGLTFRenderObject): ILines {
        const { attributes, material: materialDef, transforms } = renderObject;
        const matrix = multiplyMatrices(transforms);
        const { POSITION } = attributes;
        if (!POSITION) {
            throw new Error(`point can't be empty`);
        }
        const positions = this._loadAttribute(POSITION);

        const lines = [] as ILine[];
        for (let i = 0; i < positions.length - 3; i += 3) {
            const p11 = positions[i + 0];
            const p12 = positions[i + 1];
            const p13 = positions[i + 2];

            const p21 = positions[i + 3];
            const p22 = positions[i + 4];
            const p23 = positions[i + 5];

            lines.push({
                start: { x: p11, y: p12, z: p13 },
                end: { x: p21, y: p22, z: p23 },
            });
        }

        const color = this._getColor(materialDef?.pbrMetallicRoughness?.baseColorFactor);

        return { lines, color, type: EN_GLTF_GEOMETRY_TYPE.LINES, matrix };
    }

    private _parseImages(res: IPBRTexture, material?: IGLTFMaterial, images?: string[], samplers?: ISampler[], textures?: ITexture[]) {
        if (!material || !images || !textures) {
            return;
        }
        // eslint-disable-next-line guard-for-in
        for (const key in material) {
            const value = material[key];
            if (Array.isArray(value)) {
                res[key] = value;
            } else if (typeof value === 'object') {
                if (value.index !== undefined) {
                    const { source, sampler } = textures[value.index];
                    res[key] = {
                        image: images[source],
                        sampler: samplers && samplers[sampler],
                    };
                } else {
                    this._parseImages(res, value, images, samplers, textures);
                }
            }
        }
    }

    private _generateTangents(pos: number[], uvs: number[], index: number[]) {
        const tangentsArray = new Array(index.length).fill(0);
        const bitangentsArray = new Array(index.length).fill(0);
        for (let i = 0; i < index.length; i += 3) {
            const index1 = index[i];
            const index2 = index[i] + 1;
            const index3 = index[i] + 2;
            const pos1 = vec3.fromValues(pos[index1], pos[index1 + 1], pos[index1 + 2]);
            const pos2 = vec3.fromValues(pos[index2], pos[index2 + 1], pos[index2 + 2]);
            const pos3 = vec3.fromValues(pos[index3], pos[index3 + 1], pos[index3 + 2]);
            const uv1 = vec2.fromValues(uvs[index1], uvs[index1 + 1]);
            const uv2 = vec2.fromValues(uvs[index2], uvs[index2 + 1]);
            const uv3 = vec2.fromValues(uvs[index3], uvs[index3 + 1]);
            const edge1 = vec3.subtract(vec3.create(), pos2, pos1);
            const edge2 = vec3.subtract(vec3.create(), pos3, pos1);
            const deltaUV1 = vec2.subtract(vec2.create(), uv2, uv1);
            const deltaUV2 = vec2.subtract(vec2.create(), uv3, uv1);
            const f = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

            tangentsArray[index1] += f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
            tangentsArray[index2] += f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
            tangentsArray[index3] += f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

            bitangentsArray[index1] += f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
            bitangentsArray[index2] += f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
            bitangentsArray[index3] += f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);
        }
        const tangents = new Float32Array(tangentsArray);
        const bitangents = new Float32Array(bitangentsArray);
        return { tangents, bitangents };
    }

    private _readMesh(renderObject: IGLTFRenderObject): IMesh {
        const { attributes, indices: indicesBufferAccessor, material: materialDef, transforms, images, samplers, textures } = renderObject;
        const matrix = multiplyMatrices(transforms);
        const { POSITION, NORMAL, TEXCOORD_n } = attributes;
        if (!POSITION) {
            throw new Error(`point can't be empty`);
        }

        const verts = this._loadAttribute(POSITION);
        const texcoords = TEXCOORD_n ? this._loadAttribute(TEXCOORD_n) : [];
        const positions = new Float32Array(verts);
        const idxValues = indicesBufferAccessor ? this._loadAttribute(indicesBufferAccessor) : new Uint32Array();
        const indices = new Uint32Array(idxValues);
        const norms = NORMAL ? this._loadAttribute(NORMAL) : new Float32Array();
        const normals = new Float32Array(norms);
        const uvs = new Float32Array(texcoords);
        const { tangents, bitangents } = this._generateTangents(Array.from(positions), Array.from(uvs), Array.from(idxValues));
        const { color, metalness, roughness } = this._getMeshStyle(materialDef?.pbrMetallicRoughness);
        const res = {};
        this._parseImages(res, materialDef, images, samplers, textures);
        return { color, metalness, roughness, type: EN_GLTF_GEOMETRY_TYPE.MESH, normals, positions, indices, uvs, tangents, bitangents, matrix, textures: res };
    }

    private _getMeshStyle(
        pbrMetallicRoughness: IPBRMetallicRoughness | undefined,
    ): { color?: number; metalness?: number; roughness?: number } {
        const color = this._getColor(pbrMetallicRoughness?.baseColorFactor);
        const metallicFactor = pbrMetallicRoughness?.metallicFactor;
        const roughnessFactor = pbrMetallicRoughness?.roughnessFactor;

        if (metallicFactor === undefined && roughnessFactor === undefined) {
            return { color };
        }
        const metalness = metallicFactor || 0.8;
        const roughness = roughnessFactor || 0.4;
        return { color, metalness, roughness };
    }

    private _loadAttribute(bufferAccessor: IGLTFBufferAccessor): ITypedArray {
        const { type, componentType, byteStride, buffer, count } = bufferAccessor;
        const itemSize = WEBGL_TYPE_SIZES[type];
        const TypedArray = WEBGL_COMPONENT_TYPES[componentType];
        const elementBytes = TypedArray.BYTES_PER_ELEMENT;
        const itemBytes = elementBytes * itemSize;
        const byteOffset = bufferAccessor.byteOffset || 0;

        // The buffer is not interleaved if the stride is the item size in bytes.
        if (byteStride && byteStride !== itemBytes) {
            throw new Error('not implemented');
        }

        const array = new TypedArray(buffer, byteOffset, count * itemSize);

        return array;
    }

    private _getColor(colorArray: [number, number, number, number] | undefined): number | undefined {
        if (colorArray) {
            const [r, g, b] = colorArray;
            return this._toHexColor([r, g, b]);
        }
        return undefined;
    }

    private _toHexColor([r, g, b]: [number, number, number]): number {
        const hexR = (r * 255) & 255;
        const hexG = (g * 255) & 255;
        const hexB = (b * 255) & 255;
        return (hexR << 16) | (hexG << 8) | hexB;
    }
}
