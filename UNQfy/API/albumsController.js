const express = require('express');
const ValidateEntry = require("../validate-entry");
const NonExistentObjectException = require('../exceptions/non-existent-object');
const validate = new ValidateEntry();
const albums = express();
const errors = require("./apiErrors");
const badRequest = new errors.BadRequest();
const relatedResourceNotFound = new errors.RelatedResourceNotFound()
const root = '/albums';

// GET : Obtiene el album correspondiente al id del parametro.
albums.get(root + '/:albumId', function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var album = {};
    try {
        albumId = validate.parseIntEntry(req.params.albumId);
        album = unqfy.getAlbumById(albumId);
    } catch (e) {
        next(e);
    }
    res.status(200)
    res.json(album);
});

// GET : Obtiene los albums correspondientes al nombre pasado por query param.
albums.get(root, function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var rta = '';
    if (req.query.name === undefined) {
        rta = unqfy.searchAlbumsByName('');
    } else {
        const name = req.query.name;
        rta = unqfy.searchAlbumsByName(name)
    }
    res.status(200)
    res.json(rta);
});

// POST : Agregar un album a un artista.
albums.post(root, function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var album = {};
    try {
        validateBody(req.body);
        let artistId = validate.parseIntEntry(req.body.artistId);
        let name = req.body.name;
        let year = req.body.year;
        unqfy.addAlbum(artistId, { name: name, year: year });
        let artist = unqfy.getArtistById(artistId);
        album = artist.getAlbumByName(name);
    } catch (e) {
        if (e instanceof NonExistentObjectException) { //si el artista no existe
            res.status(relatedResourceNotFound.status)
            res.json({
                status: relatedResourceNotFound.status,
                errorCode: relatedResourceNotFound.errorCode
            })
        } else {
            next(e);
        }
    }
    res.status(201);
    res.json(album);
});

// PATCH : Actualizar el año de un album.
albums.patch(root + '/:albumId', function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var albumRta = {};
    try {
        let albumId = validate.parseIntEntry(req.params.albumId);
        validatePatchBody(req.body);
        let year = req.body.year;
        let album = unqfy.getAlbumById(albumId);
        unqfy.updateYearOfAlbum(album, year);
        albumRta = unqfy.getAlbumById(albumId);
    } catch (e) {
        next(e);
    }
    res.status(200);
    res.json(albumRta);
});

// DELETE : Borra el album correspondiente al id pasado por parametro.
albums.delete(root + '/:albumId', function (req, res, next) {
    const unqfy = validate.getUNQfy();
    try {
        let albumId = validate.parseIntEntry(req.params.albumId);
        let album = unqfy.getAlbumById(albumId);
        let artist = unqfy.searchArtistByAlbumId(albumId);
        unqfy.deleteAlbum({ 'artistName': artist.name, 'name': album.name });
        res.status(204);
        res.json({});
    } catch (e) {
        next(e);
    }
/*     res.status(204);rariiiiisimoo
    res.json(); */
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