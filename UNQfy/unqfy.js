const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const Album = require('./album');
const Track = require('./track');
const PlayList = require('./playlist');
const User = require('./user');
const ExistingObjectException = require('./exceptions/existing-object');
const NonExistentObjectException = require('./exceptions/non-existent-object');
const configJson = require('./spotifyCreds.json');
const { RSA_PKCS1_OAEP_PADDING } = require('constants');

class UNQfy {

  constructor() {
    this.artists = [];
    this.playlist = [];
    this.users = [];
    this.idArtist = 0;
    this.idAlbum = 0;
    this.idTrack = 0;
    this.idUser = 0;
    this.idPlaylist = 0;
  }

  addArtist(artistData) {
    let nuevoArtista = new Artist(artistData.name, artistData.country, this.idArtist);
    if(!this.checkExistentObject(this.artists, nuevoArtista)){
      this.incrementIdArtist();
      this.addNewObject(artist => this.artists.push(artist), nuevoArtista)
      this.save('data.json');
    }
    else{
      console.log("Ya existe el usuario "+artistData.name)
    }
    return nuevoArtista;
  };

  addUser(userData){
    let newUser = new User(this.idUser, userData.nickname, userData.name);
    if(!this.checkExistentObject(this.users, newUser)){
      this.incrementIdUser();
      this.addNewObject(user => this.users.push(user), newUser)
      this.save('data.json');
    }
    else{
      console.log("Ya existe el usuario "+userData.name)
    }
    return newUser;
  }

  addAlbum(artistId, albumData) {
    let nuevoAlbum = new Album(this.idAlbum, albumData.name, albumData.year);
    let artist = this.getArtistById(artistId);
    if(!this.checkExistentObject(artist.getAlbums(), nuevoAlbum)){
      this.incrementIdAlbum();
      this.addNewObject(album => artist.addNewAlbum(album), nuevoAlbum)
      this.save('data.json');
    }
    else{
      console.log("Ya existe el album "+albumData.name)
    }
    
    
    return nuevoAlbum;
  };

  addTrack(albumId, trackData) {
    let nuevoTrack = new Track(this.idTrack, trackData.name, trackData.genres, trackData.duration);
    let album = this.getAlbumById(albumId);
    if(!this.checkExistentObject(album.getTracks(), nuevoTrack)){
      this.incrementIdTrack();
      this.addNewObject(track => album.addNewTrack(track), nuevoTrack)
      this.save('data.json');
    }
    else{
      console.log("Ya existe el track "+trackData.name)
    }
    
    return nuevoTrack;
  };


  checkExistentObject(objects, newObject) {
    return objects.some(object => object.name.toLowerCase() == newObject.name.toLowerCase())
  }

  addNewObject(fx, newObject) {
    fx(newObject);
    console.log(`Se crea el ${newObject.constructor.name}: ${newObject.getName()}`);
  }

  incrementIdArtist() {
    this.idArtist += 1;
  }

  incrementIdAlbum() {
    this.idAlbum += 1;
  }

  incrementIdTrack() {
    this.idTrack += 1;
  }

  incrementIdUser(){
    this.idUser += 1;
  }

  getArtistById(id) {
    let artistaEncontrado = this.artists.find(artist => artist.id == id);
    this.checkNonExistentObject("Artist", id, artistaEncontrado)
    return artistaEncontrado;
  }

  getAlbumById(id) {
    let albumEncontrado = this.artists.map(artist => artist.getAlbumById(id)).find(album => album !== undefined);
    this.checkNonExistentObject("Album", id, albumEncontrado)
    return albumEncontrado;
  }

  getTrackById(id) {
    let trackEncontrado = this.artists.flatMap(artist => artist.getAlbums()).map(album => album.getTrackById(id)).find(track => track !== undefined);
    this.checkNonExistentObject("Track", id, trackEncontrado)
    return trackEncontrado;
  }


  getPlaylistById(id) {
    let playListEncontrado = this.playlist.find(playlist => playlist.id === id);
    this.checkNonExistentObject("Playlist",id,playListEncontrado);
    return playListEncontrado;
  }

  checkNonExistentObject(objectName, id, searchingOject) {
    console.log(`Buscando ${objectName} número: ${id}`);
    if (searchingOject === undefined) {
      throw new NonExistentObjectException(objectName, id);
    } else {
      console.log(`${objectName}: '${searchingOject.getName()}' encontrado.`);
    }
  }

