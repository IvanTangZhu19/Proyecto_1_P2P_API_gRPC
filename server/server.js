const express = require('express');

const server = express();

//Para el manejo de JSON
server.use(express.json());

//variables
const puerto = 6000;
var peers = [];

//Método para verificar la existencia de un peer en el arreglo
//devuelve la posición donde está la ip y puerto
//y devuelve -1 si no lo encuentra
function verificarIP_Puerto(ip, puerto){
    for(let i=0; i < peers.length; i++){
        if(peers[i].ip === ip && peers[i].puerto === puerto) return i;
    }
    return -1;
}

//Ruta POST de login: añade una ip y puerto al arreglo
//o actualiza estado si ya está en el arreglo
server.post('/login', (req, res) => {
    const { ip, puerto } = req.body;
    if (ip != null && puerto != null){
        const i = verificarIP_Puerto(ip, puerto);
        if(i != -1){
            //Existe -> cambia estado
            peers[i].estado = true;
        } else {
            // No existe -> se añade
            peers.push({
                usuario: 'peer_' + (peers.length + 1),
                ip: ip,
                puerto: puerto,
                estado: true,
                archivos: []
            });
        }
        res.json({mensaje: "Se registró correctamente", peers});
    } else res.json({mensaje: "Error"});
});

//Ruta POST que cambia de estado si ya está en el arreglo
//si no está (no ha hecho login) saldrá error
server.post('/logout', (req, res) => {
    const { ip, puerto } = req.body;
    const a = verificarIP_Puerto(ip, puerto);
    if(a != -1) {
        peers[a].estado = false;
        res.json({mensaje: "Se salió correctamente", peers});
    } 
    else res.json({mensaje: "Error"});
});

//Ruta POST que ya hecho login, añade la ubicación de los archivos
server.post('/archivosPeer', (req, res)=>{
    const { ip, puerto, archivos }= req.body;
    const a = verificarIP_Puerto(ip, puerto);
    if (a != -1){
        peers[a].archivos = archivos;
        res.json({mensaje: "Se registró correctamente", peers});
    } else res.json({mensaje: "Error"});
});

//Ruta GET que va a buscar el archivo en los diferentes peer
//que están en el arreglo
server.get('/buscar', (req, res)=>{
    const { archivo } = req.body;
    var arc = [];
    var ubicaciones = [];
    for(let i=0; i < peers.length; i++){
        arc = peers[i].archivos;
        for(let j=0; j < arc.length; j++){
            if(arc[j] == archivo && peers[i].estado == true) ubicaciones.push(peers[i]); 
        }
    }
    if(ubicaciones.length != 0) res.json({mensaje: "Se encontró", ubicaciones});
    else res.json({mensaje: "No en encontró el archivo"});
});

//Ruta GET para ver los peers
server.get('/peers', (req, res)=>{
    res.json({peers});
});

//Escucha en el puerto 6000
server.listen(puerto, () => {
    console.log(`El server está escuchando en http://localhost:${puerto}`);
});