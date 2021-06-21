const errors = require("./apiErrors");
const badRequest = new errors.BadRequest();
const resourceNotFound = new errors.ResourceNotFound();
const duplicateRequest = new errors.DuplicateEntitie();
const BadRequest = errors.BadRequest;
const ExistingObjectException = require('../exceptions/existing-object');
const NonExistentObjectException = require('../exceptions/non-existent-object');
const NotANumberException = require('../exceptions/not-a-number');
const WrongArgumentsException = require('../exceptions/wrong-arguments');

function errorHandlerF(err, req, res, next) {
    if (err instanceof WrongArgumentsException ||
        err instanceof BadRequest ||
        err instanceof NotANumberException) {
        res.status(badRequest.status)
        res.json({
            status: badRequest.status,
            errorCode: badRequest.errorCode
        })
    } else if (err.type === 'entity.parse.failed') {
        res.status(err.status);
        res.json({
            status: err.status,
            errorCode: 'INVALID_JASON'
        })
    } else if (err instanceof NonExistentObjectException) {
        res.status(resourceNotFound.status);
        res.json({
            status: resourceNotFound.status,
            errorCode: resourceNotFound.errorCode
        })
    } else if (err instanceof ExistingObjectException) {
        res.status(duplicateRequest.status)
        res.json({
            status: duplicateRequest.status,
            errorCode: duplicateRequest.errorCode
        })
    } else {
        next(err);
    }
}


module.exports = { errorHandlerF };

