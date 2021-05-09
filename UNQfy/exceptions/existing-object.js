
class ExistingObjectException extends Error {

    constructor(object){
        super(`El ${object.constructor.name} ingresado: '${object.name}' ya existe en el sistema`);
        this.name = `Existing${object.constructor.name}Exception`;
    }
}

module.exports = ExistingObjectException;