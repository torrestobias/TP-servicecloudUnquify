const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const Album = require('./album');
const Track = require('./track');
const ExistingArtistException = require('./exceptions/existing-artist');
const NonExistentArtistException = require('./exceptions/non-existent-artist');
const NonExistentAlbumException = require('./exceptions/non-existent-album');
const NonExistentTrackException = require('./exceptions/non-existent-track');

class UNQfy {

  constructor() {
    this.artists = [];
    this.idArtist = 0;
    this.idAlbum = 0;
    this.idTrack = 0;
  }

  addArtist(artistData) {
    let nuevoArtista = new Artist(artistData.name, artistData.country, this.idArtist);
    if (this.artists.some(artist => artist.name.toLowerCase() == artistData.name.toLowerCase())) {
      throw new ExistingArtistException(artistData);
    } else {
      this.idArtist += 1;
      this.artists.push(nuevoArtista);
      console.log("Se crea el artista:" + nuevoArtista.getName());
      return nuevoArtista;
    }
  }

  addAlbum(artistId, albumData) {
    let nuevoAlbum = new Album(this.idAlbum, albumData.name, albumData.year);
    this.getArtistById(artistId).addNewAlbum(nuevoAlbum);
    this.idAlbum += 1;
    console.log("Se crea el album:" + nuevoAlbum.getName());
    return nuevoAlbum;
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    let nuevoTrack = new Track(this.idTrack, trackData.name, trackData.genres, trackData.duration);
    this.getAlbumById(albumId).addNewTrack(nuevoTrack);
    this.idTrack += 1;
    console.log("Se crea el track:" + nuevoTrack.getName());
    return nuevoTrack;
  }

    /* Crea un track y lo agrega al album con id albumId.
    El objeto track creado debe tener (al menos):
        - una propiedad name (string),
        - una propiedad duration (number),
        - una propiedad genres (lista de strings)
    */

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
    console.log("Buscando track numero:" + id);
    let trackEncontrado = this.artists.flatMap(artist => artist.getAlbums()).map(album => album.getTrackById(id)).find(track => track !== undefined);
    if (trackEncontrado === undefined) {
      throw new NonExistentTrackException(id);
    } else {
      console.log("Track: '" + trackEncontrado.getName() + "' encontrado.");
      return trackEncontrado;
    }
  }

  getPlaylistById(id) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    
    const albums = this.artists.flatMap(artist => artist.albums);
    const tracks = albums.flatMap(album => album.tracks);
    const trackInGenre = tracks.filter(track => track.genres.some(genre => genres.includes(genre)));

    return trackInGenre;

  }

  

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

    const artistNameValue = artistName.toLowerCase();
    const artist = this.artists.filter(artist => artist.name.toLowerCase() === artistNameValue)[0];

    if(artist === null || artist === undefined){

      return [];
    } else{

      return artist.getTrackArtist();
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

