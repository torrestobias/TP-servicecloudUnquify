const express = require('express');
const ValidateEntry = require("../validate-entry");
const validate = new ValidateEntry();
const artists = express();

/*
* GET : devuelve el artista con id dado.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists/:artistId').get((req, res) => {
    const unqfy = validate.getUNQfy();
    const artistId = parseInt(req.params.artistId);
    const artist = unqfy.getArtistById(artistId);
    res.status(200);
    res.json(artist);
});

/*
* POST : agrega un artista con un nombre y un pais.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists').post((req, res) => {
    const unqfy = validate.getUNQfy();
    let name = req.body.name;
    let country = req.body.country;
    unqfy.addArtist({ 'name': name, 'country': country });
    let artist = unqfy.getArtistByName(name);
    res.status(201);
    res.send(JSON.stringify(artist));
});

/*
* PATH : actualiza un artista con un nombre y un pais.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists/:artistId').patch((req, res) => {
    const unqfy = validate.getUNQfy();
    let artistId = parseInt(req.params.artistId);
    let name = req.body.name;
    let country = req.body.country;
    let artist = unqfy.getArtistById(artistId);
    unqfy.updateArtistWithNewData(artist, name, country);
    let updatedArtist = unqfy.getArtistById(artistId);
    res.status(200);
    res.send(JSON.stringify(updatedArtist));
});

/*
* DELETE : borrar un artista mediante un id.
* Faltan los errores y Excepcion si no encuentra al artista
*/
artists.route('/artists/:artistId').delete((req, res) => {
    const unqfy = validate.getUNQfy();
    let artistId = parseInt(req.params.artistId);
    let artist = unqfy.getArtistById(artistId);
    unqfy.deleteArtist({ 'artistName': artist.name });
    res.status(204);
    res.json({
        status: 204,
        response: "la frase que quieras"
    });
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

module.exports = { artists };