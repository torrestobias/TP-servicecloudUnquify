const express = require('express');
const ValidateEntry = require("../validate-entry");
const validate = new ValidateEntry();
const albums = express();
const root = '/albums';

// GET : Obtiene el album correspondiente al id del parametro.
albums.get(root + '/:albumId', function (req, res) {
    try {
        const unqfy = validate.getUNQfy();
        const albumId = parseInt(req.params.albumId);
        const album = unqfy.getAlbumById(albumId);
        res.status(200)
        res.json(album);
    }
    catch {
        //Levantar error
    }
});

// GET : Obtiene los albums correspondientes al nombre pasado por query param.
albums.get(root, function (req, res) {
    try {
        const unqfy = validate.getUNQfy();
        const name = req.query.name;
        const rta = unqfy.searchByName(name)
        res.status(200)
        res.json(rta.albums);
    }
    catch {
        //Levantar error
    }
});

// POST : Agregar un album a un artista.
albums.post(root, function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        let artistId = req.body.artistId;
        let name = req.body.name;
        let year = req.body.year;
        unqfy.addAlbum(artistId, { 'name': name, 'year': year });
        let artist = unqfy.getArtistById(artistId);
        let album = artist.getAlbumByName(name);
        res.status(201);
        res.json(album);

    }
    catch {
        //Levantar error
    }
});

// PATCH : Actualizar el año de un album.
albums.patch(root + '/:albumId', function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        let albumId = parseInt(req.params.albumId);
        let year = req.body.year;
        let album = unqfy.getAlbumById(albumId);
        unqfy.updateYearOfAlbum(album, year);
        let albumRta = unqfy.getAlbumById(albumId);
        res.status(200);
        res.json(albumRta);
    }
    catch {
        //Levantar error
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
        res.json("Album borrado.");
    }
    catch {
        //Levantar error
    }
});

module.exports = { albums };