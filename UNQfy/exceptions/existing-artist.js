
class ExistingArtistException extends Error {
    constructor(artist){
        super(`El artista ingresado: ${artist.name} ya existe en el sistema`);
        this.name = 'ExistingArtistException';
    }
}

module.exports = ExistingArtistException;