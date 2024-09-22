//Importaciones
const path = require('path');
const grpc = require('@grpc/grpc-js');//gRPC
const protoLoader = require('@grpc/proto-loader');//gRPC
const axios = require('axios');//Comunicación a la API server
const fs = require('fs');

const PROTO_PATH = path.join(__dirname, 'proto/peer.proto');

const ipServer = 'http://localhost:6000';//variable que contiene la ip del servidor

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

//Metodo buscar que se comunica con el server mandandole el archivo
async function buscar(archivo){
    try {
        const response = await axios.get(`${ipServer}/buscar/${archivo}`);
        if(response.data.mensaje == "Se encontró"){
            //console.log(response.data.ubicaciones);
            //se retorna la información de los peers que contienen el archivo
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
//Servicio
const protoService = grpc.loadPackageDefinition(packageDefinition).EnvioDescargaArchivos;

//Función que recibe archivos de otros peers
//Solicita el archivo a la red de peers, se envía el archivo
//y se guarda en la carpeta
async function solicitarArchivoPeer(archivo){
    //Llamada a función buscar que devuelve los archivos
    const ubicaciones = await buscar(archivo);
    var peer;
    //Si el archivo está en la red de peers
    if (ubicaciones.length > 0){
        peer = ubicaciones[0];
        //Se conecta al peer que contiene el archivo
        const client = new protoService.EnvioDescargaArchivos(
            `${peer.ip}:${peer.puerto}`, grpc.credentials.createInsecure());
        
        //Llama al método `solicitarArchivo` del peer para obtener el archivo
        const call = client.solicitarArchivo({ file_name: archivo });
        //ruta donde se va a guardar el archivo
        const rutaArchivo = path.join(__dirname, 'archivos', archivo + '_nuevo');
        
        const writeStream = fs.createWriteStream(rutaArchivo);
        
        //Recibe los datos del archivo en chunks y los escribe en el archivo local
        call.on('data', (fileChunk) => {
            writeStream.write(fileChunk.data);
        });
        call.on('end', () => {
            writeStream.end();
            console.log(`Archivo ${archivo} recibido desde ${peer.ip}:${peer.puerto}`);
        });
        call.on('error', (error) => {
            console.error('Error al recibir el archivo:', error);
        });
    } else {
        console.log("No se encontró");
    }
}

//Del actual peer, manda archivo a otro peer
function enviarArchivoAPeer(nombreArchivo, peerIP, peerPuerto) {
    //Se conecta al peer al cual se manda el archivo
    const client = new protoService.EnvioDescargaArchivos(
        `${peerIP}:${peerPuerto}`, grpc.credentials.createInsecure());

    //Ruta de archivo que se envía
    const rutaArchivo = path.join(__dirname, 'archivos', nombreArchivo);
    const fileStream = fs.createReadStream(rutaArchivo);
    
    //Se llama mandarArchivo
    const call = client.mandarArchivo((error, response) => {
        if (error) {
            console.error('Error al mandar el archivo al peer:', error);
        }
    });
    //Lee los datos del archivo en chunks y los envía al peer de destino
    fileStream.on('data', (chunk) => {
        call.write({ data: chunk, file_name: nombreArchivo });
    });

    fileStream.on('end', () => {
        call.end();
        console.log(`Archivo ${nombreArchivo} enviado a ${peerIP}:${peerPuerto}`);
    });

    fileStream.on('error', (error) => {
        console.error('Error al leer el archivo:', error);
        call.end();
    });
}

//Para la ejecución/Prueba:

const archivo = "hola.txt";

solicitarArchivoPeer(archivo);

//enviarArchivoAPeer(archivo, "localhost", 6002);