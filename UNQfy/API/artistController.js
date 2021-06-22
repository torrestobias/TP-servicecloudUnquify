const express = require('express');
const ExistingObjectException = require('../exceptions/existing-object');
const NonExistentObjectException = require('../exceptions/non-existent-object');
const ValidateEntry = require("../validate-entry");
const validate = new ValidateEntry();
const artists = express();
const errors = require("./apiErrors");
const BadRequest = errors.BadRequest
const badRequest = new errors.BadRequest();
const duplicateRequest = new errors.DuplicateEntitie();
const resourceNotFound = new errors.ResourceNotFound()

/*
* GET : devuelve el artista con id dado.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists/:artistId').get((req, res) => {
    try {
        const unqfy = validate.getUNQfy();
        const artistId = parseInt(req.params.artistId);
        const artist = unqfy.getArtistById(artistId);
        res.status(200);
        res.json(artist);
    } catch (e) {
        if (e instanceof NonExistentObjectException) { //si el artista no existe
            res.status(resourceNotFound.status);
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }
});

/*
* POST : agrega un artista con un nombre y un pais.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists').post((req, res) => {
    try {
        const unqfy = validate.getUNQfy();
        validateBody(req.body);
        let name = req.body.name;
        let country = req.body.country;
        unqfy.addArtist({ 'name': name, 'country': country });
        let artist = unqfy.getArtistByName(name);
        res.status(201);
        res.send(JSON.stringify(artist));

    } catch (e) {
        if (e instanceof BadRequest) {
            res.status(badRequest.status)
            res.json({
                status: badRequest.status,
                errorCode: badRequest.errorCode
            })
        } else if (e instanceof ExistingObjectException) { //si el artista existe
            res.status(duplicateRequest.status)
            res.json({
                status: duplicateRequest.status,
                errorCode: duplicateRequest.errorCode
            })
        }
    }
})

/*
* PATCH : actualiza un artista con un nombre y un pais.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists/:artistId').patch((req, res) => {
    try {
    const unqfy = validate.getUNQfy();
    let artistId = parseInt(req.params.artistId);
    validateBody(req.body);
    let name = req.body.name;
    let country = req.body.country;
    let artist = unqfy.getArtistById(artistId);
    unqfy.updateArtistWithNewData(artist, name, country);
    let updatedArtist = unqfy.getArtistById(artistId);
    res.status(200);
    res.send(JSON.stringify(updatedArtist));
} catch (e) {
    if (e instanceof BadRequest) {
        res.status(badRequest.status)
        res.json({
            status: badRequest.status,
            errorCode: badRequest.errorCode
        })
    } else if (e instanceof NonExistentObjectException) { //si el album no existe
        res.status(resourceNotFound.status)
        res.json({
            status: resourceNotFound.status,
            errorCode: resourceNotFound.errorCode
        })
    }
}
});

/*
* DELETE : borrar un artista mediante un id.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists/:artistId').delete((req, res) => {
    try {
        const unqfy = validate.getUNQfy();
        let artistId = parseInt(req.params.artistId);
        let artist = unqfy.getArtistById(artistId);
        unqfy.deleteArtist({ 'artistName': artist.name });
        res.status(204);
        res.json({});
    } catch (e) {
        if (e instanceof NonExistentObjectException) { //si el artista no existe
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }
});

/*
* SEARCH : devuelve un artista.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists').get((req, res) => {
    const unqfy = validate.getUNQfy();
    let artistName = req.query.name
    let artist = unqfy.searchArtistByName(artistName);
    res.status(200);
    res.json(artist);
});


function validateBody(body) {
    if (!(body.name && body.country)) {
        throw badRequest
    }
}

module.exports = { artists };