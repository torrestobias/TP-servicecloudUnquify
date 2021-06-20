const express = require('express');
const ValidateEntry = require("../validate-entry");
const NonExistentObjectException = require('../exceptions/non-existent-object');
const validate = new ValidateEntry();
const tracks = express();
const errors = require("./apiErrors");
const resourceNotFound = new errors.ResourceNotFound()
const root = '/tracks';

// GET : Obtiene el album correspondiente al id del parametro.
tracks.get(root + '/:trackId' + '/lyrics', function (req, res) {
    try {
        const unqfy = validate.getUNQfy();
        const trackId = parseInt(req.params.trackId);
        const track = unqfy.getTrackById(trackId);
        res.status(200)
        res.json(track);
    } catch (e) {
        if (e instanceof NonExistentObjectException) { //si el track no existe
            res.status(resourceNotFound.status);
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }
});

module.exports = { tracks };