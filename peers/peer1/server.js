const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');

const PROTO_PATH = path.join(__dirname, './proto/peer.proto');
const config = require('./config.json');

const configJSON = {
    ip: config.ip,
    puerto: config.puerto,
    archivos: config.archivos
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const protoService = grpc.loadPackageDefinition(packageDefinition).EnvioDescargaArchivos;

const server = new grpc.Server();

async function login(){
    const response = await axios.post('http://localhost:6000/login', configJSON);
    if(response.data.mensaje == "Se registró correctamente"){
        archivosPeer();
    } else console.log("Error en el login");
}
async function logout(){
    const response = await axios.post('http://localhost:6000/logout', configJSON);
    if(response.data.mensaje == "Se salió correctamente"){
        console.log(response.data.mensaje);
        server.tryShutdown(() => {
            console.log('Servidor gRPC cerrado');
            process.exit(0);
        });
    } else console.log("Error en el logout");
}
async function archivosPeer(){
    const response = await axios.post('http://localhost:6000/archivosPeer', configJSON);
    if( ! response.data.mensaje == "Se registró correctamente") 
        console.log("Error en archivosPeer");
}

async function buscar(){
    if(response.data.mensaje == "Se salió correctamente"){
        console.log(response.data.mensaje);
        server.tryShutdown(() => {
            console.log('Servidor gRPC cerrado');
            process.exit(0);
        });
    } else console.log("Error en el logout");
}

server.addService(protoService.EnvioDescargaArchivos.service, {
    mandarArchivo: (call, callback) => {
        
    }
})

server.bindAsync('0.0.0.0:6001', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Servidor gRPC iniciado en el puerto 6001');
    login();
})

process.on('SIGINT', async () => {
    logout();
})