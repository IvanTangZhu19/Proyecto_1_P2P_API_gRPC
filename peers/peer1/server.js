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
        let nombreArchivo = '';
        const chunks = [];

        call.on('data', (fileChunk) => {
            nombreArchivo = fileChunk.file_name;
            chunks.push(fileChunk.data);
        });

        call.on('end', () => {
            const Buffer = Buffer.concat(chunks);
            const rutaArchivo = path.join(__dirname, 'archivos', nombreArchivo);

            fs.writeFile(rutaArchivo, Buffer, (err) => {
                if (err) {
                    console.error('Error al guardar el archivo:', err);
                    callback(null, { success: false, mensaje: 'Error al guardar el archivo' });
                } else {
                    console.log(`Archivo recibido y guardado: ${nombreArchivo}`);
                    callback(null, { success: true, mensaje: 'Archivo recibido exitosamente' });
                }
            });
        });
    },
    recibirArchivo: (call, callback) => {
        const fileName = call.request.file_name;
        const ubicaciones = buscar(fileName);
        const filePath = path.join(__dirname, 'archivos', fileName);
        const fileStream = fs.createReadStream(filePath);
        
        fileStream.on('data', (chunk) => {
            call.write({ data: chunk, file_name: fileName });
        });

        fileStream.on('end', () => {
            call.end();
        });
        fileStream.on('error', (err) => {
            console.error('Error al leer el archivo:', err);
            call.destroy(err);
        });

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