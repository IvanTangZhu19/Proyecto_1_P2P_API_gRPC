// Original file: peer.proto


export interface FileChunk {
  'data'?: (Buffer | Uint8Array | string);
  'fileName'?: (string);
}

export interface FileChunk__Output {
  'data': (Buffer);
  'fileName': (string);
}
