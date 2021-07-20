# cloud-grupo 5

CONFIGURACION DE CONTAINERS

```	
PARA CREAR LA RED

docker network create --subnet=172.20.0.0/16 unqfynet	
	
LAS IMAGENES SE CONSTRUYEN CADA UNA EN EL DIRECTORIO DEL SERVICIO CORRESPONDIENTE	

/UNQfy
docker build -t unqfy_image .

/NEWSLETTER
docker build -t newsletter_image .

/LOGGING
docker build -t logging_image .

/MONITOR
docker build -t monitor_image .

PARA CORRER LOS SERVICIOS EN CADA CONTEINER, UNA SOLA VEZ, DESPUES SE LO INICIA CON "DOCKER START <SERVICE_APP_NAME>" Y SE LOS PARA CON "DOCKER STOP ..." 	

UNQfy
docker run  --net unqfynet --ip 172.20.0.21 -p 5000:5000 -e NEWSLETTER_API_HOST=http://172.20.0.22:5001 -e LOGGING_API_HOST=http://172.20.0.23:5002 -e MONITOR_API_HOST=http://172.20.0.24:5003 --name unqfy_app --user node unqfy_image

NEWSLETTER
docker run  --net unqfynet --ip 172.20.0.22 -p 5001:5001 -e UNQFY_API_HOST=http://172.20.0.21:5000 -e LOGGING_API_HOST=http://172.20.0.23:5002 -e MONITOR_API_HOST=http://172.20.0.24:5003 --name newsletter_app --user node newsletter_image

LOGGING
docker run  --net unqfynet --ip 172.20.0.23 -p 5002:5002 -e NEWSLETTER_API_HOST=http://172.20.0.22:5001 -e UNQFY_API_HOST=http://172.20.0.21:5000 -e MONITOR_API_HOST=http://172.20.0.24:5003 --name logging_app --user node logging_image

MONITOR
docker run  --net unqfynet --ip 172.20.0.24 -p 5003:5003 -e NEWSLETTER_API_HOST=http://172.20.0.22:5001 -e UNQFY_API_HOST=http://172.20.0.21:5000 -e LOGGING_API_HOST=http://172.20.0.23:5002 --name monitor_app --user node monitor_image
```
### Guia de comandos para usar por consola:

## Comandos para Artistas:

Agrega el artista con el nombre de 'nombreDeArtista'  
``` 
addArtist name 'nombreArtista' country 'paisDeOrigen'
 ```  
Borrara al artista de Unqfy  
``` 
deleteArtist artistName 'artistName'
 ```    
Dado un Id , devuelve el artista con el Id pasado.  
 ``` 
getArtistById id numeroId
 ```  
Dado un nombre de artista, devuelve todos los tracks de éste.  
``` 
searchTracksByArtist name 'artistName'
 ``` 
  
  

## Comandos para Album:

Agrega un album a UNQfy con un id asociado a un artista, nombre y año.
  ``` 
addAlbum id id name 'nombreArtista' year aYear
 ``` 
Borrara el album de un artista en UNQfy
 ``` 
deleteAlbum artistName 'artistName' name 'albumName'
 ```
Dado un parametro Id, devuelve el album con el Id especificado.
 ``` 
 getAlbumById id id
 ```
  
  
  

## Comandos para Playlists:

 Agrega la playlist a UNQfy con los generos y duracion máxima dado.
 ``` 
addPlaylist name 'playlistName' genres 'genero1, genero2..'  duration numero
 ```  
  
Borra la playlist de UNQfy.
 ``` 
deletePlaylist name 'playlistName'
 ```
  
  ## Visado 2:

- Comandos  por consola agregados

Devuelve una lista con los titulos de los albums del artista.
 ``` 
getAlbumsForArtist name "artistName" 
 ```  
Agrega los albums que pertenecen al artista especificado (limitado a 5 a modo de prueba).
 ``` 
 populateAlbumsForArtist name "artistName" 
 ```
#### Aclaracion 
Para poder utilizar "populateAlbumsForArtist" se requiere que previamente se ejecute el siguiente comando desde la carpeta raiz del proyecto:
```
node generateSpotifyCredentials.js
```
Una vez ejecutado se genera un link que el usuario deberá abrir, dicho link abre una pagina que solicita usuario y contraseña de spotify, luego de ingresados e iniciado sesion ya puede utilizar el método.


