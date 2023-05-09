/* ============================================================================= 
#
# File: gltf_parser.ts
#
# Author: zhuxiaomin
#
# Date: 2023-03-04 10:33:09
#
# Description: 
============================================================================= */

import { BINARY_EXTENSION_HEADER_MAGIC, EXTENSIONS } from './gltf_const';
import { GLTFBinaryExtension } from './gltf_binary_extension';
import { IGLTFBufferAccessor, IGLTFExtensions, IGLTFJSON, IGLTFRenderPrimitive, IMatrix, IGLTFRenderObject } from './gltf_typedef';
import { DracoPrimitiveDecoder } from './draco_primitive_decoder';

export interface IStandardGLTF {
    body: ArrayBuffer;
    json: IGLTFJSON;
}

export type IGLTFParserCtorParams = ArrayBuffer | IStandardGLTF;

export class GLTFParser {
    private _json: IGLTFJSON;

    private _extensions: IGLTFExtensions;

    private _invalidVersion = false;

    private _dracoPrimitiveDecoder = new DracoPrimitiveDecoder();

    // key：byteOffset-byteLength value: arraybuffer
    private _cachedBufferMap = new Map<string, ArrayBuffer>();

    constructor(data: IGLTFParserCtorParams) {
        if (data instanceof ArrayBuffer) {
            const magic = new TextDecoder().decode(new Uint8Array(data, 0, 4));
            if (magic !== BINARY_EXTENSION_HEADER_MAGIC) {
                this._invalidVersion = true;
                return;
            }
            const binaryExtension = new GLTFBinaryExtension(data);
            const extensions = {} as IGLTFExtensions;
            // @ts-expect-error TODO
            extensions[EXTENSIONS.KHR_BINARY_GLTF] = binaryExtension;
            const { content } = binaryExtension;

            const json = JSON.parse(content) as IGLTFJSON;

            this._invalidVersion = json.asset === undefined || ~~json.asset.version.charAt(0) < 2;
            this._json = json;
            this._extensions = extensions;
        } else {
            const { json, body } = data;
            this._json = json;
            this._invalidVersion = json.asset === undefined || ~~json.asset.version.charAt(0) < 2;
            const extensions = {} as IGLTFExtensions;
            // @ts-expect-error TODO
            extensions[EXTENSIONS.KHR_BINARY_GLTF] = { body };
            this._extensions = extensions;
        }
    }

    public parse(): IGLTFRenderObject[] {
        if (this._invalidVersion) {
            return [];
        }
        const renderObjects = this._loadScene(0);

        this._cachedBufferMap.clear();

        return renderObjects;
    }

    /** 加载scene */
    private _loadScene(sceneIndex: number): IGLTFRenderObject[] {
        const sceneDef = this._json.scenes[sceneIndex];
        const nodeIds = sceneDef.nodes || [];
        // 加载所有的渲染对象
        const ps = nodeIds.reduce((list, nodeId) => {
            return list.concat(this._traverse(nodeId, []));
        }, [] as IGLTFRenderPrimitive[]);
        const renderObjects = ps.map((p) => this._createRenderObject(p));
        return renderObjects;
    }

    /** 加载buffer */
    private _loadBuffer(bufferIndex: number): ArrayBuffer {
        // const bufferDef = this._json.buffers[bufferIndex];
        // If present, GLB container is required to be the first buffer.
        if (bufferIndex === 0) {
            return this._extensions.KHR_binary_glTF.body;
        }
        throw new Error('not implemented');
    }

    /** 加载 buffer view */
    private _loadBufferView(bufferViewIndex: number): ArrayBuffer {
        const bufferViewDef = this._json.bufferViews[bufferViewIndex];
        const allBuffer = this._loadBuffer(bufferViewDef.buffer);
        const byteLength = bufferViewDef.byteLength || 0;
        const byteOffset = bufferViewDef.byteOffset || 0;

        // load from cache
        const key = `${byteOffset}-${byteLength}`;
        let cachedBuffer = this._cachedBufferMap.get(key);
        if (cachedBuffer) {
            return cachedBuffer;
        }

        cachedBuffer = allBuffer.slice(byteOffset, byteOffset + byteLength);
        this._cachedBufferMap.set(key, cachedBuffer);
        return cachedBuffer;
    }

