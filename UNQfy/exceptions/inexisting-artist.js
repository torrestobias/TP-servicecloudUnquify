
class InexistingArtistException extends Error {
    constructor(id){
        super(`No existe un artista con el id ingresado: ${id} en el sistema`);
        this.name = 'InexistingArtistException';
    }
}

module.exports = InexistingArtistException;