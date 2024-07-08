# Usar una imagen base de Node.js
FROM node:20.12.2-bookworm

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar las dependencias
RUN npm install --force

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "test"]
