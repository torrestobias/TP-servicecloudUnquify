let Artist = require('./artist');
let Album = require('./album')

const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
let ExistingArtistException = require('./exceptions/non-existent-artist');
const NonExistentArtistException = require('./exceptions/non-existent-artist');
const NonExistentAlbumException = require('./exceptions/non-existent-album');

class UNQfy {

  constructor() {
    this.artists = [];
    this.idArtist = 0;
    this.idAlbum = 0;
  }

  addArtist(artistData) {
    let nuevoArtista = new Artist(artistData.name, artistData.country, this.idArtist);
    if (this.artists.some(artist => artist.name.toLowerCase() == artistData.name.toLowerCase())) {
      throw new ExistingArtistException(artistData);
    } else {
      console.log("Se crea el artista:" + nuevoArtista.getName());
      this.idArtist += 1;
      this.artists.push(nuevoArtista);
      return nuevoArtista;
    }
  }

  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    let nuevoAlbum = new Album(this.idAlbum, albumData.name, albumData.year);
    this.idAlbum += 1;
    this.getArtistById(artistId).addNewAlbum(nuevoAlbum);
    console.log("Se crea el album:" + nuevoAlbum.getName());
    return nuevoAlbum;
    /* Crea un album y lo agrega al artista con id artistId.
      El objeto album creado debe tener (al menos):
       - una propiedad name (string)
       - una propiedad year (number)
    */
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    /* Crea un track y lo agrega al album con id albumId.
    El objeto track creado debe tener (al menos):
        - una propiedad name (string),
        - una propiedad duration (number),
        - una propiedad genres (lista de strings)
    */
  }

  getArtistById(id) {
    console.log("Buscando artista numero:" + id);
    let artistaEncontrado = this.artists.find(artist => artist.id == id);
    if (artistaEncontrado === undefined) {
      throw new NonExistentArtistException(id);
    } else {
      console.log("Artista '" + artistaEncontrado.getName() + "' encontrado.");
      return artistaEncontrado;
    }
  }

  getAlbumById(id) {
    console.log("Buscando album numero:" + id);
    let albumEncontrado = this.artists.map(artist => artist.getAlbumById(id)).find(album => album !== undefined);
    if (albumEncontrado === undefined) {
      throw new NonExistentAlbumException(id);
    } else {
      console.log("Album: '" + albumEncontrado.getName() + "' encontrado.");
      return albumEncontrado;
    }
  }

  getTrackById(id) {

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

  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  Artist: Artist,
};

