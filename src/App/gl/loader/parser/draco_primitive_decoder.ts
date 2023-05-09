import DecoderModule from './draco_decoder';
import { ATTRIBUTES, WEBGL_COMPONENT_TYPES } from './gltf_const';
import {
    IGLTFRenderPrimitive,
    IGLTFAccessor,
    IGLTFBufferAccessor,
    EN_COMPONENT_TYPE,
    IGLTFAttribute,
    IGLTFBufferView,
} from './gltf_typedef';

interface IAttribute {
    name: string;
    type: string;
    normalized: boolean;
    attributeID: number;
}

interface IDracoDecoderResult {
    indices?: IGLTFBufferAccessor;
    POSITION?: IGLTFBufferAccessor; // eslint-disable-line @typescript-eslint/naming-convention
    NORMAL?: IGLTFBufferAccessor; // eslint-disable-line @typescript-eslint/naming-convention
    TEXCOORD_0?: IGLTFBufferAccessor; // eslint-disable-line @typescript-eslint/naming-convention
}

interface IDecodeAttribute {
    name: string;
    array: ArrayBuffer;
    itemSize: number;
}
const DracoDecoderModule = DecoderModule();
export class DracoPrimitiveDecoder {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public decode(
        bufferView: IGLTFBufferView,
        primitive: IGLTFRenderPrimitive,
        arrayBuffer: ArrayBuffer,
        accessors: IGLTFAccessor[],
    ): IDracoDecoderResult {
        const { attributes: dracoAttributes } = primitive!.extensions!.KHR_draco_mesh_compression;
        const attributes = this._getAttributes(primitive.attributes, dracoAttributes, accessors);

        const decoderBuffer = new DracoDecoderModule.DecoderBuffer();
        decoderBuffer.Init(new Int8Array(arrayBuffer), arrayBuffer.byteLength);
        const decoder = new DracoDecoderModule.Decoder();
        const geometryType = decoder.GetEncodedGeometryType(decoderBuffer);

        let dracoGeometry: any;
        let decodingStatus: any;
        if (geometryType === DracoDecoderModule.TRIANGULAR_MESH) {
            dracoGeometry = new DracoDecoderModule.Mesh();
            decodingStatus = decoder.DecodeBufferToMesh(decoderBuffer, dracoGeometry);
        } else if (geometryType === DracoDecoderModule.POINT_CLOUD) {
            dracoGeometry = new DracoDecoderModule.PointCloud();
            decodingStatus = decoder.DecodeBufferToPointCloud(decoderBuffer, dracoGeometry);
        } else {
            console.error(`Unexpected geometry type:${geometryType}`);
            return {};
        }

        if (!decodingStatus.ok() || dracoGeometry.ptr === 0) {
            console.error(`Decoding failed: ${decodingStatus.error_msg()}`);
            return {};
        }

        // get attributes
        const decodedAttributes = attributes.map(({ name, attributeID, type }) => {
            const attribute = decoder.GetAttributeByUniqueId(dracoGeometry, attributeID);
            return this._decodeAttribute(DracoDecoderModule, decoder, dracoGeometry, name, type, attribute);
        });

        const result = this._getPositionAndNormalAndUV(decodedAttributes, bufferView);

        // get indicies
        if (geometryType === DracoDecoderModule.TRIANGULAR_MESH) {
            const indiciesBuffer = this._decodeIndicies(DracoDecoderModule, decoder, dracoGeometry);
            result.indices = {
                bufferView,
                buffer: indiciesBuffer,
                byteLength: indiciesBuffer.byteLength,
                count: indiciesBuffer.byteLength,
                type: 'SCALAR',
                componentType: EN_COMPONENT_TYPE.UNSIGNED_INT,
            };
        }

        return result;
    }

