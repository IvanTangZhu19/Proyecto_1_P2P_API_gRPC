const express = require('express');

const server = express();

server.use(express.json());

const puerto = 6000;
var peers = [];

function verificarIP_Puerto(ip, puerto){
    for(let i=0; i < peers.length; i++){
        if(peers[i].ip === ip && peers[i].puerto === puerto) return i;
    }
    return -1;
}

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

server.post('/logout', (req, res) => {
    const { ip, puerto } = req.body;
    const a = verificarIP_Puerto(ip, puerto);
    if(a != -1) {
        peers[a].estado = false;
        res.json({mensaje: "Se salió", peers});
    } 
    else res.json({mensaje: "Error"});
});

server.post('/archivosPeer', (req, res)=>{
    const { ip, puerto, archivos }= req.body;
    const a = verificarIP_Puerto(ip, puerto);
    if (a != -1){
        peers[a].archivos = archivos;
        res.json({mensaje: "Se registró correctamente", peers});
    } else res.json({mensaje: "Error"});
});

server.get('/buscar', (req, res)=>{
    const { archivo } = req.body;
    var arc = [];
    var ubicaciones = [];
    for(let i=0; i < peers.length; i++){
        arc = peers[i].archivos;
        for(let j=0; j < arc.length; j++){
            if(arc[j] == archivo) ubicaciones.push(peers[i]); 
        }
    }
    if(ubicaciones.length != 0) res.json({ubicaciones});
    else res.json({mensaje: "No en encontró el archivo"});
});

server.listen(puerto, () => {
    console.log(`El server está escuchando en http://localhost:${puerto}`);
});