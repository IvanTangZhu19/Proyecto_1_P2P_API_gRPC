//Importaciones necesarias
const path = require('path');//Manejo de rutas
const grpc = require('@grpc/grpc-js'); //gRPC
const protoLoader = require('@grpc/proto-loader');//gRPC
const axios = require('axios');//Para la comunicación al API
const fs = require('fs'); //Para los archivos

//ruta donde se encuentra el archivo .proto
const PROTO_PATH = path.join(__dirname, './proto/peer.proto');
//archivo de configuración que contiene la ip, puerto y archivos
const config = require('./config.json');
//ip y puerto del server
const ipServer = 'http://0.0.0.0:6000';

//archivo de configuración en una variable
const configJSON = {
    ip: config.ip,
    puerto: config.puerto,
    archivos: config.archivos
}
//Definición del .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

//carga el paquete
const protoService = grpc.loadPackageDefinition(packageDefinition).EnvioDescargaArchivos;

//Instancia del servidor de gRPC
const server = new grpc.Server();

//Metodo de login que se comunica con el servidor mandandole la información
async function login(){
    const response = await axios.post(ipServer+'/login', configJSON);
    if(response.data.mensaje == "Se registró correctamente"){
        archivosPeer();
    } else console.log("Error en el login");
}
//Metodo de logout que se comunica con el servidor mandandole la información
async function logout(){
    const response = await axios.post(ipServer+'/logout', configJSON);
    if(response.data.mensaje == "Se salió correctamente"){
        console.log(response.data.mensaje);
        //Si se sale: apaga el servidor
        server.tryShutdown(() => {
            console.log('Servidor gRPC cerrado');
            process.exit(0);
        });
    } else console.log("Error en el logout");
}
//Metodo de archivosPeer que se comunica con el servidor mandandole la información
async function archivosPeer(){
    const response = await axios.post(ipServer+'/archivosPeer', configJSON);
    if( ! response.data.mensaje == "Se registró correctamente") 
        console.log("Error en archivosPeer");
}

//Se implementan los métodos indicados en el .proto
server.addService(protoService.EnvioDescargaArchivos.service, {
    //manda un archivo del peer actual a otro peer
    mandarArchivo: (call, callback) => {
        let nombreArchivo = '';
        const chunks = [];

        //Recibe archivo en partes (chunks)
        call.on('data', (fileChunk) => {
            nombreArchivo = fileChunk.file_name;
            chunks.push(fileChunk.data);
        });
        //Al leerlo todo, en el otro peer se guarda el archivo
        call.on('end', () => {
            const BufferConcat = Buffer.concat(chunks);
            const rutaArchivo = path.join(__dirname, 'archivos', nombreArchivo);

            fs.writeFile(rutaArchivo, BufferConcat, (err) => {
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
    //Solicita un archivo desde otro peer
    solicitarArchivo: (call, callback) => {
        const nombreArchivo = call.request.file_name;
        const rutaArchivo = path.join(__dirname, 'archivos', nombreArchivo);
        const fileStream = fs.createReadStream(rutaArchivo);
        
        //desde el otro peer se manda el archivo 
        fileStream.on('data', (chunk) => {
            call.write({ data: chunk, file_name: nombreArchivo });
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

//Empieza el servidor de gRPC para el peer actual
server.bindAsync('0.0.0.0:' + configJSON.puerto, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Servidor gRPC iniciado en el puerto ' + configJSON.puerto);
    //Cuando empieza el servidor se hace el login
    login();
})

//Para cuando se apague el servidor
process.on('SIGINT', async () => {
    logout();
})