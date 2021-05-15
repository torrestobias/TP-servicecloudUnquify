const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const Album = require('./album');
const Track = require('./track');
const PlayList = require('./playlist');
const ExistingObjectException = require('./exceptions/existing-object');
const NonExistentObjectException = require('./exceptions/non-existent-object');

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

  getArtistByName(artistName) {
    // Retorna al artista con el nombre indicado, si es que existe
    let artist = this.artists.find(artist => artist.name.toLowerCase() === artistName.toLowerCase())
    if (artist !== undefined) {
      return artist
    } else {
      throw new NonExistentObjectException("Artist", artistName);
    }
  }

  getPlaylistById(id) {

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
    console.log('Artists :' + this.getNamesFromList(artists),
      'Albums: ' + this.getNamesFromList(albums),
      'Tracks: ' + this.getNamesFromList(tracks),
      'Playlists: ' + this.getNamesFromList(playlists)
    );
    return { artists, albums, tracks, playlists };
  }

  searchArtistByName(name) {
    return this.artists.filter(artist => artist.name.toLowerCase().includes(name.toLowerCase()));
  }

  searchAlbumsByName(name) {
    let album = this.getAllAlbums();
    return album.filter(album => album.name.toLowerCase().includes(name.toLowerCase()));
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
    return list.map(elem => elem.name);
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
      console.log("Se ha eliminado el album " + album.name + " del artista" + artist.name + " correctamente")
    } else {
      throw Error("No se pudo eliminar el album " + albumData.name + " ya que no existe")
    }
  }

  deletePlaylist(playlistData) {
    let playlist = this.playlist.find(playlist => playlist.getName() === playlistData.name);
    if (playlist !== undefined) {
      this.playlist = this.playlist.filter(pl => pl.getName() !== playlist.name)
      console.log("Se ha eliminado la playlist " + playlist.name + " correctamente")
    } else {
      throw Error("No se pudo eliminar a playlist " + playlistData.name + " ya que no existe")
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
    console.log("create", name, genresToInclude, maxDuration)
    let nuevoPlaylist = new PlayList(name, genresToInclude, maxDuration);
    this.checkExistentObject(this.playlist, nuevoPlaylist);
    //cargo los tracks en la playlist
    let temas = this.getTracksMatchingGenres(genresToInclude);
    nuevoPlaylist.addTracksToPlaylist(temas);
    this.playlist.push(nuevoPlaylist);
    console.log("Creación con éxito, Playlist:" + name);
    return nuevoPlaylist;
  }


  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
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

