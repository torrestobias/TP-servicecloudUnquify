
class ExistingObjectException extends Error {

    constructor(object){
        let consname = object.constructor.name;
        let articulo = consname != 'PlayList' ? 'El' : 'La'
        let adjetivo = consname != 'PlayList' ? 'ingresado:' : 'ingresada:'
        super(`${articulo} ${consname} ${adjetivo} '${object.name}' ya existe en el sistema`);
        this.name = `Existing${object.constructor.name}Exception`;
    }
}

module.exports = ExistingObjectException;