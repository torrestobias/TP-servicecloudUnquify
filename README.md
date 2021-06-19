# cloud-grupo 5

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


