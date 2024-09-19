// Original file: peer.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { FileChunk as _EnvioDescargaArchivos_FileChunk, FileChunk__Output as _EnvioDescargaArchivos_FileChunk__Output } from '../EnvioDescargaArchivos/FileChunk';
import type { FileRequest as _EnvioDescargaArchivos_FileRequest, FileRequest__Output as _EnvioDescargaArchivos_FileRequest__Output } from '../EnvioDescargaArchivos/FileRequest';
import type { status as _EnvioDescargaArchivos_status, status__Output as _EnvioDescargaArchivos_status__Output } from '../EnvioDescargaArchivos/status';

export interface EnvioDescargaArchivosClient extends grpc.Client {
  descargarArchivo(argument: _EnvioDescargaArchivos_FileRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_EnvioDescargaArchivos_FileChunk__Output>;
  descargarArchivo(argument: _EnvioDescargaArchivos_FileRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_EnvioDescargaArchivos_FileChunk__Output>;
  
  mandarArchivo(argument: _EnvioDescargaArchivos_FileRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientUnaryCall;
  mandarArchivo(argument: _EnvioDescargaArchivos_FileRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientUnaryCall;
  mandarArchivo(argument: _EnvioDescargaArchivos_FileRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientUnaryCall;
  mandarArchivo(argument: _EnvioDescargaArchivos_FileRequest, callback: grpc.requestCallback<_EnvioDescargaArchivos_status__Output>): grpc.ClientUnaryCall;
  
}

export interface EnvioDescargaArchivosHandlers extends grpc.UntypedServiceImplementation {
  descargarArchivo: grpc.handleServerStreamingCall<_EnvioDescargaArchivos_FileRequest__Output, _EnvioDescargaArchivos_FileChunk>;
  
  mandarArchivo: grpc.handleUnaryCall<_EnvioDescargaArchivos_FileRequest__Output, _EnvioDescargaArchivos_status>;
  
}

export interface EnvioDescargaArchivosDefinition extends grpc.ServiceDefinition {
  descargarArchivo: MethodDefinition<_EnvioDescargaArchivos_FileRequest, _EnvioDescargaArchivos_FileChunk, _EnvioDescargaArchivos_FileRequest__Output, _EnvioDescargaArchivos_FileChunk__Output>
  mandarArchivo: MethodDefinition<_EnvioDescargaArchivos_FileRequest, _EnvioDescargaArchivos_status, _EnvioDescargaArchivos_FileRequest__Output, _EnvioDescargaArchivos_status__Output>
}
