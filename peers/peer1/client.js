const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, './proto/peer.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const protoService = grpc.loadPackageDefinition(packageDefinition);

const client = new protoService.EnvioDescargaArchivos.EnvioDescargaArchivos(
    'localhost:6001', grpc.credentials.createInsecure());