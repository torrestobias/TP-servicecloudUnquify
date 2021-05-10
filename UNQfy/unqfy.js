const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const Album = require('./album');
const Track = require('./track');
const PlayList = require('./playlist');
const ExistingObjectException = require('./exceptions/existing-object');
const NonExistentObjectException = require('./exceptions/non-existent-object');
const ExistingPlaylistException = require('./exceptions/existing-playlist-exception');



class UNQfy {

  constructor() {
    this.artists = [];
    this.playlist = [];
    this.idArtist = 0;
    this.idAlbum = 0;
    this.idTrack = 0;
  }

  addArtist(artistData) {
    let nuevoArtista = new Artist(artistData.name, artistData.country, this.idArtist);
    this.checkExistentObject(this.artists, nuevoArtista);
    this.incrementIdArtist();
    this.addNewObject(artist => this.artists.push(artist), nuevoArtista)
    return nuevoArtista;
  };

  addAlbum(artistId, albumData) {
    let nuevoAlbum = new Album(this.idAlbum, albumData.name, albumData.year);
    let artist = this.getArtistById(artistId);
    this.checkExistentObject(artist.getAlbums(), nuevoAlbum);
    this.incrementIdAlbum();
    this.addNewObject(album => artist.addNewAlbum(album), nuevoAlbum)
    return nuevoAlbum;
  };

  addTrack(albumId, trackData) {
    let nuevoTrack = new Track(this.idTrack, trackData.name, trackData.genres, trackData.duration);
    let album = this.getAlbumById(albumId);
    this.checkExistentObject(album.getTracks(), nuevoTrack);
    this.incrementIdTrack();
    this.addNewObject(track => album.addNewTrack(track), nuevoTrack)
    return nuevoTrack;
  };

  checkExistentObject(objects, newObject) {
    if (objects.some(object => object.name.toLowerCase() == newObject.name.toLowerCase())) {
      throw new ExistingObjectException(newObject);
    }
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

  checkNonExistentObject(objectName, id, searchingOject) {
    console.log(`Buscando ${objectName} número: ${id}`);
    if (searchingOject === undefined) {
      throw new NonExistentObjectException(objectName, id);
    } else {
      console.log(`${objectName}: '${searchingOject.getName()}' encontrado.`);
    }
  }

  getPlaylistById(id) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

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
      let nuevoPlaylist = new PlayList(name, genresToInclude, maxDuration);
      if(this.playlist.some(playli => playli.name.toLowerCase() == name.toLowerCase())){
        throw new ExistingPlaylistException(nuevoPlaylist);
      }
      else{
        //cargo los tracks en la playlist
        //let temas = this.getTracksMatchingGenres(genresToInclude);
        //this.nuevoPlaylist.addTracksToPlaylist(temas);
        this.playlist.push(nuevoPlaylist);
        console.log("Creación con éxito, Playlist:" + name);
        return nuevoPlaylist;
      }
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  Artist: Artist,
  Album: Album,
  Track: Track,
};

