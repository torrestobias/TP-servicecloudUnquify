const express = require('express');
const ValidateEntry = require("../validate-entry");
const ExistingObjectException = require('../exceptions/existing-object');
const NonExistentObjectException = require('../exceptions/non-existent-object');
const validate = new ValidateEntry();
const albums = express();
const errors = require("./apiErrors");
const BadRequest = errors.BadRequest
const badRequest = new errors.BadRequest();
const duplicateRequest = new errors.DuplicateEntitie();
const resourceNotFound = new errors.ResourceNotFound()
const root = '/albums';

// GET : Obtiene el album correspondiente al id del parametro.
albums.get(root + '/:albumId', function (req, res) {
    try {
        const unqfy = validate.getUNQfy();
        const albumId = parseInt(req.params.albumId);
        const album = unqfy.getAlbumById(albumId);
        res.status(200)
        res.json(album);
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

// GET : Obtiene los albums correspondientes al nombre pasado por query param.
albums.get(root, function (req, res) {
    const unqfy = validate.getUNQfy();
    const name = req.query.name;
    const rta = unqfy.searchAlbumsByName(name)
    res.status(200)
    res.json(rta.albums);
});

// POST : Agregar un album a un artista.
albums.post(root, function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        validateBody(req.body);
        console.log('entre')
        let artistId = req.body.artistId;
        let name = req.body.name;
        let year = req.body.year;
        console.log(req.body)
        unqfy.addAlbum(artistId, { name: name, year: year });
        let artist = unqfy.getArtistById(artistId);
        console.log(artist)
        let album = artist.getAlbumByName(name);
        res.status(201);
        res.json(album);

    } catch (e) {
        if (e instanceof BadRequest) {
            res.status(badRequest.status)
            res.json({
                status: badRequest.status,
                errorCode: badRequest.errorCode
            })
        } else if (e instanceof NonExistentObjectException) { //si el artista no existe
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        } else if (e instanceof ExistingObjectException) { //si el album existe
            res.status(duplicateRequest.status)
            res.json({
                status: duplicateRequest.status,
                errorCode: duplicateRequest.errorCode
            })
        }
    }
});

// PATCH : Actualizar el año de un album.
albums.patch(root + '/:albumId', function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        let albumId = parseInt(req.params.albumId);
        validatePatchBody(req.body);
        let year = req.body.year;
        let album = unqfy.getAlbumById(albumId);
        unqfy.updateYearOfAlbum(album, year);
        let albumRta = unqfy.getAlbumById(albumId);
        res.status(200);
        res.json(albumRta);
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

// DELETE : Borra el album correspondiente al id pasado por parametro.
albums.delete(root + '/:albumId', function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        let albumId = parseInt(req.params.albumId);
        let album = unqfy.getAlbumById(albumId);
        let artist = unqfy.searchArtistByAlbumId(albumId);
        unqfy.deleteAlbum({ 'artistName': artist.name, 'name': album.name });
        res.status(204);
        res.json();
    } catch (e) {
        if (e instanceof NonExistentObjectException) { //si el album no existe
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }
});

function validateBody(body) {
    if (!(body.name && body.year && body.artistId !== undefined)) {
        throw badRequest
    }
}

function validatePatchBody(body) {
    if (!body.year) {
        throw badRequest
    }
}

module.exports = { albums };