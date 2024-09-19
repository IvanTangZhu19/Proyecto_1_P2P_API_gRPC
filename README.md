# Proyecto_1_P2P_API_gRPC

- En el servidor:

  - Instala las librerías de node necesarias para el funcionamiento del API con Express JS

  - `npm install express`

- Para correr el servidor:
  - `npm start` o `node server.js`

- En el peer

  - `npm init -y`

  - `npm install @grpc/grpc-js @grpc/proto-loader axios`
 
  - `npx proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=./ *.proto`
  
  - `node server.js`