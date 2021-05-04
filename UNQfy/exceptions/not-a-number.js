
class NotANumberException extends Error {
    constructor(id){
        super(`El id ingresado: ${id} no es un entero valido`);
        this.name = 'NotANumberException';
    }
}

module.exports = NotANumberException;