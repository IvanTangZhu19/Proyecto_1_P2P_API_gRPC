# Proyecto_1_P2P_API_gRPC

Proyecto 1 del curso Arquitecturas de nube y sistemas distribuidos que consiste en la implementación de una comunicación en una red P2P mediante API REST Y gRPC

- Desarrollo:

  - En el servidor:

    - Instala las librerías de node necesarias para el funcionamiento del API con Express JS

    - `npm install express`

    - Para correr el servidor:
      - `npm start` o `node server.js`

  - En el peer

    - `npm init -y`

    - Instala lo necesario 
    
    - `npm install @grpc/grpc-js @grpc/proto-loader axios`
  
    - `npx proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=./ *.proto`
    
    - Para ejecutar el server y client de gRPC

    - `node server.js`

    - `node client.js`

- En las instancias de la nube (de Ubuntu)

  - `sudo apt update`
  - Se instala git para clonar el repositorio
  - `sudo apt install git`
  - Para la instalación de node:
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`
  - `export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"` 
  - `nvm install --lts`
  - Clonación de repositorio
  - `git clone https://github.com/IvanTangZhu19/Proyecto_1_P2P_API_gRPC.git`
  - Estando server o cualquiera de los peers:
  - `npm install`
  - Nota: Para tener en cuenta, en este repositorio por temas de seguridad no estará publicadas las IPs de las instancias credas en la nube