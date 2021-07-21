FROM node:12
# Utiliza la imagen de node 8 como base.
# A partir de esta imagen se ejecutarán los comandos de abajo creando una nueva imagen.

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Crea un directorio y nos movemos ahí
WORKDIR /home/node/unqfy_app

# Copia el package.json package-lock.json en /home/node/unqfy_app
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]

# Expone el puerto 5000 donde corre la aplicación
EXPOSE 5000

# Copia los fuentes dentro del container
COPY . .
#WORKDIR /home/node/unqfy_app/apimusicxmatch
#COPY /apimusicxmatch/apimusicxmatch.js .

#WORKDIR /home/node/unqfy_app/exceptions
#COPY /exceptions/existing-object.js /exceptions/non-existent-object.js /exceptions/not-a-number.js /exceptions/not-a-valid-command.js /exceptions/wrong-arguments.js ./

#WORKDIR /home/node/unqfy_app/
#COPY album.js artist.js generateSpotifyCredentials.js mais.js observer.js playlist.js spotifyCreds.json subject.js test.js track.js unqfy.js user.js validate-entry.js ./

#WORKDIR /home/node/unqfy_app/API
#COPY /API/albumsController.js /API/apiErrors.js /API/artistController.js /API/errorHandler.js /API/playlistController.js /API/router.js /API/tracksController.js ./

# Crea un volumen donde se van a guardar datos de la aplicación
# RUN mkdir -p /home/node/my_node_app/app_data
VOLUME ["/home/node/unqfy_app/app_data"]

# Le da permisos al usuario node para escribir en /home/node/unqfy_app
# Como comentario, notar que el comando RUN nos permite ejecutar culquier comando bash valido.
RUN chown -R node:users /home/node/unqfy_app

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "API/router" ]

# LISTO!


# Para construir la imagen
# docker build -t <nombre_de_la_imagen> .

# Para correr el container
# docker run -p 5000:5000 --name <nombre_container> --user node <nombre_de_la_imagen>
