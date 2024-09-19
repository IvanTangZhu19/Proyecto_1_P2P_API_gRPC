const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');
const fs = require('fs');

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

async function buscar(archivo){
    const response = await axios.post('http://localhost:6000/buscar', archivo);
    if(response.data.mensaje == "Se encontró"){
        return response.data.ubicaciones;
    } else {
        console.log("Error en buscar");
        return [];
    };
}

server.addService(protoService.EnvioDescargaArchivos.service, {
    mandarArchivo: (call, callback) => {
        const fileName = 'uploaded_' + Date.now(); // Genera un nombre único para el archivo
        const writeStream = fs.createWriteStream(fileName);
    },
    descargarArchivo: (call, callback) => {
        const fileName = call.request.file_name;
        const ubicaciones = buscar(fileName);


    }
})

server.bindAsync('localhost:6001', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Servidor gRPC iniciado en el puerto 6001');
    login();
})

process.on('SIGINT', async () => {
    logout();
})