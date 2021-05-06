
class NonExistentArtistException extends Error {
    constructor(id){
        super(`No existe un artista con el id ingresado: ${id} en el sistema`);
        this.name = 'NonExistentArtistException';
    }
}

module.exports = NonExistentArtistException;