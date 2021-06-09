
class NonExistentObjectException extends Error {
    constructor(objectType, arg){
        let argumento = typeof arg == 'number' ? 'id' : 'nombre' 
        super(`No existe un ${objectType} con el ${argumento} ingresado: ${arg} en el sistema`);
        this.name = `NonExistent${objectType}Exception`;
    }
}

module.exports = NonExistentObjectException;