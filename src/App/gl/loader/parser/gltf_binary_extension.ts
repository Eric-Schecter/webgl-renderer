import { BINARY_EXTENSION_CHUNK_TYPES, BINARY_EXTENSION_HEADER_LENGTH, BINARY_EXTENSION_HEADER_MAGIC, EXTENSIONS } from './gltf_const';

export class GLTFBinaryExtension {
    public name = EXTENSIONS.KHR_BINARY_GLTF;

    public content = '';

    public body?: ArrayBuffer;

    public header: {
        magic: string;
        version: number;
        length: number;
    };

    constructor(data: ArrayBuffer) {
        const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
        const decoder = new TextDecoder();
        this.header = {
            magic: decoder.decode(new Uint8Array(data.slice(0, 4))),
            version: headerView.getUint32(4, true),
            length: headerView.getUint32(8, true),
        };

        if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
            throw new Error('THREE.GLTFLoader: Unsupported glTF-Binary header.');
        } else if (this.header.version < 2.0) {
            throw new Error('THREE.GLTFLoader: Legacy binary file detected. Use LegacyGLTFLoader instead.');
        }

        const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
        let chunkIndex = 0;
        while (chunkIndex < chunkView.byteLength) {
            const chunkLength = chunkView.getUint32(chunkIndex, true);
            chunkIndex += 4;
            const chunkType = chunkView.getUint32(chunkIndex, true);
            chunkIndex += 4;
            if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
                const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
                this.content = decoder.decode(contentArray);
            } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
                const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
                this.body = data.slice(byteOffset, byteOffset + chunkLength);
            }
            // Clients must ignore chunks with unknown types.
            chunkIndex += chunkLength;
        }

        if (this.content === null) {
            throw new Error('THREE.GLTFLoader: JSON content not found.');
        }
    }
}
