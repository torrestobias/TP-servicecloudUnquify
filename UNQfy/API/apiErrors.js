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
        super('BadRequestError',400,"BAD_REQUEST")
    }
}

class DuplicateEntitie extends RequestError{
    constructor(){
        super('Error duplicate Entitie',409,"RESOURCE_ALREADY_EXISTS")
    }
}

class ResourceNotFound extends RequestError{
    constructor(){
        super('RelatedResourceNotFound',404, "RESOURCE_NOT_FOUND")
    }
}
module.exports = {
    BadRequest,
    DuplicateEntitie,
    ResourceNotFound
}