
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
let NotANumberException = require('./exceptions/not-a-number');
let ExistingArtistException = require('./exceptions/existing-artist');
const { Artist } = require('./unqfy');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

function parseIntEntry(entry) {
  let parse = entry.split('').map(e => parseInt(e));
  if (parse.some(isNaN)) {
    throw new NotANumberException(entry);
  }
  return parse.join('');
}

function validIdCheck(input) {
  let artist;
  try {
    artist = unqfy.getArtistById(parseIntEntry(input));
  } catch (error) {
    if (error instanceof NotANumberException) {
      console.log(error.name, error.message)
    } else {
      throw error
    }
  }
  return artist;
}


function exixtingArtistCheck(unqfy, artistData) {
  let artistChecked;
  try {
    artistChecked = unqfy.addArtist(artistData);
  } catch (error) {
    if (error instanceof ExistingArtistException) {
      console.log(error.name, error.message)
    } else {
      throw error
    }
  }
  return artistChecked;
}

const functionList = {
  addArtist: function (unqfy, artistData) { return exixtingArtistCheck(unqfy, artistData) },
  addAlbum: function (unqfy, artistId, albumData) { return unqfy.addAlbum(artistId, albumData) },
  addTrack: function (unqfy, albumId, trackData) { return unqfy.addTrack(albumId, trackData) },
  getArtistById: function (unqfy, objId) { return validIdCheck(objId.id) },
  getAlbumById: function (unqfy, objId) { return unqfy.getAlbumById(objId.id) },
  getTrackById: function (unqfy, objId) { return unqfy.getTrackById(objId.id) },
  getPlaylistById: function (unqfy, objId) { return unqfy.getPlaylistById(objId.id) },
  getTracksMatchingGenres: function (unqfy, genres) { return unqfy.getTracksMatchingGenres(genres) },
  getTracksMatchingArtist: function (unqfy, artistName) { return unqfy.getTracksMatchingArtist(artistName) },
  createPlaylist: function (unqfy, name, genresToInclude, maxDuration) { return unqfy.createPlaylist(name, genresToInclude, maxDuration) }
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.
 
  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks
 
    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album
 
    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero
 
    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.
 
    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.
 
  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)
   
*/

function executeCommand(userInput) {
  input = userInput;
  command = input.splice(0, 1);
  objs = new Object();

  while (input.length !== 0) {
    objs[input.splice(0, 1)] = input.splice(0, 1)[0]
  };

  unqfy = getUNQfy();
  functionList[command](unqfy, objs)
  saveUNQfy(unqfy);
}

function main(/*args*/) {

  userInput = process.argv;
  //userInput = args
  console.log('arguments: ');
  userInput.splice(0, 2).forEach(argument => console.log(argument));

  executeCommand(userInput);
}
//const args = process.argv
main(/*args*/);