const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const { Artist } = require('./unqfy');
const NotANumberException = require('./exceptions/not-a-number');
const ExistingArtistException = require('./exceptions/existing-artist');
const NotAValidCommandException = require('./exceptions/not-a-valid-command')
const WrongArgumentsException = require('./exceptions/wrong-arguments');
const InexistingArtistException = require('./exceptions/non-existent-artist');
const NonExistentAlbumException = require('./exceptions/non-existent-album')

class ValidateEntry {

    constructor() {
    };

    // Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
    getUNQfy(filename = 'data.json') {
        let unqfy = new unqmod.UNQfy();
        if (fs.existsSync(filename)) {
            unqfy = unqmod.UNQfy.load(filename);
        }
        return unqfy;
    }

    // Guarda la instancia de UNQfy.
    saveUNQfy(unqfy, filename = 'data.json') {
        unqfy.save(filename);
    }

    // Parsea a numero o lanza excepcion si no es posible
    parseIntEntry(entry) {
        if (entry === undefined) {
            throw new WrongArgumentsException(`'${entry}'`);
        }
        let parse = entry.split('').map(e => parseInt(e));
        if (parse.some(isNaN)) {
            throw new NotANumberException(entry);
        }
        return parse.join('');
    };

    // Valida que las key ingresadas sean las requeridas por el comando ejecutado
    validArgumentsCheck(requieres, objectdata) {
        let nameParams = Object.keys(objectdata);
        if (!(nameParams.every(k => requieres.includes(k)) &&
            requieres.every(r => nameParams.includes(r)))) {
            throw new WrongArgumentsException(`${nameParams}`);
        }
        return objectdata;
    }

    // Chequea que el comando ingresado sea valido
    itsAValidCommand(command) {
        if (!Object.keys(this.functionList).some(commandlisted => commandlisted == command)) {
            throw new NotAValidCommandException(command)
        }
    }

    // Ejecuta el comando enviado desde MAIN() y captura todas las excepciones del flujo
    execute(input) {
        let args = input;
        const command = args.splice(0, 1);
        try {
            this.itsAValidCommand(command);
            this.executeCommand(command, args);
        } catch (error) {
            if (error instanceof NotAValidCommandException) {
                console.log(error.name, error.message)
            } else {
                if (error instanceof WrongArgumentsException) {
                    console.log(error.name, error.message)
                } else {
                    if (error instanceof NotANumberException) {
                        console.log(error.name, error.message)
                    } else {
                        if (error instanceof ExistingArtistException) {
                            console.log(error.name, error.message)
                        } else {
                            if (error instanceof InexistingArtistException) {
                                console.log(error.name, error.message)
                            } else {
                                if (error instanceof NonExistentAlbumException) {
                                    console.log(error.name, error.message)
                                } else {
                                    throw error
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Handlers de cada comando -->
    addArtistHandler(unqfy, artistData) {
        return unqfy.addArtist(this.validArgumentsCheck(["name", "country"], artistData));
    };

    addAlbumHandler(unqfy, albumData) {
        return unqfy.addAlbum(this.parseIntEntry(albumData.artistId), this.validArgumentsCheck(["artistId", "name", "year"], albumData));
    };

    addTrackHandler(unqfy, trackData) {
        return unqfy.addTrack(this.parseIntEntry(trackData.albumId), this.validArgumentsCheck(["albumId", "name", "duration", "genres"], trackData));
    };

    getArtistByIdHandler(unqfy, objId) {
        return unqfy.getArtistById(this.parseIntEntry(objId.id));
    };

    getAlbumByIdHandler(unqfy, objId) {
        return unqfy.getAlbumById(this.parseIntEntry(objId.id));
    };

    getTrackByIdHandler(unqfy, objId) {
        return unqfy.getTrackById(this.parseIntEntry(objId.id))
    };

    getPlaylistByIdHandler(unqfy, objId) {
        return unqfy.getPlaylistById(this.parseIntEntry(objId.id));
    };

    getTracksMatchingGenresHandler(unqfy, genres) {
        return unqfy.getTracksMatchingGenres(genres);
    };

    getTracksMatchingArtistHandler(unqfy, artistName) {
        return unqfy.getTracksMatchingArtist(artistName);
    };

    createPlaylistHandler(unqfy, name, genresToInclude, maxDuration) {
        return unqfy.createPlaylist(name, genresToInclude, maxDuration);
    };


    // Objeto que relaciona cada comando con su handler 
    functionList = {
        addArtist: (unqfy, artistData) => this.addArtistHandler(unqfy, artistData),
        addAlbum: (unqfy, albumData) => this.addAlbumHandler(unqfy, albumData),
        addTrack: (unqfy, trackData) => this.addTrackHandler(unqfy, trackData),
        getArtistById: (unqfy, objs) => this.getArtistByIdHandler(unqfy, objs),
        getAlbumById: (unqfy, objs) => this.getAlbumByIdHandler(unqfy, objs),
        getTrackById: (unqfy, objs) => this.getTrackByIdHandler(unqfy, objs),
        getPlaylistById: (unqfy, objs) => this.getPlaylistByIdHandler(unqfy, objs),
        getTracksMatchingGenres: (unqfy, genres) => this.getTracksMatchingGenresHandler(unqfy, genres),
        getTracksMatchingArtist: (unqfy, artistName) => this.getTracksMatchingArtistHandler(unqfy, artistName),
        createPlaylist: (unqfy, name, genresToInclude, maxDuration) => this.createPlaylistHandler(unqfy, name, genresToInclude, maxDuration)
    }

    // Arma el dataObject, 
    makeDataObject(args) {
        let input = args;
        const dataObject = new Object();
        while (input.length !== 0) {
            dataObject[input.splice(0, 1)] = input.splice(0, 1)[0]
        };
        return dataObject;
    }

    // Carga una instancia de UNQfy, llama la funcion con el dataObject y guarda la instancia de UNQfy.
    executeCommand(command, args) {
        const unqfy = this.getUNQfy();
        this.functionList[command](unqfy, this.makeDataObject(args));
        this.saveUNQfy(unqfy);
    }
}

module.exports = ValidateEntry;