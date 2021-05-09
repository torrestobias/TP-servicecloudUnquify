
class NonExistentTrackException extends Error {
    constructor(id){
        super(`No existe un Track con el id ingresado: ${id} en el sistema`);
        this.name = 'NonExistentTrackException';
    }
}

module.exports = NonExistentTrackException;