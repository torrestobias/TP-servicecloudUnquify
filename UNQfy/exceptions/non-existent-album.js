
class NonExistentAlbumException extends Error {
    constructor(id){
        super(`No existe un album con el id ingresado: ${id} en el sistema`);
        this.name = 'NonExistentAlbumException';
    }
}

module.exports = NonExistentAlbumException;