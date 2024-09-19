import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EnvioDescargaArchivosClient as _EnvioDescargaArchivos_EnvioDescargaArchivosClient, EnvioDescargaArchivosDefinition as _EnvioDescargaArchivos_EnvioDescargaArchivosDefinition } from './EnvioDescargaArchivos/EnvioDescargaArchivos';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  EnvioDescargaArchivos: {
    EnvioDescargaArchivos: SubtypeConstructor<typeof grpc.Client, _EnvioDescargaArchivos_EnvioDescargaArchivosClient> & { service: _EnvioDescargaArchivos_EnvioDescargaArchivosDefinition }
    FileChunk: MessageTypeDefinition
    FileRequest: MessageTypeDefinition
    status: MessageTypeDefinition
  }
}

