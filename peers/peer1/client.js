const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');

const PROTO_PATH = path.join(__dirname, './proto/peer.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

async function buscar(archivo){
    const response = await axios.post('http://localhost:6000/buscar', archivo);
    if(response.data.mensaje == "Se encontró"){
        return response.data.ubicaciones;
    } else {
        console.log("Error en buscar");
        return [];
    };
}

const protoService = grpc.loadPackageDefinition(packageDefinition).EnvioDescargaArchivos;

function recibirArchivoPeer(archivo){
    const ubicaciones = buscar(archivo);
    let peer;
    if (ubicaciones.length > 0){
        peer = ubicaciones[0];
        const client = new protoService.EnvioDescargaArchivos(
            `${peer.ip}:${peer.puerto}`, grpc.credentials.createInsecure());

        const call = client.recibirArchivo({ file_name: archivo });
        const rutaArchivo = path.join(__dirname, 'archivos', archivo);
        const writeStream = fs.createWriteStream(rutaArchivo);

        call.on('data', (fileChunk) => {
            writeStream.write(fileChunk.data);
        });
        call.on('end', () => {
            writeStream.end();
            console.log(`Archivo ${fileName} recibido desde ${peerIp}:${peerPort}`);
        });
        call.on('error', (error) => {
            console.error('Error al recibir el archivo:', error);
        });
    }
}

const archivo = "hola.txt";

recibirArchivoPeer(archivo);