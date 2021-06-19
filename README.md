# cloud-grupo 5

#### Guia de comandos para usar por consola:

- Comandos para Artistas:

  ``` 
    - addArtist name 'nombreArtista' country 'paisDeOrigen' -> Agrega al artista con el nombre de 'nombreDeArtista'
    
    - deleteArtist artistName 'artistName' -> Borrara al artista de Unqfy
    
    - getArtistById id id -> Le pasas por parametro un ID y te devuelve el artista con el ID dado
     
    - searchTracksByArtist name 'artistName' -> Le pasas por parametro el nombre del artista y te devuelve todos los tracks de éste
  ```

- Comandos para Album:

  ``` 
    - addAlbum id id name 'nombreArtista' year aYear -> Agrega un album a UNQfy con un id asociado a un artista, nombre y año
    
    - deleteAlbum artistName 'artistName' name 'albumName' -> Borrara el album de un artista en UNQfy
    
    - getAlbumById id id -> Le pasas por parametro un ID y te devuelve el album con el ID dado
     
  ```

- Comandos para Playlists:

  ``` 
    - addPlaylist name 'playlistName' genres 'genero1, genero2...'  duration numero -> Agrega la playlist a unqfy con los generos y duracion maxima dados
    
    - deletePlaylist name 'playlistName' -> Borrara la playlist de Unqfy
  ```
  
  - Visado 2:

Comandos agregados por consola

 ``` 
    - getAlbumsForArtist name "artistName" -> devuelve una lista con los titulos de los albums del artista
    
    - populateAlbumsForArtist name "artistName" -> agrega los albums que pertenecen al artista especificado (limitado a 5 a modo de prueba)
  ```
Aclaracion: para poder utilizar "populateAlbumsForArtist" se requiere que previamente se ejecute el siguiente comando desde la carpeta raiz del proyecto:
  node generateSpotifyCredentials.js
Una vez ejecutado se genera un link que el usuario deberá abrir, dicho link abre una pagina que solicita usuario y contraseña de spotify, una vez ingresados e iniciado sesion ya puede utilizar 
el método.
