# cloud-grupo 5

## CONFIGURACION DE CONTAINERS

### Para crear la red

```docker network create --subnet=172.20.0.0/16 unqfynet```
	
### Cada imagen se construye situandose en el directorio correspondiente	

#### /UNQfy

```docker build -t unqfy_image .```

#### /NEWSLETTER

```docker build -t newsletter_image .```

#### /LOGGING

```docker build -t logging_image .```

#### /MONITOR

```docker build -t monitor_image .```

### Cada servicio se instancia en el container quedando operativo. 	

#### UNQfy
```docker run  --net unqfynet --ip 172.20.0.21 -p 5000:5000 -e NEWSLETTER_API_HOST=http://172.20.0.22:5001 -e LOGGING_API_HOST=http://172.20.0.23:5002 -e MONITOR_API_HOST=http://172.20.0.24:5003 --name unqfy_app --user node unqfy_image```

#### NEWSLETTER
```docker run  --net unqfynet --ip 172.20.0.22 -p 5001:5001 -e UNQFY_API_HOST=http://172.20.0.21:5000 -e LOGGING_API_HOST=http://172.20.0.23:5002 -e MONITOR_API_HOST=http://172.20.0.24:5003 --name newsletter_app --user node newsletter_image```

#### LOGGING
```docker run  --net unqfynet --ip 172.20.0.23 -p 5002:5002 -e NEWSLETTER_API_HOST=http://172.20.0.22:5001 -e UNQFY_API_HOST=http://172.20.0.21:5000 -e MONITOR_API_HOST=http://172.20.0.24:5003 --name logging_app --user node logging_image```

#### MONITOR
```docker run  --net unqfynet --ip 172.20.0.24 -p 5003:5003 -e NEWSLETTER_API_HOST=http://172.20.0.22:5001 -e UNQFY_API_HOST=http://172.20.0.21:5000 -e LOGGING_API_HOST=http://172.20.0.23:5002 --name monitor_app --user node monitor_image```

#### (esto solo se realiza por unica vez luego si se quisiera iniciar un servicio utilizariamos "DOCKER START <SERVICE_APP_NAME>" Y para detenerlo "DOCKER STOP  <SERVICE_APP_NAME>")


# Guia de comandos para usar por consola:

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
Dado un nombre de artista, devuelve todos los tracks de ??ste.  
``` 
searchTracksByArtist name 'artistName'
 ``` 
  
  

## Comandos para Album:

Agrega un album a UNQfy con un id asociado a un artista, nombre y a??o.
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

 Agrega la playlist a UNQfy con los generos y duracion m??xima dado.
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
Una vez ejecutado se genera un link que el usuario deber?? abrir, dicho link abre una pagina que solicita usuario y contrase??a de spotify, luego de ingresados e iniciado sesion ya puede utilizar el m??todo.


