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

class BadRequest extends RequestError{
    constructor(){
        super('Bad Request Error',400,"BAD_REQUEST")
    }
}

class DuplicateEntitie extends RequestError{
    constructor(){
        super('Duplicate Entitie Error',409,"RESOURCE_ALREADY_EXISTS")
    }
}

class RelatedResourceNotFound extends RequestError{
    constructor(){
        super('Related Resource Not Found Error',404, "RELATED_RESOURCE_NOT_FOUND")
    }
}

class ResourceNotFound extends RequestError{
    constructor(){
        super('Resource Not Found Error',404, "RESOURCE_NOT_FOUND")
    }
}

class Unexpected extends RequestError{
    constructor(){
        super('Unexpected Error',500, "INTERNAL_SERVER_ERROR")
    }
}

module.exports = {
    BadRequest,
    DuplicateEntitie,
    RelatedResourceNotFound,
    Unexpected,
    ResourceNotFound
}
