
class NotAValidCommandException extends Error {
    constructor(command){
        super(`El comando ingresado: ${command} no es valido`);
        this.name = 'NotAValidCommandException';
    }
}

module.exports = NotAValidCommandException;