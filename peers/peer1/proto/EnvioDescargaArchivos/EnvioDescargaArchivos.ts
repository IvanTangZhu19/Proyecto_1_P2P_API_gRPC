// Original file: peer.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { FileChunk as _EnvioDescargaArchivos_FileChunk, FileChunk__Output as _EnvioDescargaArchivos_FileChunk__Output } from '../EnvioDescargaArchivos/FileChunk';
import type { FileRequest as _EnvioDescargaArchivos_FileRequest, FileRequest__Output as _EnvioDescargaArchivos_FileRequest__Output } from '../EnvioDescargaArchivos/FileRequest';
import type { status as _EnvioDescargaArchivos_status, status__Output as _EnvioDescargaArchivos_status__Output } from '../EnvioDescargaArchivos/status';

export interface EnvioDescargaArchivosClient extends grpc.Client {
  mandarArchivo(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientWritableStream<_EnvioDescargaArchivos_FileChunk>;
  mandarArchivo(metadata: grpc.Metadata, callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientWritableStream<_EnvioDescargaArchivos_FileChunk>;
  mandarArchivo(options: grpc.CallOptions, callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientWritableStream<_EnvioDescargaArchivos_FileChunk>;
  mandarArchivo(callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientWritableStream<_EnvioDescargaArchivos_FileChunk>;
  
  recibirArchivo(argument: _EnvioDescargaArchivos_FileRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_EnvioDescargaArchivos_FileChunk__Output>;
  recibirArchivo(argument: _EnvioDescargaArchivos_FileRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_EnvioDescargaArchivos_FileChunk__Output>;
  
}

export interface EnvioDescargaArchivosHandlers extends grpc.UntypedServiceImplementation {
  mandarArchivo: grpc.handleClientStreamingCall<_EnvioDescargaArchivos_FileChunk__Output, _EnvioDescargaArchivos_status>;
  
  recibirArchivo: grpc.handleServerStreamingCall<_EnvioDescargaArchivos_FileRequest__Output, _EnvioDescargaArchivos_FileChunk>;
  
}

export interface EnvioDescargaArchivosDefinition extends grpc.ServiceDefinition {
  mandarArchivo: MethodDefinition<_EnvioDescargaArchivos_FileChunk, _EnvioDescargaArchivos_status, _EnvioDescargaArchivos_FileChunk__Output, _EnvioDescargaArchivos_status__Output>
  recibirArchivo: MethodDefinition<_EnvioDescargaArchivos_FileRequest, _EnvioDescargaArchivos_FileChunk, _EnvioDescargaArchivos_FileRequest__Output, _EnvioDescargaArchivos_FileChunk__Output>
}
