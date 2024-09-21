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
    try {
        const response = await axios.get(`http://localhost:6000/buscar/${archivo}`);
        if(response.data.mensaje == "Se encontró"){
            //console.log(response.data.ubicaciones);
            return response.data.ubicaciones;
        } else {
            console.log("Error en buscar");
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

const protoService = grpc.loadPackageDefinition(packageDefinition);

async function recibirArchivoPeer(archivo){
    const ubicaciones = await buscar(archivo);
    var peer;
    console.log(ubicaciones.length);
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
            console.log(`Archivo ${fileName} recibido desde ${peer.ip}:${peer.puerto}`);
        });
        call.on('error', (error) => {
            console.error('Error al recibir el archivo:', error);
        });
    } else {
        console.log("No se encontró");
    }
}

const archivo = "hola.txt";

recibirArchivoPeer(archivo);