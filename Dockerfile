# Usa una imagen de Node.js
FROM node:18

# Crea y usa un directorio dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Instala nodemon globalmente para desarrollo
RUN npm install -g nodemon

# Expone el puerto en el que corre tu app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
