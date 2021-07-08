const { IncompleteJson,
    InvalidJson,
    RelatedResourceNotFound,
    NotifyFailed,
    Unexpected,
    ResourceNotFound } = require("./apiErrors");
/*
const ExistingObjectException = require('../exceptions/existing-object');
const NonExistentObjectException = require('../exceptions/non-existent-object');
const NotANumberException = require('../exceptions/not-a-number');
const WrongArgumentsException = require('../exceptions/wrong-arguments');
*/
function errorHandlerF(err, req, res, next) {
    if (err instanceof IncompleteJson ||
        err instanceof ResourceNotFound ||
        err instanceof RelatedResourceNotFound ||
        err instanceof NotifyFailed ||
        err instanceof Unexpected) {//cuando se usa?
        res.status(err.status)
        res.json({
            status: err.status,
            errorCode: err.errorCode
        })
    } else if (err.type === 'entity.parse.failed') {
        res.status(new InvalidJson.status);
        res.json({
            status: new InvalidJson.status,
            errorCode: new InvalidJson.errorCode
        })
    } else {
        next(err);
    }
}


module.exports = { errorHandlerF };