    private _getPositionAndNormalAndUV(decodedAttributes: IDecodeAttribute[], bufferView: IGLTFBufferView): IDracoDecoderResult {
        let POSITION: IGLTFBufferAccessor | undefined;
        let NORMAL: IGLTFBufferAccessor | undefined;
        let TEXCOORD_0: IGLTFBufferAccessor | undefined;
        for (const decodedAttribute of decodedAttributes) {
            if (decodedAttribute.name === 'position') {
                POSITION = {
                    buffer: decodedAttribute.array,
                    byteLength: decodedAttribute.array.byteLength,
                    count: decodedAttribute.array.byteLength,
                    type: 'VEC3',
                    componentType: EN_COMPONENT_TYPE.FLOAT,
                    bufferView,
                };
            }

            if (decodedAttribute.name === 'normal') {
                NORMAL = {
                    buffer: decodedAttribute.array,
                    byteLength: decodedAttribute.array.byteLength,
                    count: decodedAttribute.array.byteLength,
                    type: 'VEC3',
                    componentType: EN_COMPONENT_TYPE.FLOAT,
                    bufferView,
                };
            }

            if (decodedAttribute.name === 'uv') {
                TEXCOORD_0 = {
                    buffer: decodedAttribute.array,
                    byteLength: decodedAttribute.array.byteLength,
                    count: decodedAttribute.array.byteLength,
                    type: 'VEC2',
                    componentType: EN_COMPONENT_TYPE.FLOAT,
                    bufferView,
                };
            }
        }
        return { POSITION, NORMAL, TEXCOORD_0 }; // eslint-disable-line
    }

    private _getAttributes(primitiveAttributes: IGLTFAttribute, dracoAttributes: IGLTFAttribute, accessors: IGLTFAccessor[]): IAttribute[] {
        return Object.keys(dracoAttributes).map((attributeName) => {
            // @ts-expect-error TODO
            const name = ATTRIBUTES[attributeName] || attributeName.toLowerCase();

            // @ts-expect-error TODO
            const attributeID = dracoAttributes[attributeName];

            // @ts-expect-error TODO
            const accessorDef = accessors[primitiveAttributes[attributeName]];
            const componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
            const type = componentType.name;
            const normalized = accessorDef.normalized === true;
            return { name, attributeID, type, normalized };
        });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    private _decodeIndicies(draco: any, decoder: any, mesh: any): ArrayBuffer {
        const numFaces = mesh.num_faces();
        const numIndices = numFaces * 3;
        const index = new Uint32Array(numIndices);
        const indexArray = new draco.DracoInt32Array();

        for (let i = 0; i < numFaces; ++i) {
            decoder.GetFaceFromMesh(mesh, i, indexArray);
            for (let j = 0; j < 3; ++j) {
                index[i * 3 + j] = indexArray.GetValue(j);
            }
        }
        return index;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    private _decodeAttribute(
        draco: any,
        decoder: any,
        dracoGeometry: any,
        attributeName: string,
        attributeType: string,
        attribute: any,
    ): IDecodeAttribute {
        const numComponents = attribute.num_components();
        const numPoints = dracoGeometry.num_points();
        const numValues = numPoints * numComponents;
        let dracoArray;

        let array;

        switch (attributeType) {
            case 'Float32Array':
                dracoArray = new draco.DracoFloat32Array();
                decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, dracoArray);
                array = new Float32Array(numValues);
                break;

            case 'Int8Array':
                dracoArray = new draco.DracoInt8Array();
                decoder.GetAttributeInt8ForAllPoints(dracoGeometry, attribute, dracoArray);
                array = new Int8Array(numValues);
                break;

            case 'Int16Array':
                dracoArray = new draco.DracoInt16Array();
                decoder.GetAttributeInt16ForAllPoints(dracoGeometry, attribute, dracoArray);
                array = new Int16Array(numValues);
                break;

            case 'Int32Array':
                dracoArray = new draco.DracoInt32Array();
                decoder.GetAttributeInt32ForAllPoints(dracoGeometry, attribute, dracoArray);
                array = new Int32Array(numValues);
                break;

            case 'Uint8Array':
                dracoArray = new draco.DracoUInt8Array();
                decoder.GetAttributeUInt8ForAllPoints(dracoGeometry, attribute, dracoArray);
                array = new Uint8Array(numValues);
                break;

            case 'Uint16Array':
                dracoArray = new draco.DracoUInt16Array();
                decoder.GetAttributeUInt16ForAllPoints(dracoGeometry, attribute, dracoArray);
                array = new Uint16Array(numValues);
                break;

            case 'Uint32Array':
                dracoArray = new draco.DracoUInt32Array();
                decoder.GetAttributeUInt32ForAllPoints(dracoGeometry, attribute, dracoArray);
                array = new Uint32Array(numValues);
                break;

            default:
                throw new Error('THREE.DRACOLoader: Unexpected attribute type.');
        }

        for (let i = 0; i < numValues; i++) {
            array[i] = dracoArray.GetValue(i);
        }

        draco.destroy(dracoArray);

        return {
            name: attributeName,
            array,
            itemSize: numComponents,
        };
    }
}
