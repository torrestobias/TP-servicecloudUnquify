const express = require('express');
const ValidateEntry = require("../validate-entry");
const validate = new ValidateEntry();
const artists = express();
const errors = require("./apiErrors");
const badRequest = new errors.BadRequest();

/*
* GET : devuelve el artista con id dado.
*/
artists.route('/artists/:artistId').get((req, res, next) => {
    const unqfy = validate.getUNQfy();
    var artist = {};
    try {
        const artistId = validate.parseIntEntry(req.params.artistId);
        artist = unqfy.getArtistById(artistId);
    } catch (e) {
        next(e);
    }
    res.status(200);
    res.json(artist);
});

/*
* POST : agrega un artista con un nombre y un pais.
*/
artists.route('/artists').post((req, res, next) => {
    const unqfy = validate.getUNQfy();
    var artist = {};
    try {
        validateBody(req.body);
        let name = req.body.name;
        let country = req.body.country;
        unqfy.addArtist({ 'name': name, 'country': country });
        artist = unqfy.getArtistByName(name);
    } catch (e) {
        next(e);
    }
    res.status(201);
    res.send(JSON.stringify(artist));
})

/*
* PATCH : actualiza un artista con un nombre y un pais.
*/
artists.route('/artists/:artistId').patch((req, res, next) => {
    const unqfy = validate.getUNQfy();
    var updatedArtist = {};
    try {
        let artistId = validate.parseIntEntry(req.params.artistId);
        validateBody(req.body);
        let artist = unqfy.getArtistById(artistId);
        unqfy.updateArtistWithNewData(artist, req.body.name, req.body.country);
        updatedArtist = unqfy.getArtistById(artistId);
    } catch (e) {
        next(e);
    }
    res.status(200);
    res.send(JSON.stringify(updatedArtist));
});

/*
* PUT : actualiza un artista con un nombre y un pais.
*/
artists.route('/artists/:artistId').put((req, res, next) => {
    const unqfy = validate.getUNQfy();
    var updatedArtist = {};
    try {
        let artistId = validate.parseIntEntry(req.params.artistId);
        validateBody(req.body);
        let artist = unqfy.getArtistById(artistId);
        unqfy.updateArtistWithNewData(artist, req.body.name, req.body.country);
        updatedArtist = unqfy.getArtistById(artistId);
    } catch (e) {
        next(e);
    }
    res.status(200);
    res.send(JSON.stringify(updatedArtist));
});

/*
* DELETE : borrar un artista mediante un id.
*/
artists.route('/artists/:artistId').delete((req, res, next) => {
    const unqfy = validate.getUNQfy();
    try {
        let artistId = validate.parseIntEntry(req.params.artistId);
        let artist = unqfy.getArtistById(artistId);
        unqfy.deleteArtist({ 'artistName': artist.name });
    } catch (e) {
        next(e);
    }
    res.status(204);
    res.json({});
});

/*
* SEARCH : devuelve un artista.
*/
artists.route('/artists').get((req, res, next) => {
    const unqfy = validate.getUNQfy();
    var rta = ''
    if (req.query.name) {
        const name = req.query.name;
        rta = unqfy.searchArtistByName(name)

    } else {
        rta = unqfy.searchArtistByName('');
    }
    res.status(200);
    res.json(rta);
});

function validateBody(body) {
    if (!(body.name && body.country)) {
        throw badRequest
    }
}

module.exports = { artists };