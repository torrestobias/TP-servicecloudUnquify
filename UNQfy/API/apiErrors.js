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

module.exports = {
    BadRequest
}