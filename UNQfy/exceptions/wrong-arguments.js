
class WrongArgumentsException extends Error {
    constructor(args){
        super(`Los argumentos ingresados: ${args} no son los requeridos`);
        this.name = 'WrongArgumentsException';
    }
}

module.exports = WrongArgumentsException;