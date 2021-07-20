class RequestError extends Error {
    constructor(name, status, errorCode, message = null){
        super(message || name)
        this.name = name;
        this.status = status;
        this.errorCode = errorCode;
    }
    toJSON(){
        return {
            status:this.status,
            errorCode: this.errorCode
        }
    }
}

class NotifyFailed extends RequestError{
    constructor(){
        super('Falló el envío de la notificación',500, "INTERNAL_SERVER_ERROR")
    }
}

class RelatedResourceNotFound extends RequestError{
    constructor(){
        super('El artista al que se intenta suscribir/desuscribir/notificar/borrar no existe',404, "RELATED_RESOURCE_NOT_FOUND")
    }
}

class IncompleteJson extends RequestError{
    constructor(){
        super('Falta un argumento en el JSON',400,"BAD_REQUEST")
    }
}

class InvalidJson extends RequestError{
    constructor(){
        super('Se envía un Json invalido en el Body',400,"BAD_REQUEST")
    }
}

class ResourceNotFound extends RequestError{
    constructor(){
        super('URL invalida/inexistente',404, "RESOURCE_NOT_FOUND")
    }
}

class Unexpected extends RequestError{
    constructor(){
        super('Fallo inesperado',500, "INTERNAL_SERVER_ERROR")
    }
}

module.exports = {
    IncompleteJson,
    InvalidJson,
    RelatedResourceNotFound,
    NotifyFailed,
    Unexpected,
    ResourceNotFound
}