    private _createRenderObject(primitive: IGLTFRenderPrimitive): IGLTFRenderObject {
        const { transforms, mode, material: materialIndex, indices: indicesIndex, attributes } = primitive;

        const material = materialIndex === undefined ? undefined : this._json.materials[materialIndex];

        let indices: IGLTFBufferAccessor | undefined;
        let POSITION: IGLTFBufferAccessor | undefined;
        let NORMAL: IGLTFBufferAccessor | undefined;
        let TEXCOORD_n: IGLTFBufferAccessor | undefined;

        if (primitive?.extensions?.KHR_draco_mesh_compression) {
            const { bufferView } = primitive!.extensions!.KHR_draco_mesh_compression;
            const arrayBuffer = this._loadBufferView(bufferView);
            const bufView = this._json.bufferViews[bufferView];
            const ret = this._dracoPrimitiveDecoder.decode(bufView, primitive, arrayBuffer, this._json.accessors);
            indices = ret.indices;
            POSITION = ret.POSITION;
            NORMAL = ret.NORMAL;
            TEXCOORD_n = ret.TEXCOORD_0;
        } else {
            indices = indicesIndex !== undefined ? this._loadAccessor(indicesIndex) : undefined;
            POSITION = attributes.POSITION !== undefined ? this._loadAccessor(attributes.POSITION) : undefined;
            NORMAL = attributes.NORMAL !== undefined ? this._loadAccessor(attributes.NORMAL) : undefined;
            TEXCOORD_n = attributes.TEXCOORD_0 ? this._loadAccessor(attributes.TEXCOORD_0) : undefined;
        }

        const TANGENT = attributes.TANGENT !== undefined ? this._loadAccessor(attributes.TANGENT) : undefined;
        const COLOR_n = attributes.COLOR_n !== undefined ? this._loadAccessor(attributes.COLOR_n) : undefined;

        return {
            transforms,
            mode,
            material,
            indices,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            attributes: { POSITION, NORMAL, TANGENT, TEXCOORD_n, COLOR_n },
            images: this._json.images?.map((image) => image.uri),
            samplers: this._json.samplers,
            textures: this._json.textures,
        };
    }

    private _loadAccessor(index: number): IGLTFBufferAccessor | undefined {
        const accessorDef = this._json.accessors[index];
        const { bufferView: bufferViewIndex, componentType, normalized, count, type, byteOffset } = accessorDef;

        if (bufferViewIndex === undefined) {
            // Ignore empty accessors, which may be used to declare runtime
            // information about attributes coming from another source (e.g. Draco
            // compression extension).
            console.warn('accessor bufferView is empty');
            return undefined;
        }

        const buffer = this._loadBufferView(bufferViewIndex);
        const { byteLength, byteStride } = this._json.bufferViews[bufferViewIndex];

        return {
            bufferView: this._json.bufferViews[bufferViewIndex],
            buffer,
            byteOffset,
            byteLength,
            byteStride,
            type,
            componentType,
            normalized,
            count,
        };
    }

    /** 转换为平铺结构 */
    private _traverse(nodeId: number, parentMatrixs: IMatrix[]): IGLTFRenderPrimitive[] {
        const result = [] as IGLTFRenderPrimitive[];
        const nodeDef = this._json.nodes[nodeId];
        const { mesh, matrix, children } = nodeDef;
        const transforms = matrix ? [...parentMatrixs, matrix] : parentMatrixs;
        if (mesh !== undefined) {
            const renders = this._json.meshes[mesh].primitives.map((p) => {
                return { ...p, transforms };
            });
            result.push(...renders);
        }
        if (!children) {
            return result;
        }
        children.forEach((child) => {
            this._traverse(child, transforms).forEach((e) => result.push(e));
        });
        return result;
    }
}
