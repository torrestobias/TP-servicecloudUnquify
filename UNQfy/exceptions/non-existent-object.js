
class NonExistentObjectException extends Error {
    constructor(objectType, id){
        super(`No existe un ${objectType} con el id ingresado: ${id} en el sistema`);
        this.name = `NonExistent${objectType}Exception`;
    }
}

module.exports = NonExistentObjectException;