  getArtistByName(artistName) {
    // Retorna al artista con el nombre indicado, si es que existe
    let artist = this.artists.find(artist => artist.name.toLowerCase() === artistName.toLowerCase())
    if (artist !== undefined) {
      return artist
    } else {
      throw new NonExistentObjectException("Artist", artistName);
    }
  }

  

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

    const albums = this.artists.flatMap(artist => artist.albums);
    const tracks = albums.flatMap(album => album.tracks);
    const trackInGenre = tracks.filter(track => track.getGenres().some(genre => genres.includes(genre)));

    return trackInGenre;

  }

  searchByName(name) {
    let artists = this.searchArtistByName(name);
    let albums = this.searchAlbumsByName(name);
    let tracks = this.searchTracksByName(name);
    let playlists = this.searchPlaylistByName(name);
    console.log('Artists: ' + this.getNamesFromList(artists));
    console.log('Albums: ' + this.getNamesFromList(albums));
    console.log('Tracks: ' + this.getNamesFromList(tracks));
    console.log('Playlists: ' + this.getNamesFromList(playlists));
    return { artists, albums, tracks, playlists };
  }

  searchArtistByName(name) {
    return this.artists.filter(artist => artist.name.toLowerCase().includes(name.toLowerCase()));
  }

  searchAlbumsByName(name) {
    let album = this.getAllAlbums();
    if(album.length===0){
      return true
    }else{return album.filter(album => album.name.toLowerCase().includes(name.toLowerCase()));}
     
  }

  getAllTracks() {
    let allTracks = this.getAllAlbums().map(album => album.tracks).reduce(function (a, b) {
      return a.concat(b)
    }, [])
    return allTracks;
  }

  getAllAlbums() {
    if (this.artists.length === 0) {
      return []
    }
    return this.artists.map(artist => artist.albums).reduce((a, b) => {
      return a.concat(b)
    })
  }

  getNamesFromList(list) {
    if(list.length>0){
      return list.map(elem => elem.name);
    }
    else{
      return "";
    }
  }

  searchTracksByName(name) {
    let tracks = this.getAllTracks();
    return tracks.filter(track => track.name.toLowerCase().includes(name.toLowerCase()));
  }

  searchPlaylistByName(name) {
    return this.playlist.filter(playlists => playlists.name.includes(name));
  }

  deleteTrack(trackData) {
    let artist = this.getArtistByName(trackData.artistName);
    let album = artist.getAlbums().find(album => album.getTracks().map(track => track.getName()).includes(trackData.name))
    if (album == undefined) {
      throw Error("No se pudo eliminar el track " + trackData.name + " ya que no existe")
    }
    let track = album.getTrackByName(trackData.name);
    if (artist !== undefined && album !== undefined && track !== undefined) {
      album.delTrack(track.getId());
      this.playlist.forEach(playlist => playlist.removeTracks([track]))
      this.idTrack-=1;
      this.save('data.json')
      console.log("Se ha eliminado el track " + track.name + " del album " + album.name + " del artista " + artist.name + " correctamente")
    } else {
      throw Error("No se pudo eliminar el track " + trackData.name + " ya que no existe")
    }
  }

  deleteArtist(artistName) {
    let artist = this.getArtistByName(artistName.artistName)
    if (artist !== undefined) {
      let tracksArtist = this.getTracksMatchingArtist(artistName.artistName)
      this.artists = this.artists.filter(art => art.name !== artist.name)
      this.playlist.forEach(playlist => playlist.removeTracks(tracksArtist))
      this.idArtist-=1;
      this.save('data.json')
      console.log("Se ha eliminado el artista " + artist.name + " correctamente")
    } else {
      throw Error("No se pudo eliminar el artista " + artistName.artistName + " ya que no existe")
    }
  };

  deleteAlbum(albumData) {
    let artist = this.getArtistByName(albumData.artistName);
    let album = artist.getAlbums().find(album => album.getName() === albumData.name);
    if (artist !== undefined && album !== undefined) {
      let tracksAlbum = album.getTracks();
      artist.delAlbumByName(albumData.name);
      this.playlist.forEach(playlist => playlist.removeTracks(tracksAlbum))
      this.idAlbum-=1;
      this.save('data.json')
      console.log("Se ha eliminado el album " + album.name + " del artista " + artist.name + " correctamente")
    } else {
      throw Error("No se pudo eliminar el album " + albumData.name + " ya que no existe")
    }
  }

  deletePlaylist(playlistData) {
    let playlist = this.playlist.find(playlist => playlist.getName() === playlistData.name);
    if (playlist !== undefined) {
      this.playlist = this.playlist.filter(pl => pl.getName() !== playlist.name)
      this.idPlaylist-=1;
      this.save('data.json')
      console.log("Se ha eliminado la playlist " + playlist.name + " correctamente")
    // } else {
    //   throw Error("No se pudo eliminar a playlist " + playlistData.name + " ya que no existe")
  }
  };

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

    const artistNameValue = artistName.toLowerCase();
    const artist = this.artists.filter(artist => artist.name.toLowerCase() === artistNameValue)[0];

    if (artist === null || artist === undefined) {

      return [];
    } else {

      return artist.getTrackArtist();
    }

  }

  searchTracksByArtist(artist) {
    let tracks = this.getTracksMatchingArtist(artist);
    console.log(
      'Tracks: ' + tracks.map(track => track.getName()),
    );
    return { tracks };
  }

  searchTracksByGenre(genre) {
    let tracks = this.getTracksMatchingGenres([genre]);
    console.log(
      'Tracks: ' + tracks.map(track => track.getName()),
    );
    return { tracks };
  }


  searchArtistByAlbumId(albumId){
    let album = this.getAlbumById(albumId);
    let artista = this.artists.filter(elem => elem.thisAlbumIsCreated(album))
    if(artista.length>0){
      return artista[0];
    }
    else{
      return [];
    }
  }

  


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
    /*** Crea una playlist y la agrega a unqfy. ***
      El objeto playlist creado debe soportar (al menos):
        * una propiedad name (string)
        * un metodo duration() que retorne la duración de la playlist.
        * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
    */
      let tracks = this.getAllTracks();
      let tracksToPlaylist = tracks.filter(track => track.trackInclude(genresToInclude))
      let nuevoPlaylist = new PlayList(this.idPlaylist,name, genresToInclude, maxDuration);
      if(this.playlist.some(playli => playli.name.toLowerCase() == name.toLowerCase())){
        throw new ExistingPlaylistException(nuevoPlaylist);
      }
      else{
        //cargo los tracks en la playlist
        nuevoPlaylist.addTracksToPlaylist(tracksToPlaylist);
        this.playlist.push(nuevoPlaylist);
        this.idPlaylist+=1;
        this.save('data.json');
        console.log("Creación con éxito, Playlist:" + name);
        return nuevoPlaylist;
      }
  }

  updateYearOfAlbum(album, year){
    album.updateYear(year);
    this.save('data.json');
  }

  getAlbumsForArtist(artistName){

      const artist = this.getArtistByName(artistName);

      const allAlbumsForArtist = artist.albums.map(album => album.name);

      return allAlbumsForArtist;
  }



   /*Método que consulta los álbumes de dicho artista en Spotify,
   en base a los datos recibidos instancia los álbumes correspondientes y los asocia al artista. */
   populateAlbumsForArtist(artistName){
    var cred = configJson['access_token'];
    const rp = require('request-promise');
    const options = {
      url: 'https://api.spotify.com/v1/search/?q='+artistName+'&type=artist&limit=1',
      headers: { Authorization: 'Bearer ' + cred },
      json: true,
    };
    rp.get(options).then((response)=>{
      let artistId = response.artists.items[0].id;
      this.getAlbumsForArtisSpotify(artistId,cred,rp,artistName);
    })
     .catch((ex)=>{
       throw new NonExistentObjectException(ex, "No existe el artista")
     })
   }

   updateArtistWithNewData(artist, name, country){
      artist.updateArtist(name,country);
      this.save('data.json'); 
   }

   

   getAlbumsForArtisSpotify(artistIdSpotify, cred, request,artistName){
    var artist = this.getArtistByName(artistName);
    const options = {
      url: 'https://api.spotify.com/v1/artists/'+artistIdSpotify+'/albums?limit=5',  //////////////////Limite de 5 para no cargar tanta cantidad 
      headers: { Authorization: 'Bearer ' + cred },
      json: true,
    };
    request.get(options).then((response) => {
    let listaAlbums=response.items;
    listaAlbums.map(elem=>{
      artist.addNewAlbum(new Album(this.idAlbum, elem.name, elem.release_date.slice(0,4)));
      this.incrementIdAlbum();
    })
      this.save('data.json');
    })
   }






  save(filename = 'data.json') {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData,null, 2));
   
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, PlayList];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  Artist: Artist,
  Album: Album,
  Track: Track,
  PlayList: PlayList,
};

