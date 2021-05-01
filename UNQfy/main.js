

const fs = require('fs'); // necesitado para guardar/cargar unqfy
//const { stringify } = require('querystring');
const unqmod = require('./unqfy'); // importamos el modulo unqfy
let NotANumberException = require('./exceptions');
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

function itsAValidEntry(entry) {
  if (entry.split('').map(e => parseInt(e)).some(isNaN)) {
    throw new NotANumberException(entry);
  }
  else { return true }
}

const functionList = {
  addArtist: function(){getUNQfy().addArtist()}//, 
  /* addAlbum: unqmod.addAlbum(artistId, albumData), 
  addTrack: unqmod.addTrack(albumId, trackData), 
  getArtistById: unqmod.getArtistById(id), 
  getAlbumById: unqmod.getAlbumById(id), 
  getTrackById: unqmod.getTrackById(id), 
  getPlaylistById: unqmod.getPlaylistById(id), 
  getTracksMatchingGenres: unqmod.getTracksMatchingGenres(genres), 
  getTracksMatchingArtist: unqmod.getTracksMatchingArtist(artistName), 
  createPlaylist: unqmod.createPlaylist(name, genresToInclude, maxDuration)
 */}


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

  functionList[command](objs);

  saveUNQfy(unqfy);
}

function main() {

  userInput = process.argv;
  console.log('arguments: ');
  process.argv.splice(0, 2).forEach(argument => console.log(argument));


  executeCommand(userInput);
}
/*   let entrada = process.argv;

  switch (entrada[2]) {
    case 'addArtist':
      unqfy = getUNQfy();
      console.log(entrada);
      unqfy.addArtist({ "name": entrada[3], "country": entrada[4] });
      saveUNQfy(unqfy);
      break;
    case 'getArtistById':
      unqfy = getUNQfy();
      let ok = false;
      try {
        ok = itsAValidEntry(entrada[3]);
      } catch (error) {
        if (error instanceof NotANumberException) {
          console.log(error.name, error.message)
        } else {
          throw error
        }
      }
      if (ok) {
        unqfy.getArtistById(entrada[3]);
      }
      break;
    default:
      retorno = false;
  };
 }*/
main();
